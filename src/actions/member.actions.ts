"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";

type MemberField =
  | "fullName"
  | "gender"
  | "phone"
  | "whatsappNo"
  | "email"
  | "dateOfBirth"
  | "maritalStatus"
  | "occupation"
  | "address"
  | "dateJoined"
  | "departmentId"
  | "g12Id";

type ActionResult = {
  error?: string;
  success?: string;
  fieldErrors?: Partial<Record<MemberField, string>>;
};

async function requireAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);

  return session?.user?.role === UserRole.ADMIN;
}

function getField(formData: FormData, field: string): string {
  return formData.get(field)?.toString().trim() ?? "";
}

function isValidPhone(value: string) {
  return /^\+?\d{11,15}$/.test(value.trim());
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDate(value: string): boolean {
  if (!value) return false;

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

export async function createMember(
  formData: FormData
): Promise<ActionResult> {
  if (!(await requireAdmin())) {
    return { error: "Only an admin can add members." };
  }

  const fullName = getField(formData, "fullName");
  const gender = getField(formData, "gender");
  const phone = getField(formData, "phone");
  const whatsappNo = getField(formData, "whatsappNo");
  const email = getField(formData, "email");
  const dateOfBirth = getField(formData, "dateOfBirth");
  const maritalStatus = getField(formData, "maritalStatus");
  const occupation = getField(formData, "occupation");
  const address = getField(formData, "address");
  const dateJoined = getField(formData, "dateJoined");
  const departmentId = getField(formData, "departmentId");
  const g12Id = getField(formData, "g12Id");


  function normalizePhoneNumber(phone: string | null | undefined): string | null {
    if (!phone) return null;

    // Remove all spaces, dashes, or parentheses
    const cleaned = phone.replace(/[\s\-\(\)]/g, "");

    // If it starts with 234 without the plus, add the plus
    if (cleaned.startsWith("234") && cleaned.length === 13) {
      return "+" + cleaned;
    }

    // If it starts with local '0' (e.g. 08144543193), convert to +234
    if (cleaned.startsWith("0") && cleaned.length === 11) {
      return "+234" + cleaned.slice(1);
    }

    // If it already starts with +234, return as is
    return cleaned;
  }
  if (
    !fullName ||
    !gender ||
    !phone ||
    !dateOfBirth ||
    !maritalStatus ||
    !occupation ||
    !address ||
    !dateJoined
  ) {
    return { error: "Please fill in all required fields." };
  }

  if (!isValidPhone(phone)) {
    return {
      error: "Phone number must contain 11 to 15 digits.",
    };
  }

  if (whatsappNo && !isValidPhone(whatsappNo)) {
    return {
      error: "WhatsApp number must contain 11 to 15 digits.",
    };
  }

  if (email && !isValidEmail(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (!isValidDate(dateOfBirth) || !isValidDate(dateJoined)) {
    return { error: "Please enter valid dates." };
  }

  if (new Date(dateOfBirth) > new Date()) {
    return { error: "Date of birth cannot be in the future." };
  }

  // 1. Normalize the incoming values first
const normalizedPhone = normalizePhoneNumber(phone);
const normalizedWhatsApp = normalizePhoneNumber(whatsappNo);

try {
  // 2. Check the normalized phone
  const existingPhone = await prisma.member.findUnique({
    where: { phone: normalizedPhone ?? phone },
    select: { fullName: true },
  });

  if (existingPhone) {
    return {
      error: `${existingPhone.fullName} already uses this phone number.`,
    };
  }

  // 3. Check the normalized WhatsApp number
  if (normalizedWhatsApp) {
    const existingWhatsApp = await prisma.member.findUnique({
      where: { whatsappNo: normalizedWhatsApp },
      select: { fullName: true },
    });

    if (existingWhatsApp) {
      return {
        error: `${existingWhatsApp.fullName} already uses this WhatsApp number.`,
      };
    }
  }

    if (email) {
      const existingEmail = await prisma.member.findUnique({
        where: { email },
        select: { fullName: true },
      });

      if (existingEmail) {
        return {
          error: `${existingEmail.fullName} already uses this email address.`,
        };
      }
    }

    if (departmentId) {
      const department = await prisma.department.findFirst({
        where: { id: departmentId, isActive: true },
        select: { id: true },
      });

      if (!department) {
        return { error: "Please select an active department." };
      }
    }

    if (g12Id) {
      const g12 = await prisma.g12.findFirst({
        where: { id: g12Id, isActive: true },
        select: { id: true },
      });

      if (!g12) {
        return { error: "Please select an active G12 group." };
      }
    }

    const member = await prisma.member.create({
      data: {
        fullName,
        gender,
        phone,
        whatsappNo: whatsappNo || null,
        email: email || null,
        dateOfBirth: new Date(dateOfBirth),
        maritalStatus,
        occupation,
        address,
        dateJoined: new Date(dateJoined),
        departmentId: departmentId || null,
        g12Id: g12Id || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE_MEMBER",
        description: `${member.fullName} was added as a church member.`,
        departmentId: departmentId || null,
      },
    });

    revalidatePath("/members");
    revalidatePath("/dashboard");

    return { success: "Member added successfully." };
  } catch (error) {
    console.error("Create member error:", error);

    return {
      error: "Could not add member. Please try again.",
    };
  }
}

export async function deactivateMember(
  formData: FormData
): Promise<ActionResult> {
  if (!(await requireAdmin())) {
    return { error: "Only an admin can deactivate members." };
  }

  const memberId = getField(formData, "memberId");

  if (!memberId) {
    return { error: "Member ID is required." };
  }

  try {
    const member = await prisma.member.update({
      where: { id: memberId },
      data: { isActive: false },
    });

    await prisma.activityLog.create({
      data: {
        action: "DEACTIVATE_MEMBER",
        description: `${member.fullName} was deactivated as a church member.`,
        departmentId: member.departmentId,
      },
    });

    revalidatePath("/members");
    revalidatePath(`/members/${memberId}`);
    revalidatePath("/dashboard");

    return { success: "Member deactivated successfully." };
  } catch (error) {
    console.error("Deactivate member error:", error);

    return {
      error: "Could not deactivate member. Please try again.",
    };
  }
}

export async function reactivateMember(
  formData: FormData
): Promise<ActionResult> {
  if (!(await requireAdmin())) {
    return { error: "Only an admin can reactivate members." };
  }

  const memberId = getField(formData, "memberId");

  if (!memberId) {
    return { error: "Member ID is required." };
  }

  try {
    const member = await prisma.member.update({
      where: { id: memberId },
      data: { isActive: true },
    });

    await prisma.activityLog.create({
      data: {
        action: "REACTIVATE_MEMBER",
        description: `${member.fullName} was reactivated as a church member.`,
        departmentId: member.departmentId,
      },
    });

    revalidatePath("/members");
    revalidatePath(`/members/${memberId}`);
    revalidatePath("/dashboard");

    return { success: "Member reactivated successfully." };
  } catch (error) {
    console.error("Reactivate member error:", error);

    return {
      error: "Could not reactivate member. Please try again.",
    };
  }
}