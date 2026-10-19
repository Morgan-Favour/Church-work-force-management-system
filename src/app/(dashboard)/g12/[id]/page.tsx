
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    ArrowLeft,
    MapPin,
    Users,
    UserRound,
    MessageCircle,
    Pencil,
} from "lucide-react";

type G12DetailsPageProps = {
    params: Promise<{ id: string }>;
};

export default async function G12DetailsPage({
    params,
}: G12DetailsPageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== UserRole.ADMIN) {
        redirect("/dashboard");
    }

    const { id } = await params;

    const group = await prisma.g12.findUnique({
        where: { id },
        include: {
            members: {
                where: { isActive: true },
                select: {
                    id: true,
                    fullName: true,
                    phone: true,
                    email: true,
                    dateJoined: true,
                },
                orderBy: { fullName: "asc" },
            },
        },
    });

    if (!group || !group.isActive) {
        notFound();
    }

    const contactName =
        group.contactPerson === "HOST"
            ? group.hostName
            : group.leaderName;

    return (
        <div className="mx-auto w-full space-y-6">
            <Link
                href="/g12"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to G12 Directory
            </Link>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Users className="h-6 w-6" />
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {group.name}
                        </h1>
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0" />
                            {group.hostLocation || "No host location provided"}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-card px-4 py-3">
                    <p className="text-sm text-muted-foreground">Active members</p>
                    <p className="text-2xl font-bold">{group.members.length}</p>
                </div>
            </div>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold">G12 Information</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-border bg-card p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <UserRound className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Leadership & Host</h3>
                        </div>

                        <dl className="space-y-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Host name</dt>
                                <dd className="mt-1 font-medium">
                                    {group.hostName || "Not provided"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-muted-foreground">G12 leader</dt>
                                <dd className="mt-1 font-medium">
                                    {group.leaderName || "Not provided"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-muted-foreground">Contact person</dt>
                                <dd className="mt-1 font-medium">
                                    {contactName || "Not provided"}
                                    {group.contactPerson
                                        ? ` (${group.contactPerson.toLowerCase()})`
                                        : ""}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Contact Information</h3>
                        </div>

                        <dl className="space-y-4 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Phone</dt>
                                <dd className="mt-1">
                                    {group.contactPhone ? (
                                        <a
                                            href={`tel:${group.contactPhone}`}
                                            className="font-medium text-primary hover:underline"
                                        >
                                            {group.contactPhone}
                                        </a>
                                    ) : (
                                        "Not provided"
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-muted-foreground">WhatsApp</dt>
                                <dd className="mt-1">
                                    {group.contactWhatsApp ? (
                                        <a
                                            href={`https://wa.me/${group.contactWhatsApp.replace(/\D/g, "")}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-medium text-primary hover:underline"
                                        >
                                            {group.contactWhatsApp}
                                        </a>
                                    ) : (
                                        "Not provided"
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-muted-foreground">Email</dt>
                                <dd className="mt-1">
                                    {group.contactEmail ? (
                                        <a
                                            href={`mailto:${group.contactEmail}`}
                                            className="break-all font-medium text-primary hover:underline"
                                        >
                                            {group.contactEmail}
                                        </a>
                                    ) : (
                                        "Not provided"
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">G12 Members</h2>
                        <p className="text-sm text-muted-foreground">
                            Active members currently assigned to this group.
                        </p>
                    </div>

                    <span className="text-sm text-muted-foreground">
                        {group.members.length}{" "}
                        {group.members.length === 1 ? "member" : "members"}
                    </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    {group.members.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                            <h3 className="font-medium">No members assigned yet</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Members assigned to this G12 will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-border bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Name</th>
                                        <th className="px-4 py-3 font-medium">Phone</th>
                                        <th className="px-4 py-3 font-medium">Email</th>
                                        <th className="px-4 py-3 font-medium">Date Joined</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {group.members.map((member) => (
                                        <tr key={member.id}>
                                            <td className="px-4 py-3 font-medium">
                                                {member.fullName}
                                            </td>
                                            <td className="px-4 py-3">
                                                <a
                                                    href={`tel:${member.phone}`}
                                                    className="hover:text-primary"
                                                >
                                                    {member.phone}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3">
                                                {member.email || "—"}
                                            </td>
                                            <td className="px-4 py-3">
                                                {new Intl.DateTimeFormat("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                }).format(member.dateJoined)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
            <div className="flex justify-end">
                <Link
                        href={`/g12/${group.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit G12
                </Link>
            </div>
        </div>
    );
}
