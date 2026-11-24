import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Collabefy Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "creator@collabefy.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Strictly authenticate against the real backend database with bcrypt password verification
          const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email.trim().toLowerCase(),
              password: credentials.password,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const user = data.data?.user;
            if (user && user.status === "ACTIVE") {
              return {
                id: user.id,
                name: user.creatorProfile?.displayName || user.brandProfile?.companyName || user.email.split("@")[0],
                email: user.email,
                role: user.role,
                image: user.creatorProfile?.avatarUrl || user.brandProfile?.logoUrl || null,
              };
            }
          }
        } catch (err) {
          console.error("[NEXTAUTH_AUTHORIZE_ERROR]", err);
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "CREATOR";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "collabefy-production-secret-encryption-key-2026",
};
