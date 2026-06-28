import "next-auth";
import { getServerSession as nextAuthGetServerSession } from "next-auth";
import { authOptions } from "./auth";

// Расширяем типы NextAuth, чтобы TypeScript знал о session.user.id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

export type { AppSession } from "./auth";

export function getServerSession() {
  return nextAuthGetServerSession(authOptions);
}
