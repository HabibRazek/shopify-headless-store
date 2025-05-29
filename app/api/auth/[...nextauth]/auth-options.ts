import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { buildSafeAuthOptions } from "./build-safe-auth";

// Check if we're in a build environment or missing critical env vars
const isBuildTime = !process.env.DATABASE_URL || process.env.SKIP_ENV_VALIDATION === '1';

// Create the auth options based on environment
const createAuthOptions = (): NextAuthOptions => {
  if (isBuildTime) {
    return buildSafeAuthOptions;
  }

  return {
    adapter: PrismaAdapter(prisma),
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.DATABASE_URL ? [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password required");
          }

          try {
            const user = await prisma.user.findUnique({
              where: {
                email: credentials.email,
              },
            });

            if (!user || !user.password) {
              throw new Error("Email does not exist");
            }

            const isPasswordValid = await compare(credentials.password, user.password);

            if (!isPasswordValid) {
              throw new Error("Invalid password");
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role,
            };
          } catch (error) {
            console.error("Auth error:", error);
            throw new Error("Authentication failed");
          }
        },
      }),
    ] : []),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-build",
  };
};

export const authOptions = createAuthOptions();
