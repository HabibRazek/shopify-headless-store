import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcrypt"

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is required')
}
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID is required')
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET is required')
}

// PROFESSIONAL AUTH CONFIG WITH CREDENTIALS
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Check if database is available
          if (!process.env.DATABASE_URL || process.env.SKIP_ENV_VALIDATION === '1') {
            console.log('Database not available for authentication');
            return null;
          }

          // Dynamic import to avoid build-time issues
          const { getPrismaClient } = await import('@/lib/prisma');
          const prisma = getPrismaClient();

          // Find user in database
          const user = await prisma.user.findUnique({
            where: {
              email: (credentials.email as string).toLowerCase(),
            },
          });

          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const isPasswordValid = await compare(credentials.password as string, user.password);

          if (!isPasswordValid) {
            return null;
          }

          // Return user object (password will be excluded)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.id = user.id as string
        token.role = (user as any).role || 'user'
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if database is available
          if (!process.env.DATABASE_URL || process.env.SKIP_ENV_VALIDATION === '1') {
            console.log('Database not available for Google sign-in, allowing sign-in anyway');
            return true;
          }

          // Dynamic import to avoid build-time issues
          const { getPrismaClient } = await import('@/lib/prisma');
          const prisma = getPrismaClient();

          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            // Create new user for Google OAuth
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                role: 'user',
              },
            })
          }
        } catch (error) {
          console.error("Error creating Google user:", error)
          // Allow sign-in even if database operation fails
          return true
        }
      }
      return true
    },
  },
})
