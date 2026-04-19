import { redirect } from "next/navigation";
import { auth, signOut as authSignOut } from "../auth";
import {
  createPasswordAccount,
  getAppSessionForUser,
  validatePasswordAccount,
  type AppSession,
  type AuthResult
} from "./account-service";

const appHome = "/connected-sites?flow=started";

export const demoUserId = "demo-owner";
export const demoWorkspaceId = "growthops-workspace";

export type { AppSession, AuthResult };

export async function getCurrentSession(): Promise<AppSession> {
  const session = await getAuthSession();
  const appSession = await getAppSessionForUser({
    userId: session?.user?.id,
    email: session?.user?.email
  });

  if (!appSession) {
    redirect("/sign-in");
  }

  return appSession;
}

export async function createAccountSession(input: {
  name: string;
  username: string;
  email: string;
  password: string;
  agencyName: string;
}): Promise<AuthResult> {
  return createPasswordAccount(input);
}

export async function signInWithPassword(input: { email: string; password: string }): Promise<AuthResult> {
  return validatePasswordAccount(input);
}

export async function clearCurrentSession() {
  await authSignOut({ redirectTo: "/sign-in" });
}

export function getAuthHome() {
  const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
  return baseUrl ? `${baseUrl.replace(/\/$/, "")}${appHome}` : appHome;
}

async function getAuthSession() {
  try {
    return await auth();
  } catch (error) {
    console.error("Auth session could not be read.", error);
    return null;
  }
}
