
"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export type G12Field =
    | "name"
    | "hostLocation"
    | "hostName"
    | "leaderName"
    | "contactPhone"
    | "contactWhatsApp"
    | "contactEmail"
    | "contactPerson";

export type G12ActionResult = {
    error?: string;
    success?: string;
    fieldErrors?: Partial<Record<G12Field, string>>;
};

function isValidPhone(value: string): boolean {
    return /^\+?\d{11,15}$/.test(value);
}

function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function createG12(
    formData: FormData
): Promise<G12ActionResult> {
    await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const hostLocation = String(
        formData.get("hostLocation") ?? ""
    ).trim();
    const hostName = String(formData.get("hostName") ?? "").trim();
    const leaderName = String(
        formData.get("leaderName") ?? ""
    ).trim();
    const contactPhone = String(
        formData.get("contactPhone") ?? ""
    ).trim();
    const contactWhatsApp = String(
        formData.get("contactWhatsApp") ?? ""
    ).trim();
    const contactEmail = String(
        formData.get("contactEmail") ?? ""
    ).trim().toLowerCase();
    const contactPerson = String(
        formData.get("contactPerson") ?? "LEADER"
    ).trim().toUpperCase();

    const fieldErrors: Partial<Record<G12Field, string>> = {};

    if (!name) fieldErrors.name = "G12 name is required.";
    if (!hostLocation) {
        fieldErrors.hostLocation = "Host location is required.";
    }
    if (!hostName) fieldErrors.hostName = "Host name is required.";
    if (!leaderName) {
        fieldErrors.leaderName = "G12 leader name is required.";
    }

    if (!contactPhone) {
        fieldErrors.contactPhone = "Contact phone number is required.";
    } else if (!isValidPhone(contactPhone)) {
        fieldErrors.contactPhone =
            "Enter a valid phone number with 11–15 digits, optionally starting with +.";
    }

    if (
        contactWhatsApp &&
        !isValidPhone(contactWhatsApp)
    ) {
        fieldErrors.contactWhatsApp =
            "Enter a valid WhatsApp number with 11–15 digits, optionally starting with +.";
    }

    if (contactEmail && !isValidEmail(contactEmail)) {
        fieldErrors.contactEmail = "Enter a valid email address.";
    }

    if (!["HOST", "LEADER"].includes(contactPerson)) {
        fieldErrors.contactPerson =
            "Choose either the host or the G12 leader.";
    }

    if (Object.keys(fieldErrors).length > 0) {
        return {
            error: "Please correct the highlighted fields.",
            fieldErrors,
        };
    }

    try {
        const existingG12 = await prisma.g12.findUnique({
            where: { name },
            select: { id: true },
        });

        if (existingG12) {
            return {
                error: "A G12 with this name already exists.",
                fieldErrors: {
                    name: "This G12 name is already in use.",
                },
            };
        }

        await prisma.g12.create({
            data: {
                name,
                hostLocation,
                hostName,
                leaderName,
                contactPhone,
                contactWhatsApp: contactWhatsApp || null,
                contactEmail: contactEmail || null,
                contactPerson,
            },
        });

        revalidatePath("/g12");
        revalidatePath("/members");
        revalidatePath("/dashboard");

        return { success: "G12 created successfully." };
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return {
                error: "A G12 with this name already exists.",
                fieldErrors: {
                    name: "This G12 name is already in use.",
                },
            };
        }

        console.error("Create G12 error:", error);

        return {
            error: "Something went wrong while creating the G12. Please try again.",
        };
    }
}
