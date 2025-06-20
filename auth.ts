import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcrypt"

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('❌ NEXTAUTH_SECRET is required')
}
if (!process.env.GOOGLE_CLIENT_ID) {
  console.error('❌ GOOGLE_CLIENT_ID is required')
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.error('❌ GOOGLE_CLIENT_SECRET is required')
}

// Debug OAuth configuration
console.log('🔧 OAuth Configuration:')
console.log('  NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
console.log('  Expected redirect URI:', `${process.env.NEXTAUTH_URL}/api/auth/callback/google`)
console.log('  Google Client ID:', process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...')

// PROFESSIONAL AUTH CONFIG WITH CREDENTIALS
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
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
  useSecureCookies: process.env.NODE_ENV === 'production',

  // Explicitly set the base URL
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
        console.log('🔄 JWT callback - Setting token with database user ID:', user.id);
        token.id = user.id as string
        token.role = (user as any).role || 'user'
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

      // Debug logging for production issues
      console.log('NextAuth Session Callback:', {
        hasToken: !!token,
        hasSession: !!session,
        userId: token?.id || 'none',
        userEmail: session?.user?.email || 'none',
        hasImage: !!token?.image,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      });

      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          console.log('🔄 Google sign-in attempt for:', user.email);
          console.log('🔍 Original user ID from Google:', user.id);

          // Check if database is available
          if (!process.env.DATABASE_URL || process.env.SKIP_ENV_VALIDATION === '1') {
            console.log('Database not available for Google sign-in, allowing sign-in anyway');
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
            console.log('🆕 Creating new user for Google OAuth');
            console.log('📸 Google image URL for new user:', user.image);

            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                role: 'user',
              },
            });
            console.log('✅ New user created with database ID:', dbUser.id);
            console.log('📸 Stored image URL:', dbUser.image);
          } else {
            console.log('👤 Existing user found with database ID:', dbUser.id);
            console.log('📸 Current Google image URL:', user.image);
            console.log('📸 Existing database image URL:', dbUser.image);

            // Update existing user with Google profile image and name
            // Always use the fresh Google image if available
            dbUser = await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                image: user.image, // Always use the fresh Google image
                name: user.name || dbUser.name,
              },
            });
            console.log('✅ User updated with Google profile data');
            console.log('📸 Updated database image URL:', dbUser.image);
          }

          // CRITICAL: Replace the user object with database user data
          user.id = dbUser.id;
          user.name = dbUser.name;
          user.email = dbUser.email;
          user.image = dbUser.image; // Use the updated image from database (which includes Google image)

          console.log('🔄 User object updated with database ID:', user.id);
          console.log('📸 User image URL:', user.image);

        } catch (error) {
          console.error("❌ Error in Google sign-in:", error)
          console.error("❌ Error details:", {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            userEmail: user.email,
            userId: user.id
          })
          // Allow sign-in even if database operation fails
          return true
        }
      }
      return true
    },
  },
})
