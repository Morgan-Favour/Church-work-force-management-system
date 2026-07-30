import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { PageHeader } from "@/components/ui/page-header";
import { approveLeader, rejectLeader } from "@/actions/leader.actions";

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === UserRole.ADMIN;
  const leaderDepartmentIds = session.user.departmentIds ?? [];

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

  const pendingWorkers = await prisma.pendingWorker.findMany({
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
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-5 text-xl font-bold">
            Pending Leaders ({pendingLeaders.length})
          </h2>

          <div className="space-y-4">
            {pendingLeaders.length === 0 && (
              <p className="text-slate-500">No pending leaders.</p>
            )}

            {pendingLeaders.map((leader) => (
              <div key={leader.id} className="rounded-xl border p-4">
                <h3 className="font-semibold">{leader.fullName}</h3>

                <p className="text-sm text-slate-500">@{leader.username}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {leader.departments.map((dept) => (
                    <span
                      key={dept.id}
                      className="rounded-full bg-[#0e2d33]/10 px-3 py-1 text-xs"
                    >
                      {dept.department.name}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex gap-3">
                  <form action={approveLeader}>
                    <input
                      type="hidden"
                      name="pendingLeaderId"
                      value={leader.id}
                    />

                    <button
                      type="submit"
                      className="rounded-xl bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                  </form>

                  <form action={rejectLeader}>
                    <input
                      type="hidden"
                      name="pendingLeaderId"
                      value={leader.id}
                    />

                    <button className="rounded-xl bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700">
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border bg-white p-6">
        <h2 className="mb-5 text-xl font-bold">
          Pending Workers ({pendingWorkers.length})
        </h2>

        <div className="space-y-4">
          {pendingWorkers.length === 0 && (
            <p className="text-slate-500">No pending workers.</p>
          )}

          {pendingWorkers.map((worker) => (
            <div key={worker.id} className="rounded-xl border p-4">
              <h3 className="font-semibold">{worker.fullName}</h3>

              <p className="text-sm text-slate-500">{worker.phone}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {worker.departments.map((dept) => (
                  <span
                    key={dept.id}
                    className="rounded-full bg-[#0e2d33]/10 px-3 py-1 text-xs"
                  >
                    {dept.department.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}