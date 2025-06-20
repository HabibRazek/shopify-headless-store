import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcrypt"

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('❌ NEXTAUTH_SECRET is required for authentication')
}

// Google OAuth is optional - only validate if we're trying to use it
const hasGoogleConfig = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
if (process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('❌ GOOGLE_CLIENT_SECRET is required when GOOGLE_CLIENT_ID is set')
}
if (process.env.GOOGLE_CLIENT_SECRET && !process.env.GOOGLE_CLIENT_ID) {
  console.error('❌ GOOGLE_CLIENT_ID is required when GOOGLE_CLIENT_SECRET is set')
}

// PROFESSIONAL AUTH CONFIG WITH CREDENTIALS
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    ...(hasGoogleConfig ? [
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
        allowDangerousEmailAccountLinking: true,
      })
    ] : []),
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
  useSecureCookies: process.env.NODE_ENV === 'production',

  // Explicitly set the base URL for production
  basePath: '/api/auth',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.callback-url'
        : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Host-next-auth.csrf-token'
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.id = user.id as string
        token.role = (user as { role?: string }).role || 'user'
        token.image = user.image
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.image = token.image as string
        session.user.name = token.name as string
      }

      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if database is available
          if (!process.env.DATABASE_URL || process.env.SKIP_ENV_VALIDATION === '1') {
            return true;
          }

          // Dynamic import to avoid build-time issues
          const { getPrismaClient } = await import('@/lib/prisma');
          const prisma = getPrismaClient();

          // Check if user already exists by email
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!dbUser) {
            // Create new user for Google OAuth
            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                role: 'user',
              },
            });
          } else {
            // Update existing user with Google profile image and name
            // Always use the fresh Google image if available
            dbUser = await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                image: user.image, // Always use the fresh Google image
                name: user.name || dbUser.name,
              },
            });
          }

          // Replace the user object with database user data
          user.id = dbUser.id;
          user.name = dbUser.name;
          user.email = dbUser.email;
          user.image = dbUser.image;

        } catch (error) {
          // Log error in development for debugging
          if (process.env.NODE_ENV === 'development') {
            console.error('Google OAuth database error:', error);
          }
          // Allow sign-in even if database operation fails
          return true
        }
      }
      return true
    },
  },
})
