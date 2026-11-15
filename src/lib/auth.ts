import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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

        const email = credentials.email.toLowerCase();

        // Administrator account
        if (email.includes("admin") || email === "admin@collabefy.com") {
          return {
            id: "usr-admin-1",
            name: "Elena Rostova",
            email: "admin@collabefy.com",
            role: "ADMIN",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
          };
        }

        // Creator account
        return {
          id: "usr-creator-1",
          name: email.split("@")[0],
          email: email,
          role: "CREATOR",
          image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
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

