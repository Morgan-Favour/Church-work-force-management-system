"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Plus,
  Search,
  SlidersHorizontal,
  UserCheck,
  Users,
  UserX,
  Link as LinkIcon
} from "lucide-react";

type Department = {
  id: string;
  name: string;
};

type G12Group = {
  id: string;
  name: string;
};

type Member = {
  id: string;
  fullName: string;
  gender: string;
  phone: string;
  email?: string | null;
  department?: { name: string } | null;
  g12?: { name: string } | null;
  dateJoined: string;
  isActive: boolean;
};

type MemberDirectoryProps = {
  members: Member[];
  departments: Department[];
  g12Groups: G12Group[];
};

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export default function MemberDirectory({
  members,
  departments,
  g12Groups,
}: MemberDirectoryProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [departmentId, setDepartmentId] = useState("ALL");
  const [g12Id, setG12Id] = useState("ALL");

  const activeCount = useMemo(
    () => members.filter((m) => m.isActive).length,
    [members]
  );
  const inactiveCount = members.length - activeCount;

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }),
    []
  );

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.fullName.toLowerCase().includes(search.toLowerCase()) ||
        member.phone.toLowerCase().includes(search.toLowerCase()) ||
        (member.email &&
          member.email.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        status === "ALL" ||
        (status === "ACTIVE" && member.isActive) ||
        (status === "INACTIVE" && !member.isActive);

      const selectedDept = departments.find((d) => d.id === departmentId);
      const matchesDepartment =
        departmentId === "ALL" || member.department?.name === selectedDept?.name;

      const selectedG12 = g12Groups.find((g) => g.id === g12Id);
      const matchesG12 =
        g12Id === "ALL" || member.g12?.name === selectedG12?.name;

      return matchesSearch && matchesStatus && matchesDepartment && matchesG12;
    });
  }, [members, search, status, departmentId, g12Id, departments, g12Groups]);

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Members
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your church membership records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/members/registration-link"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-card-foreground transition-colors hover:bg-muted"
          >
            <LinkIcon className="size-4" />
            Registration Link
          </Link>
          <Link
            href="/members/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <Plus size={18} />
            Add member
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total members"
          count={members.length}
          icon={<Users size={20} />}
        />
        <SummaryCard
          title="Active members"
          count={activeCount}
          icon={<UserCheck size={20} />}
        />
        <SummaryCard
          title="Inactive members"
          count={inactiveCount}
          icon={<UserX size={20} />}
        />
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone or email..."
              className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          {/* Fixed Flex-Wrap Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <SlidersHorizontal size={18} className="shrink-0 text-muted-foreground" />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              className="min-w-32 flex-1 sm:flex-none rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              aria-label="Filter by member status"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="min-w-36 flex-1 sm:flex-none rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              aria-label="Filter by department"
            >
              <option value="ALL">All departments</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>

            <select
              value={g12Id}
              onChange={(e) => setG12Id(e.target.value)}
              className="min-w-32 flex-1 sm:flex-none rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              aria-label="Filter by G12"
            >
              <option value="ALL">All G12 groups</option>
              {g12Groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Showing {filteredMembers.length} of {members.length} members
        </p>
      </div>

      {/* Members Table */}
      <section className="w-full min-w-0">
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                <Users size={28} />
              </div>

              <h2 className="font-semibold text-card-foreground">
                {members.length === 0 ? "No members yet" : "No members found"}
              </h2>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {members.length === 0
                  ? "Start building your church membership directory by adding your first member."
                  : "Try changing your search or filters to find the member you're looking for."}
              </p>

              {members.length === 0 && (
                <Link
                  href="/members/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
                >
                  <Plus size={17} />
                  Add first member
                </Link>
              )}
            </div>
          ) : (
            /* Outer wrapper handles the scroll boundary safely */
            <div className="overflow-x-auto">

              <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm divide-y divide-border">
                {filteredMembers.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      No members found.
                    </p>
                  </div>
                ) : (
                  filteredMembers.map((member) => (
                    <Link
                      key={member.id}
                      href={`/members/${member.id}`}
                      className="flex w-full min-w-0 items-center gap-3 px-4 py-4 transition hover:bg-muted/50 sm:px-5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {member.fullName
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold text-card-foreground">
                          {member.fullName}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Joined{" "}
                          {dateFormatter.format(new Date(member.dateJoined))}
                        </p>
                      </div>

                      <ChevronRight
                        size={18}
                        className="shrink-0 text-muted-foreground"
                      />
                    </Link>
                  ))
                )}
              </div>

            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  count,
  icon,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-card-foreground">
        {count.toLocaleString()}
      </p>
    </div>
  );
}