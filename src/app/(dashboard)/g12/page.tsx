
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import G12Form from "@/components/g12/g12-form";
import { Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import G12Directory from "@/components/g12/g12-directory";

export default async function G12Page() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== UserRole.ADMIN) {
        redirect("/dashboard");
    }

    const groups = await prisma.g12.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: {
            id: true,
            name: true,
            hostLocation: true,
            hostName: true,
            leaderName: true,
            contactPhone: true,
            contactWhatsApp: true,
            contactEmail: true,
            contactPerson: true,
        },
    });

    return (
        <div className="mx-auto max-w-5xl space-y-6 pb-10">
            <div>
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                        <Users size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            G12 Management
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Create and manage church G12 groups.
                        </p>
                    </div>
                </div>
            </div>

            <G12Form />
            <G12Directory groups={groups} />
        </div>
    );
}
