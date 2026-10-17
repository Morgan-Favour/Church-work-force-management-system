
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RegistrationLinkManager from "@/components/members/registration-link-manager";
import { ArrowLeft, Link } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RegistrationLinkPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    if (session.user.role !== UserRole.ADMIN) {
        redirect("/dashboard");
    }

    const activeLink = await prisma.memberRegistrationLink.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        select: {
            token: true,
            createdAt: true,
        },
    });

    const baseUrl = (
        process.env.NEXTAUTH_URL ??
        process.env.NEXT_PUBLIC_APP_URL ??
        "http://localhost:3000"
    ).replace(/\/+$/, "");

    const currentUrl = activeLink
        ? `${baseUrl}/register/${activeLink.token}`
        : null;

    return (
        <div className="space-y-6">
            <Link
                href="/members"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
                <ArrowLeft size={17} />
                Back to members
            </Link>
            <header>
                <h1 className="text-2xl font-bold tracking-tight">
                    Member Registration Link
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Generate and share the public link for registering new church
                    members.
                </p>
            </header>

            <RegistrationLinkManager
                currentUrl={currentUrl}
                createdAt={activeLink?.createdAt.toISOString() ?? null}
            />
        </div>
    );
}
