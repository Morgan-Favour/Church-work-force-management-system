import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const username = credentials?.username?.trim().toLowerCase();
          const password = credentials?.password;

          if (!username || !password) {
            throw new Error("Please enter both username and password.");
          }

          const user = await prisma.user.findUnique({
            where: { username },
            include: {
              leaderDepartments: true,
            },
          });

          if (!user) {
            throw new Error("Username or password is incorrect.");
          }

          const isPasswordCorrect = await bcrypt.compare(password, user.password);

          if (!isPasswordCorrect) {
            throw new Error("Username or password is incorrect.");
          }

          if (!user.isActive) {
            return null;
          }

          const departmentIds =
            user.role === UserRole.DEPARTMENT_LEADER
              ? user.leaderDepartments.map((item) => item.departmentId)
              : [];

          return {
            id: user.id,
            name: user.fullName,
            username: user.username,
            role: user.role,
            departmentIds,
          };
        } catch (error) {
          if (error instanceof Error) {
            if (
              error.message === "Please enter both username and password." ||
              error.message === "Username or password is incorrect."
            ) {
              throw error;
            }
          }

          throw new Error("Something went wrong. Please try again.");
        }
      },
    }),
  ],

session: {
  strategy: "jwt",
  maxAge: 60 * 60 * 8, // 8 hours
},

jwt: {
  maxAge: 60 * 60 * 8,
},

secret: process.env.NEXTAUTH_SECRET,


  callbacks: {
    async jwt({ token, user }) {
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
        session.user.departmentIds = token.departmentIds as string[];
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};