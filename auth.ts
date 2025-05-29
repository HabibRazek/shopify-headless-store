import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcrypt"
import { ZodError } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Temporarily remove adapter to avoid account linking issues
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  // Allow linking accounts with same email
  experimental: {
    enableWebAuthn: false,
  },
  // This allows linking OAuth accounts to existing email accounts
  // WARNING: Only enable this if you trust your OAuth providers
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your password",
        },
      },
      async authorize(credentials) {
        try {
          // Check if we're in build mode
          if (!process.env.DATABASE_URL) {
            return null
          }

          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required")
          }

          // Dynamic imports to avoid build-time issues
          const { signInSchema } = await import("./lib/validations/auth")
          const { prisma } = await import("./lib/prisma")

          // Validate credentials with Zod
          const { email, password } = await signInSchema.parseAsync(credentials)

          // Find user in database
          const user = await prisma.user.findUnique({
            where: {
              email: email.toLowerCase(),
            },
          })

          if (!user || !user.password) {
            throw new Error("Invalid credentials")
          }

          // Verify password
          const isPasswordValid = await compare(password, user.password)

          if (!isPasswordValid) {
            throw new Error("Invalid credentials")
          }

          // Return user object (password will be excluded)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          if (error instanceof ZodError) {
            return null
          }
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
        token.id = user.id!
        token.role = user.role || 'USER'
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as string) || 'USER'
        if (token.accessToken) {
          session.accessToken = token.accessToken as string
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Allow all sign-ins - we'll handle account linking manually
      return true;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`User ${user.email} signed in with ${account?.provider}`)
    },
    async signOut() {
      console.log(`User signed out`)
    },
  },
})
