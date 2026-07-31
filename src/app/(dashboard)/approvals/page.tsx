import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { PageHeader } from "@/components/ui/page-header";
import { PendingApprovalSection } from "@/components/approvals/pending approval-section";

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin =
    session.user.role === UserRole.ADMIN;

  const leaderDepartmentIds =
    session.user.departmentIds ?? [];

  const pendingLeaders = isAdmin
    ? await prisma.pendingLeader.findMany({
        where: {
          status: "PENDING",
        },
        include: {
          departments: {
            include: {
              department: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  const pendingWorkers =
    await prisma.pendingWorker.findMany({
      where: {
        status: "PENDING",

        ...(isAdmin
          ? {}
          : {
              departments: {
                some: {
                  departmentId: {
                    in: leaderDepartmentIds,
                  },
                },
              },
            }),
      },

      include: {
        departments: {
          include: {
            department: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pending Approvals"
        description="Approve leaders and workers awaiting activation."
      />

      {isAdmin && (
        <PendingApprovalSection
          title="Pending Leaders"
          type="leader"
          approvals={pendingLeaders.map((leader) => ({
            id: leader.id,
            fullName: leader.fullName,
            username: leader.username,
            phone: leader.phone,
            departments: leader.departments,
          }))}
        />
      )}

      <PendingApprovalSection
        title="Pending Workers"
        type="worker"
        approvals={pendingWorkers.map((worker) => ({
          id: worker.id,
          fullName: worker.fullName,
          gender: worker.gender,
          phone: worker.phone,
          departments: worker.departments,
        }))}
      />
    </div>
  );
}