"use server";

import { prisma } from "@/lib/prisma";
import { ApprovalStatus, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function approveLeader(
    pendingLeaderId: string
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.ADMIN) {
        return {
            error: "Unauthorized",
        };
    }

    const pendingLeader =
        await prisma.pendingLeader.findUnique({
            where: {
                id: pendingLeaderId,
            },
            include: {
                invite: true,
                departments: true,
            },
        });

    if (!pendingLeader) {
        return {
            error: "Leader not found.",
        };
    }

    if (pendingLeader.status !== ApprovalStatus.PENDING) {
        return {
            error: "Already processed.",
        };
    }

    const existingUser =
        await prisma.user.findUnique({
            where: {
                username: pendingLeader.username,
            },
        });

    if (existingUser) {
        return {
            error: "Username already exists.",
        };
    }

    const user = await prisma.user.create({
        data: {
            fullName: pendingLeader.fullName,
            username: pendingLeader.username,
            password: pendingLeader.password!,
            role: UserRole.DEPARTMENT_LEADER,
        },
    });

    await prisma.leaderDepartment.createMany({
        data: pendingLeader.departments.map((d) => ({
            userId: user.id,
            departmentId: d.departmentId,
        })),
    });

    await prisma.pendingLeader.update({
        where: {
            id: pendingLeader.id,
        },
        data: {
            status: ApprovalStatus.APPROVED,
        },
    });

    await prisma.invite.update({
        where: {
            id: pendingLeader.inviteId,
        },
        data: {
            used: true,
        },
    });

    await prisma.activityLog.create({
        data: {
            action: "APPROVE_LEADER",
            description: `${pendingLeader.fullName} approved as department leader.`,
            actorId: session.user.id,
        },
    });

    revalidatePath("/approvals");

    return {
        success: true,
    };
}

export async function rejectLeader(
    pendingLeaderId: string
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.ADMIN) {
        return {
            error: "Unauthorized",
        };
    }

    await prisma.pendingLeader.update({
        where: {
            id: pendingLeaderId,
        },
        data: {
            status: ApprovalStatus.REJECTED,
        },
    });

    await prisma.activityLog.create({
        data: {
            action: "REJECT_LEADER",
            description: "Leader registration rejected.",
            actorId: session.user.id,
        },
    });

    revalidatePath("/approvals");

    return {
        success: true,
    };
}