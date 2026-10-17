
"use server";

import { randomBytes } from "node:crypto";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type RegistrationLinkActionState = {
  error?: string;
  success?: string;
};

export async function generateRegistrationLink(
  _previousState: RegistrationLinkActionState,
  _formData: FormData
): Promise<RegistrationLinkActionState> {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== UserRole.ADMIN) {
    return { error: "Only an admin can manage registration links." };
  }

  const token = randomBytes(32).toString("hex");

  try {
    await prisma.$transaction(
      async (tx) => {
        await tx.memberRegistrationLink.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });

        await tx.memberRegistrationLink.create({
          data: {
            token,
            isActive: true,
          },
        });

        await tx.activityLog.create({
          data: {
            action: "GENERATE_MEMBER_REGISTRATION_LINK",
            description:
              "An admin generated a new public member registration link.",
          },
        });
      },
      {
        isolationLevel: "Serializable",
      }
    );

    revalidatePath("/members/registration-link");
    revalidatePath("/register");

    return { success: "A new registration link has been generated." };
  } catch (error) {
    console.error("Generate registration link error:", error);

    return {
      error:
        "Could not generate the registration link. Please try again.",
    };
  }
}
