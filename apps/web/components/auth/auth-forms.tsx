"use client";

import { ArrowRight, Building2, KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react";
import { signIn } from "next-auth/react";
import type { ReactNode } from "react";
import { useState, useTransition } from "react";

const appHome = "/connected-sites?flow=started";

const errorMessages: Record<string, string> = {
  account_exists: "That email already has an account. Use sign in instead.",
  invalid_credentials: "Email or password is not correct.",
  invalid_email: "Enter a valid email address.",
  google_not_configured: "Google sign-in is not connected yet. Check your Google OAuth variables in Vercel.",
  weak_password: "Password must be at least 8 characters.",
  server_error: "The server could not complete the request. Check Vercel environment variables and logs."
};

export function SignInForm({ initialError = "" }: { initialError?: string }) {
  const [error, setError] = useState(initialError);
  const [isPending, startTransition] = useTransition();

  function handleGoogleSignIn() {
    setError("");
    startTransition(() => {
      signIn("google", { callbackUrl: appHome });
    });
  }

  function handleEmailSignIn(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        redirect: false,
        callbackUrl: appHome
      });

      if (result?.ok) {
        window.location.href = result.url || appHome;
        return;
      }

      setError(errorMessages.invalid_credentials);
    });
  }

  return (
    <AuthCard eyebrow="Secure sign in" title="Open your workspace">
      <ErrorMessage message={error} />
      <button className="btn-secondary mt-6 w-full justify-center border-ink/10 bg-paper text-ink hover:bg-citron/30" disabled={isPending} onClick={handleGoogleSignIn} type="button">
        <GoogleMark />
        {isPending ? "Opening Google..." : "Continue with Google"}
      </button>

      <Divider label="or sign in with email" />

      <form action={handleEmailSignIn} className="grid gap-4">
        <AuthField autoComplete="email" icon={<Mail className="h-4 w-4 text-teal" />} label="Email address" name="email" placeholder="you@agency.com" type="email" />
        <AuthField autoComplete="current-password" icon={<KeyRound className="h-4 w-4 text-teal" />} label="Password" name="password" placeholder="Your password" type="password" />
        <button className="btn-primary mt-2 w-full" disabled={isPending} type="submit">
          {isPending ? "Signing in..." : "Sign in and open workspace"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthCard>
  );
}

export function SignUpForm({ initialError = "" }: { initialError?: string }) {
  const [error, setError] = useState(initialError);
  const [isPending, startTransition] = useTransition();

  function handleGoogleSignIn() {
    setError("");
    startTransition(() => {
      signIn("google", { callbackUrl: appHome });
    });
  }

  function handleEmailSignUp(formData: FormData) {
    setError("");
    startTransition(async () => {
      const payload = {
        name: String(formData.get("name") ?? ""),
        username: String(formData.get("username") ?? ""),
        agencyName: String(formData.get("agencyName") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? "")
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(errorMessages[data?.error || "server_error"] || errorMessages.server_error);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
        callbackUrl: appHome
      });

      if (signInResult?.ok) {
        window.location.href = signInResult.url || appHome;
        return;
      }

      setError(errorMessages.invalid_credentials);
    });
  }

  return (
    <AuthCard eyebrow="Create account" title="Start using OmniSite">
      <ErrorMessage message={error} />
      <button className="btn-secondary mt-6 w-full justify-center border-ink/10 bg-paper text-ink hover:bg-citron/30" disabled={isPending} onClick={handleGoogleSignIn} type="button">
        <GoogleMark />
        {isPending ? "Opening Google..." : "Continue with Google"}
      </button>

      <Divider label="or create with email" />

      <form action={handleEmailSignUp} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <AuthField autoComplete="name" icon={<UserRound className="h-4 w-4 text-teal" />} label="Full name" name="name" placeholder="Ahmed Hadi" type="text" />
          <AuthField autoComplete="username" icon={<UserRound className="h-4 w-4 text-teal" />} label="Username" name="username" placeholder="ahmedhadi" type="text" />
        </div>
        <AuthField autoComplete="organization" icon={<Building2 className="h-4 w-4 text-teal" />} label="Agency name" name="agencyName" placeholder="GrowthOps Studio" type="text" />
        <AuthField autoComplete="email" icon={<Mail className="h-4 w-4 text-teal" />} label="Email address" name="email" placeholder="you@agency.com" type="email" />
        <AuthField autoComplete="new-password" icon={<KeyRound className="h-4 w-4 text-teal" />} label="Password" minLength={8} name="password" placeholder="At least 8 characters" type="password" />
        <button className="btn-primary mt-2 w-full" disabled={isPending} type="submit">
          {isPending ? "Creating account..." : "Create account and open workspace"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthCard>
  );
}

function AuthCard({ children, eyebrow, title }: { children: ReactNode; eyebrow: string; title: string }) {
  return (
    <div className="surface motion-card w-full p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-moss">{eyebrow}</p>
          <h2 className="mt-2 text-4xl font-black">{title}</h2>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-ui bg-citron text-ink">
          <ShieldCheck className="h-5 w-5" />
        </span>
      </div>
      {children}
    </div>
  );
}

function AuthField({
  autoComplete,
  icon,
  label,
  minLength,
  name,
  placeholder,
  type
}: {
  autoComplete: string;
  icon: ReactNode;
  label: string;
  minLength?: number;
  name: string;
  placeholder: string;
  type: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-black text-moss">
      {label}
      <span className="flex items-center gap-3 rounded-ui border border-ink/10 bg-paper px-4 py-3">
        {icon}
        <input
          autoComplete={autoComplete}
          className="w-full bg-transparent text-base font-bold text-ink outline-none placeholder:text-steel/55"
          minLength={minLength}
          name={name}
          placeholder={placeholder}
          required
          type={type}
        />
      </span>
    </label>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="my-5 flex items-center gap-3 text-xs font-black uppercase text-steel/70">
      <span className="h-px flex-1 bg-ink/10" />
      {label}
      <span className="h-px flex-1 bg-ink/10" />
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  return <div className="mt-5 rounded-ui border border-coral/25 bg-coral/10 p-4 text-sm font-bold text-coral">{message}</div>;
}

function GoogleMark() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded-full bg-cloud text-sm font-black text-ink">
      G
    </span>
  );
}
