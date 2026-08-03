import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          const username = credentials?.username?.trim().toLowerCase();
          const password = credentials?.password;

          if (!username || !password) {
            throw new Error("Please enter both username and password.");
          }

          const user = await prisma.user.findUnique({
            where: {
              username,
            },
            include: {
              leaderDepartments: true,
            },
          });

          if (!user) {
            throw new Error("Username or password is incorrect.");
          }

          const passwordMatches = await bcrypt.compare(
            password,
            user.password
          );

          if (!passwordMatches) {
            throw new Error("Username or password is incorrect.");
          }

          if (!user.isActive) {
            throw new Error(
              "Your account has been disabled. Please contact an administrator."
            );
          }

          const departmentIds =
            user.role === UserRole.DEPARTMENT_LEADER
              ? user.leaderDepartments.map(
                  (department) => department.departmentId
                )
              : [];

          return {
            id: user.id,
            name: user.fullName,
            username: user.username,
            role: user.role,
            departmentIds,
          };
        } catch (error) {
          if (
            error instanceof Error &&
            [
              "Please enter both username and password.",
              "Username or password is incorrect.",
              "Your account has been disabled. Please contact an administrator.",
            ].includes(error.message)
          ) {
            throw error;
          }

          throw new Error("Something went wrong. Please try again.");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 hours
    updateAge: 60 * 5, // Refresh every 5 minutes
  },

  jwt: {
    maxAge: 60 * 60 * 8,
  },

  callbacks: {
    async jwt({ token, user }) {
      // Runs once when the user signs in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.departmentIds = user.departmentIds;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.departmentIds =
          (token.departmentIds as string[]) ?? [];
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};