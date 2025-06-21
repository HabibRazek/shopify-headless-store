import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

// Environment validation
const isProduction = process.env.NODE_ENV === 'production';

// Google OAuth configuration - STRICT validation
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

// NextAuth configuration
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL;

// Database configuration
const databaseUrl = process.env.DATABASE_URL;

// Check if Google OAuth is properly configured
const hasGoogleConfig = !!(googleClientId && googleClientSecret);

// Build providers array dynamically
const providers = [];

// Always add credentials provider
providers.push(
  CredentialsProvider({
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
        if (!databaseUrl) {
          return null;
        }

        // Dynamic import to avoid build-time issues
        const { getPrismaClient } = await import('@/lib/prisma');
        const prisma = getPrismaClient();

        // Test database connection
        await prisma.$connect();

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
      } finally {
        // Always disconnect from database
        try {
          const { getPrismaClient } = await import('@/lib/prisma');
          const prisma = getPrismaClient();
          await prisma.$disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
      }
    },
  })
);

// Add Google provider if configured
if (hasGoogleConfig) {
  providers.push(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      allowDangerousEmailAccountLinking: true,
    })
  );
}

// BULLETPROOF AUTH CONFIGURATION
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: nextAuthSecret,
  trustHost: true,
  useSecureCookies: isProduction,

  // Production URL configuration
  ...(isProduction && {
    basePath: '/api/auth',
    url: nextAuthUrl
  }),
  cookies: {
    sessionToken: {
      name: isProduction
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      }
    },
    callbackUrl: {
      name: isProduction
        ? '__Secure-next-auth.callback-url'
        : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      }
    },
    csrfToken: {
      name: isProduction
        ? '__Host-next-auth.csrf-token'
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
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

          // Try database operations but don't fail if they don't work
          if (databaseUrl) {
            try {
              const { getPrismaClient } = await import('@/lib/prisma');
              const prisma = getPrismaClient();

              // Test database connection with timeout
              await Promise.race([
                prisma.$connect(),
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Database connection timeout')), 3000)
                )
              ]);

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

              await prisma.$disconnect();
            } catch (dbError) {
              // Continue with sign-in even if database fails
            }
          }

          return true;
        } catch (error) {
          // Still allow sign-in even if there are errors
          return true;
        }
      }

      return true;
    },
  },

})
