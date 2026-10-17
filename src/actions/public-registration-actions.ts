"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type RegistrationField =
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

export type RegistrationResult = {
  error?: string;
  success?: string;
  fieldErrors?: Partial<Record<RegistrationField, string>>;
};

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

export async function submitPublicRegistration(
  token: string,
  _previousState: RegistrationResult,
  formData: FormData
): Promise<RegistrationResult> {
  if (!token) {
    return { error: "Invalid registration link." };
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

  const fieldErrors: Partial<Record<RegistrationField, string>> = {};

  if (!fullName) {
    fieldErrors.fullName = "Please enter your full name.";
  }

  if (!gender) {
    fieldErrors.gender = "Please select your gender.";
  }

  if (!phone) {
    fieldErrors.phone = "Please enter your phone number.";
  } else if (!isValidPhone(phone)) {
    fieldErrors.phone = "Enter 11–15 digits, without spaces or symbols.";
  }

  if (whatsappNo && !isValidPhone(whatsappNo)) {
    fieldErrors.whatsappNo = "Enter 11–15 digits, without spaces or symbols.";
  }

  if (email && !isValidEmail(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (!dateOfBirth || !isValidDate(dateOfBirth)) {
    fieldErrors.dateOfBirth = "Please enter a valid date of birth.";
  } else {
    const dob = new Date(dateOfBirth);
    if (dob > today) {
      fieldErrors.dateOfBirth = "Date of birth cannot be in the future.";
    }
  }

  if (!maritalStatus) {
    fieldErrors.maritalStatus = "Please select your marital status.";
  }

  if (!occupation) {
    fieldErrors.occupation = "Please enter your occupation.";
  }

  if (!address) {
    fieldErrors.address = "Please enter your residential address.";
  }

  if (!dateJoined || !isValidDate(dateJoined)) {
    fieldErrors.dateJoined = "Please enter a valid date joined.";
  } else {
    const joined = new Date(dateJoined);
    if (joined > today) {
      fieldErrors.dateJoined = "Date joined cannot be in the future.";
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  const dob = new Date(dateOfBirth);
  const joined = new Date(dateJoined);

  try {
    // Confirm that this registration link is still active.
    const activeLink = await prisma.memberRegistrationLink.findFirst({
      where: {
        token,
        isActive: true,
      },
      select: { id: true },
    });

    if (!activeLink) {
      return {
        error:
          "This registration link is no longer active. Please request the current link from the church.",
      };
    }

    const existingPhone = await prisma.member.findUnique({
      where: { phone },
      select: { fullName: true },
    });

    if (existingPhone) {
      return {
        error: "Please correct the highlighted fields.",
        fieldErrors: {
          phone: `${existingPhone.fullName} already uses this phone number.`,
        },
      };
    }

    if (whatsappNo) {
      const existingWhatsApp = await prisma.member.findUnique({
        where: { whatsappNo },
        select: { fullName: true },
      });

      if (existingWhatsApp) {
        return {
          error: "Please correct the highlighted fields.",
          fieldErrors: {
            whatsappNo: `${existingWhatsApp.fullName} already uses this WhatsApp number.`,
          },
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
          error: "Please correct the highlighted fields.",
          fieldErrors: {
            email: `${existingEmail.fullName} already uses this email address.`,
          },
        };
      }
    }

    if (departmentId) {
      const department = await prisma.department.findFirst({
        where: { id: departmentId, isActive: true },
        select: { id: true },
      });

      if (!department) {
        return {
          error: "Please correct the highlighted fields.",
          fieldErrors: {
            departmentId: "Please select an active department.",
          },
        };
      }
    }

    if (g12Id) {
      const g12 = await prisma.g12.findFirst({
        where: { id: g12Id, isActive: true },
        select: { id: true },
      });

      if (!g12) {
        return {
          error: "Please correct the highlighted fields.",
          fieldErrors: {
            g12Id: "Please select an active G12 group.",
          },
        };
      }
    }

    // Recheck the link immediately before creating the member.
    const member = await prisma.$transaction(async (tx) => {
      const stillActive = await tx.memberRegistrationLink.findFirst({
        where: {
          id: activeLink.id,
          isActive: true,
        },
        select: { id: true },
      });

      if (!stillActive) {
        throw new Error("REGISTRATION_LINK_INACTIVE");
      }

      const createdMember = await tx.member.create({
        data: {
          fullName,
          gender,
          phone,
          whatsappNo: whatsappNo || null,
          email: email || null,
          dateOfBirth: dob,
          maritalStatus,
          occupation,
          address,
          dateJoined: joined,
          departmentId: departmentId || null,
          g12Id: g12Id || null,
        },
      });

      await tx.activityLog.create({
        data: {
          action: "PUBLIC_MEMBER_REGISTRATION",
          description: `${createdMember.fullName} registered through the public church registration form.`,
          departmentId: departmentId || null,
        },
      });

      return createdMember;
    });

    revalidatePath("/members");
    revalidatePath("/dashboard");

    return {
      success: `Registration completed successfully. Welcome, ${member.fullName}!`,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "REGISTRATION_LINK_INACTIVE"
    ) {
      return {
        error:
          "This registration link is no longer active. Please request the current link from the church.",
      };
    }

    // Unique fields can still conflict if two submissions happen together.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        error:
          "These contact details are already registered. Please confirm your details are correct, if they are correct, then congrats you're already a member!",
      };
    }

    console.error("Public member registration error:", error);

    return {
      error: "Could not complete registration. Please try again.",
    };
  }
}