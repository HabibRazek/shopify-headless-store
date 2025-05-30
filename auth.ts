import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

// PRODUCTION-SPECIFIC CONFIGURATION
const isProduction = process.env.NODE_ENV === 'production'

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  trustHost: true,
  debug: false, // Disable debug in production
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // Only include credentials provider in development
    ...(isProduction ? [] : [
      Credentials({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          try {
            if (!process.env.DATABASE_URL) return null

            const { compare } = await import("bcrypt")
            const { prisma } = await import("./lib/prisma")

            const user = await prisma.user.findUnique({
              where: { email: credentials.email.toLowerCase() },
            })

            if (!user?.password) return null

            const isValid = await compare(credentials.password, user.password)
            if (!isValid) return null

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            }
          } catch {
            return null
          }
        },
      })
    ]),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role || 'USER'
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})
