"use server";

import { redirect } from "next/navigation";
import { isGoogleAuthConfigured, signIn as authSignIn, signOut as authSignOut } from "../auth";
import { createPasswordAccount, validatePasswordAccount } from "../lib/account-service";

const appHome = "/connected-sites?flow=started";

export async function signUpAction(formData: FormData) {
  const email = cleanEmail(formData.get("email"));
  const password = cleanSecret(formData.get("password"));
  const result = await createPasswordAccount({
    name: cleanText(formData.get("name"), ""),
    username: cleanText(formData.get("username"), ""),
    email,
    password,
    agencyName: cleanText(formData.get("agencyName"), "")
  });

  if (!result.ok) {
    redirect(`/sign-up?error=${result.reason}`);
  }

  await authSignIn("credentials", {
    email,
    password,
    redirectTo: getAuthHome()
  });
}

export async function signInAction(formData: FormData) {
  const email = cleanEmail(formData.get("email"));
  const password = cleanSecret(formData.get("password"));
  const result = await validatePasswordAccount({ email, password });

  if (!result.ok) {
    redirect(`/sign-in?error=${result.reason}`);
  }

  await authSignIn("credentials", {
    email,
    password,
    redirectTo: getAuthHome()
  });
}

export async function googleSignInAction() {
  if (!isGoogleAuthConfigured()) {
    redirect("/sign-in?error=google_not_configured");
  }

  await authSignIn("google", {
    redirectTo: getAuthHome()
  });
}

export async function signOutAction() {
  await authSignOut({ redirectTo: "/sign-in" });
}

function getAuthHome() {
  const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
  return baseUrl ? `${baseUrl.replace(/\/$/, "")}${appHome}` : appHome;
}

function cleanText(value: FormDataEntryValue | null, fallback: string) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text.slice(0, 140) : fallback;
}

function cleanSecret(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().slice(0, 2000);
}

function cleanEmail(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().toLowerCase().slice(0, 180);
}
