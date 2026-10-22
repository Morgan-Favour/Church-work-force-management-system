
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET is not configured.");

    return NextResponse.json(
      { error: "Cron job is not configured." },
      { status: 500 }
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

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

    console.info(`Archived ${result.count} gathering(s).`);

    return NextResponse.json({
      success: true,
      archivedCount: result.count,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Gathering archive job failed:", error);

    return NextResponse.json(
      { error: "Failed to archive gatherings." },
      { status: 500 }
    );
  }
}
