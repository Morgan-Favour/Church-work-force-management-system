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
    <div className="space-y-6">
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

        <Link
          href="/members/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Plus size={18} />
          Add member
        </Link>
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
        <div className="flex flex-col gap-3 lg:flex-row">
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

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={18} className="shrink-0 text-muted-foreground" />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              className="min-w-32 rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              aria-label="Filter by member status"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="min-w-36 rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
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
              className="min-w-32 rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
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
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-medium">Member</th>
                  <th className="px-5 py-4 font-medium">Contact</th>
                  <th className="px-5 py-4 font-medium">Department</th>
                  <th className="px-5 py-4 font-medium">G12</th>
                  <th className="px-5 py-4 font-medium">Date joined</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="transition hover:bg-muted/50">
                    <td className="px-5 py-4">
                      <Link
                        href={`/members/${member.id}`}
                        className="font-medium text-card-foreground transition hover:text-primary"
                      >
                        {member.fullName}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {member.gender}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-card-foreground">{member.phone}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {member.email || "No email"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {member.department?.name || "Unassigned"}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {member.g12?.name || "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                      {dateFormatter.format(new Date(member.dateJoined))}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          member.isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/members/${member.id}`}
                        aria-label={`View ${member.fullName}`}
                        className="inline-flex rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-card-foreground"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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