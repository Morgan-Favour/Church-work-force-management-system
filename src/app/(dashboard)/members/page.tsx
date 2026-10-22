import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MemberDirectory from "@/components/members/member-directory";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  const members = await prisma.member.findMany({
    orderBy: { fullName: "asc" },
    include: {
      department: {
        select: { name: true },
      },
      g12: {
        select: { name: true },
      },
    },
  });

  const departments = await prisma.department.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const g12Groups = await prisma.g12.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="">
      <MemberDirectory
        members={members.map((member) => ({
          ...member,
          dateJoined: member.dateJoined.toISOString(),
          dateOfBirth: member.dateOfBirth.toISOString(),
          createdAt: member.createdAt.toISOString(),
          updatedAt: member.updatedAt.toISOString(),
        }))}
        departments={departments}
        g12Groups={g12Groups}
      />
    </div>
  );
}