
import "server-only";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function archiveExpiredGatherings() {
  const cutoff = new Date(Date.now() - 1 * 60 * 1000);

  const result = await prisma.service.updateMany({
    where: {
      archivedAt: null,
      createdAt: {
        lte: cutoff,
      },
    },
    data: {
      archivedAt: new Date(),
    },
  });

  if (result.count > 0) {
    revalidatePath("/attendance/history");
    revalidatePath("/attendance");
    revalidatePath("/dashboard");
  }

  return result.count;
}
