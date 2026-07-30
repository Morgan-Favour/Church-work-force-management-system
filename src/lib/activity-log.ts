import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type DbClient = Prisma.TransactionClient | typeof prisma;

type LogActivityParams = {
  action: string;
  description: string;
  actorId?: string;
  departmentId?: string;
};

export async function logActivity(
  db: DbClient,
  {
    action,
    description,
    actorId,
    departmentId,
  }: LogActivityParams
) {
  return db.activityLog.create({
    data: {
      action,
      description,
      actorId,
      departmentId,
    },
  });
}