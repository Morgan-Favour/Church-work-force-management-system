"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { InviteType, UserRole } from "@prisma/client";


const EXPIRES_IN_DAYS = 7;

function generateInviteToken() {
  return crypto.randomBytes(32).toString("hex");
}

function generateExpiryDate() {
  const date = new Date();
  date.setDate(date.getDate() + EXPIRES_IN_DAYS);
  return date;
}

/* ======================================================
   CREATE WORKER INVITE
====================================================== */

export async function createWorkerInvite(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const fullName = formData.get("fullName")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim() || null;
  const gender = formData.get("gender")?.toString().trim() || null;

  const departmentIds = formData
    .getAll("departmentIds")
    .map(String)
    .filter(Boolean);

  if (!fullName || departmentIds.length === 0) {
    throw new Error("Missing required fields.");
  }

  // Leaders can only invite workers into their own departments.
  if (session.user.role === UserRole.DEPARTMENT_LEADER) {
    const leaderDepartments = session.user.departmentIds ?? [];

    const invalidDepartment = departmentIds.find(
      (id) => !leaderDepartments.includes(id)
    );

    if (invalidDepartment) {
      throw new Error("You can only invite workers to your own department.");
    }
  }

  const token = generateInviteToken();

  const invite = await prisma.invite.create({
    data: {
      token,
      type: InviteType.WORKER,
      expiresAt: generateExpiryDate(),
    },
  });

  await prisma.pendingWorker.create({
    data: {
      fullName,
      phone,
      gender,
      inviteId: invite.id,

      departments: {
        create: departmentIds.map((departmentId) => ({
          departmentId,
        })),
      },
    },
  });

  return {
    success: true,
    inviteLink: `${process.env.NEXTAUTH_URL}/invite/worker/${token}`,
  };
}


