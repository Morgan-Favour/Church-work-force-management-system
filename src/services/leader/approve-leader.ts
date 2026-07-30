import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";

export async function approveLeaderService(pendingLeaderId: string) {
    const pending = await prisma.pendingLeader.findUnique({
        where: {
            id: pendingLeaderId,
        },
        include: {
            invite: true,
            departments: {
                include: {
                    department: true,
                },
            },
        },
    });

    if (!pending) {
        throw new Error("Pending leader not found.");
    }

    if (pending.status !== "PENDING") {
        throw new Error("Leader has already been processed.");
    }

    if (
        !pending.fullName ||
        !pending.username ||
        !pending.password
    ) {
        throw new Error("Leader has not completed registration.");
    }

    const departmentIds = pending.departments.map(
        (d) => d.departmentId
    );

    if (!pending.password) {
        throw new Error("Leader has not completed registration.");
    }

    const hashedPassword = pending.password;

    const usernameExists = await prisma.user.findUnique({
        where: {
            username: pending.username,
        },
    });

    if (usernameExists) {
        throw new Error("Username already exists.");
    }

    const existingLeader = await prisma.leaderDepartment.findFirst({
        where: {
            departmentId: {
                in: departmentIds,
            },
        },
        include: {
            department: true,
            user: true,
        },
    });

    if (existingLeader) {
        throw new Error(
            `${existingLeader.department.name} already has a leader (${existingLeader.user.fullName}).`
        );
    }

    await prisma.$transaction(async (tx) => {
        let worker = null;

        if (pending.phone) {
            worker = await tx.worker.findUnique({
                where: {
                    phone: pending.phone,
                },
            });
        }

        if (!worker) {
            worker = await tx.worker.create({
                data: {
                    fullName: pending.fullName,
                    phone: pending.phone ?? `leader-${pending.id}`,
                    isActive: true,
                },
            });
        } else {
            worker = await tx.worker.update({
                where: {
                    id: worker.id,
                },
                data: {
                    fullName: pending.fullName,
                    isActive: true,
                },
            });
        }

        await tx.workerDepartment.createMany({
            data: departmentIds.map((departmentId) => ({
                workerId: worker.id,
                departmentId,
            })),
            skipDuplicates: true,
        });

        const user = await tx.user.create({
            data: {
                fullName: pending.fullName,
                username: pending.username,
                password: hashedPassword,
                role: UserRole.DEPARTMENT_LEADER,
                departmentId: departmentIds[0],
                workerId: worker.id,
                isActive: true,
            },
        });

        await tx.leaderDepartment.createMany({
            data: departmentIds.map((departmentId) => ({
                userId: user.id,
                departmentId,
            })),
            skipDuplicates: true,
        });

        await tx.pendingLeader.update({
            where: {
                id: pending.id,
            },
            data: {
                status: "APPROVED",
            },
        });

        await tx.invite.update({
            where: {
                id: pending.inviteId,
            },
            data: {
                used: true,
            },
        });

        await logActivity(tx, {
            action: "APPROVE_LEADER",
            description: `${pending.fullName} approved as department leader.`,
        });
    });
}