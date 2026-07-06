import { UserRole } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      username?: string | null;
      role: UserRole;
      departmentId?: string | null;
      departmentIds: string[];
    };
  }

  interface User {
    id: string;
    name?: string | null;
    username?: string | null;
    role: UserRole;
    departmentId?: string | null;
    departmentIds: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string | null;
    role: UserRole;
    departmentId?: string | null;
    departmentIds: string[];
  }
}