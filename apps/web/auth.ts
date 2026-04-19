import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { ensureOAuthUser, validatePasswordAccount } from "./lib/account-service";
import { prisma } from "./lib/prisma";

function getGoogleClientId() {
  return process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "";
}

function getGoogleClientSecret() {
  return process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "";
}

export function isGoogleAuthConfigured() {
  return Boolean(getGoogleClientId() && getGoogleClientSecret());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.CREDENTIAL_ENCRYPTION_KEY,
  trustHost: true,
  pages: {
    signIn: "/sign-in",
    error: "/sign-in"
  },
  session: {
    maxAge: 60 * 60 * 24 * 30,
    strategy: "jwt"
  },
  providers: [
    ...(isGoogleAuthConfigured()
      ? [
          Google({
            clientId: getGoogleClientId(),
            clientSecret: getGoogleClientSecret()
          })
        ]
      : []),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");
        const result = await validatePasswordAccount({ email, password });

        if (!result.ok) return null;

        const user = await prisma.user.findUnique({ where: { id: result.userId } });
        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider !== "google") return true;

      const email = user.email ?? profile?.email;
      if (!email) return false;

      const dbUser = await ensureOAuthUser({
        email,
        name: user.name ?? profile?.name,
        username: profile && "given_name" in profile ? String(profile.given_name ?? "") : null
      });

      return Boolean(dbUser);
    },
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;

      if (email) {
        const dbUser = await prisma.user.findUnique({ where: { email } });
        token.userId = dbUser?.id;
      } else if (user?.id) {
        token.userId = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = String(token.userId);
      }

      return session;
    },
    redirect({ url, baseUrl }) {
      const appBaseUrl = getAppBaseUrl(baseUrl);

      if (url.startsWith("/")) return `${appBaseUrl}${url}`;
      if (new URL(url).origin === appBaseUrl) return url;
      if (new URL(url).origin === baseUrl) return url.replace(baseUrl, appBaseUrl);

      return `${appBaseUrl}/connected-sites?flow=started`;
    }
  }
});

function getAppBaseUrl(fallback: string) {
  return (process.env.AUTH_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || fallback).replace(/\/$/, "");
}
