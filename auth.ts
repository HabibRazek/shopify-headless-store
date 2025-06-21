import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcrypt"

// Robust environment validation
const isProduction = process.env.NODE_ENV === 'production';

// Google OAuth configuration with fallbacks
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
const hasGoogleConfig = googleClientId && googleClientSecret && googleClientId.length > 10;

// NextAuth configuration
const nextAuthSecret = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';
const nextAuthUrl = process.env.NEXTAUTH_URL || (isProduction ? 'https://shopify-headless-store-sigma.vercel.app' : 'http://localhost:3000');

// Database configuration
const databaseUrl = process.env.DATABASE_URL || '';

console.log('🔧 Auth Configuration Status:', {
  environment: process.env.NODE_ENV,
  hasGoogleConfig: !!hasGoogleConfig,
  hasNextAuthSecret: !!nextAuthSecret,
  hasNextAuthUrl: !!nextAuthUrl,
  hasDatabaseUrl: !!databaseUrl,
  nextAuthUrl: nextAuthUrl
});

// Build providers array dynamically
const providers = [];

// Always add credentials provider
providers.push(
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
        if (!databaseUrl) {
          console.log('⚠️ No database URL, skipping credentials auth');
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
        console.error('❌ Credentials auth error:', error);
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
  console.log('✅ Adding Google OAuth provider');
  providers.push(
    Google({
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
} else {
  console.log('⚠️ Google OAuth not configured - missing client ID or secret');
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
      console.log('🔐 SignIn callback triggered:', {
        provider: account?.provider,
        userEmail: user?.email,
        hasProfile: !!profile
      });

      if (account?.provider === "google") {
        try {
          // Always allow Google sign-in, database operations are optional
          console.log('✅ Google OAuth sign-in successful for:', user.email);

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
                console.log('👤 Created new user in database:', user.email);
              } else {
                // Update existing user with Google profile image and name
                dbUser = await prisma.user.update({
                  where: { id: dbUser.id },
                  data: {
                    image: user.image, // Always use the fresh Google image
                    name: user.name || dbUser.name,
                  },
                });
                console.log('🔄 Updated existing user in database:', user.email);
              }

              // Replace the user object with database user data
              user.id = dbUser.id;
              user.name = dbUser.name;
              user.email = dbUser.email;
              user.image = dbUser.image;

              await prisma.$disconnect();
            } catch (dbError) {
              console.warn('⚠️ Database operation failed, but allowing sign-in:', dbError);
              // Continue with sign-in even if database fails
            }
          } else {
            console.log('⚠️ No database URL configured, skipping database operations');
          }

          return true;
        } catch (error) {
          console.error('❌ Google OAuth error:', error);
          // Still allow sign-in even if there are errors
          return true;
        }
      }

      return true;
    },
  },

})
