import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string;
      /** The user's name. */
      name?: string | null;
      /** The user's email address. */
      email?: string | null;
      /** The user's image. */
      image?: string | null;
      /** The user's role. */
      role?: string | null;
    };
    /** OAuth access token */
    accessToken?: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string | null;
    accessToken?: string;
  }
}
