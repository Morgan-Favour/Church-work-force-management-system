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
                username: { label: "username", type: "text" },
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
                        where: {
                            username,
                        },
                    });

                    if (!user) {
                        throw new Error("User not found.");
                    }

                    const isPasswordCorrect = await bcrypt.compare(password, user.password);

                    if (!isPasswordCorrect) {
                        throw new Error("Username or password is incorrect.");
                    }

                    if (!user.isActive) {
                        throw new Error("This account has been disabled. Please contact the administrator.");
                    }

                    return {
                        id: user.id,
                        name: user.fullName,
                        username: user.username,
                        role: user.role,
                        departmentId: user.departmentId,
                    };
                } catch (error) {
                    if (error instanceof Error) {
                        if (
                            error.message === "Please enter both username and password." ||
                            error.message === "User not found." ||
                            error.message === "Username or password is incorrect." ||
                            error.message === "This account has been disabled. Please contact the administrator."
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
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.departmentId = user.departmentId;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as UserRole;
                session.user.departmentId = token.departmentId as string | null;
            }

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
};