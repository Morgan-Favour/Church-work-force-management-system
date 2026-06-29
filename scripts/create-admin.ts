import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: {
      username: "admin@church.com",
    },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin12345", 10);

  const admin = await prisma.user.create({
    data: {
      fullName: "Super Admin",
      username: "admin@church.com",
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
    },
  });

  console.log("Admin created:", admin.username);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });