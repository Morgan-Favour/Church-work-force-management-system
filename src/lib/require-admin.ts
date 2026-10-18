
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== UserRole.ADMIN) {
        throw new Error("Forbidden: Admin access required.");
    }

    return session.user;
}
