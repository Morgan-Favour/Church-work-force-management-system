
import { prisma } from "../src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    where: {
      role: "DEPARTMENT_LEADER",
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      workerId: true,
      worker: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
