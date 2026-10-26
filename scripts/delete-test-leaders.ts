
import { prisma } from "../src/lib/prisma";

const testUsernames = ["@testleader", "testleader2"];

async function main() {
  const users = await prisma.user.findMany({
    where: {
      username: { in: testUsernames },
    },
    include: {
      worker: {
        include: {
          departments: true,
          attendance: true,
          member: true,
          users: true,
        },
      },
      leaderDepartments: true,
    },
  });

  if (users.length !== 2) {
    throw new Error(
      `Expected to find exactly 2 test leaders, but found ${users.length}. Nothing deleted.`
    );
  }

  for (const user of users) {
    if (
      user.username === "testleader2" &&
      user.worker &&
      (user.worker.attendance.length > 0 ||
        user.worker.member ||
        user.worker.users.some((otherUser) => otherUser.id !== user.id))
    ) {
      throw new Error(
        "Test Leader 2's worker has related records or other users. Nothing deleted; inspect these records first."
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    for (const user of users) {
      await tx.leaderDepartment.deleteMany({
        where: { userId: user.id },
      });

      await tx.user.delete({
        where: { id: user.id },
      });

      if (user.worker) {
        await tx.workerDepartment.deleteMany({
          where: { workerId: user.worker.id },
        });

        await tx.worker.delete({
          where: { id: user.worker.id },
        });
      }
    }
  });

  console.log("Both test leader accounts and their worker profiles were deleted.");
}

main()
  .catch((error) => {
    console.error("Cleanup failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
