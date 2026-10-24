
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    MapPin,
    Search,
    Users,
    UserRound,
    Phone,
    Mail,
    MessageCircle,
    MapPinned,
    ArrowRight,
} from "lucide-react";

export type G12DirectoryItem = {
    id: string;
    name: string;
    hostLocation: string | null;
    hostName: string | null;
    leaderName: string | null;
    contactPhone: string | null;
    contactWhatsApp: string | null;
    contactEmail: string | null;
    contactPerson: string | null;
};

type G12DirectoryProps = {
    groups: G12DirectoryItem[];
};

export default function G12Directory({ groups }: G12DirectoryProps) {
    const [search, setSearch] = useState("");

    const filteredGroups = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return groups;

        return groups.filter((group) =>
            [
                group.name,
                group.hostLocation,
                group.hostName,
                group.leaderName,
                group.contactPhone,
                group.contactWhatsApp,
                group.contactEmail,
            ].some((value) => value?.toLowerCase().includes(query))
        );
    }, [groups, search]);

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    {filteredGroups.length}{" "}
                    {filteredGroups.length === 1 ? "group" : "groups"}
                    {search.trim() ? " found" : " registered"}
                </p>
            </div>

            <div className="relative">
                <Search
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by G12 name, host, leader or contact..."
                    aria-label="Search G12 groups"
                    className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
            </div>

            {filteredGroups.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-12 text-center">
                    <Users
                        size={32}
                        className="mx-auto text-muted-foreground"
                    />
                    <h3 className="mt-3 font-semibold text-foreground">
                        {groups.length === 0
                            ? "No G12 groups yet"
                            : "No matching G12 groups"}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {groups.length === 0
                            ? "Create your first G12 using the form above."
                            : "Try searching with a different name or contact detail."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {filteredGroups.map((group) => (
                        <article
                            key={group.id}
                            className="min-w-0 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm transition hover:shadow-md sm:p-6"
                        >
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 rounded-xl bg-primary/10 p-3 text-primary">
                                    <Users size={22} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="wrap-break-word text-lg font-bold">
                                        {group.name}
                                    </h3>

                                    <p className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
                                        <MapPin
                                            size={16}
                                            className="mt-0.5 shrink-0"
                                        />
                                        <span>
                                            {group.hostLocation || "No host location provided"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                                <div className="flex items-start gap-2.5">
                                    <UserRound
                                        size={17}
                                        className="mt-0.5 shrink-0 text-muted-foreground"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">
                                            Host
                                        </p>
                                        <p className="wrap-break-word text-sm font-medium">
                                            {group.hostName || "Not provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <Users
                                        size={17}
                                        className="mt-0.5 shrink-0 text-muted-foreground"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">
                                            G12 leader
                                        </p>
                                        <p className="wrap-break-word text-sm font-medium">
                                            {group.leaderName || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3 border-t border-border pt-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Contact information
                                </p>

                                {group.contactPhone ? (
                                    <a
                                        href={`tel:${group.contactPhone}`}
                                        className="flex items-center gap-2.5 break-all text-sm text-foreground hover:underline"
                                    >
                                        <Phone
                                            size={16}
                                            className="shrink-0 text-muted-foreground"
                                        />
                                        {group.contactPhone}
                                    </a>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No contact phone provided
                                    </p>
                                )}

                                {group.contactWhatsApp && (
                                    <a
                                        href={`https://wa.me/${group.contactWhatsApp.replace(/\D/g, "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2.5 break-all text-sm text-foreground hover:underline"
                                    >
                                        <MessageCircle
                                            size={16}
                                            className="shrink-0 text-muted-foreground"
                                        />
                                        {group.contactWhatsApp}
                                    </a>
                                )}

                                {group.contactEmail && (
                                    <a
                                        href={`mailto:${group.contactEmail}`}
                                        className="flex items-center gap-2.5 break-all text-sm text-foreground hover:underline"
                                    >
                                        <Mail
                                            size={16}
                                            className="shrink-0 text-muted-foreground"
                                        />
                                        {group.contactEmail}
                                    </a>
                                )}

                                {group.contactPerson && (
                                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <MapPinned size={14} />
                                        Contact person:{" "}
                                        {group.contactPerson === "HOST"
                                            ? "Host"
                                            : "G12 leader"}
                                    </p>
                                )}
                            </div>
                            <Link
                                href={`/g12/${group.id}`}
                                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
                            >
                                View G12 Details
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}