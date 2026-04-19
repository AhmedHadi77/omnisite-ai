import { ArrowRight, Building2, KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { signUpAction } from "../../actions";

const errorMessages: Record<string, string> = {
  account_exists: "That email already has an account. Use sign in instead.",
  invalid_credentials: "Email or password is not correct.",
  invalid_email: "Enter a valid email address.",
  weak_password: "Password must be at least 8 characters."
};

export default async function SignUpPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params?.error ? errorMessages[params.error] : "";

  return (
    <main className="min-h-screen bg-paper p-6 text-ink md:p-10">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="scan-panel relative overflow-hidden rounded-ui bg-graphite p-6 text-cloud shadow-2xl shadow-graphite/15 md:p-8">
          <img
            alt="Agency team planning a launch"
            className="motion-image-pan absolute inset-0 h-full w-full object-cover opacity-[0.32]"
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/88 to-graphite/35" />
          <div className="relative z-10 flex h-full min-h-[620px] flex-col justify-between">
            <div>
              <a className="text-sm font-black uppercase text-citron" href="/">
                OmniSite AI
              </a>
              <h1 className="motion-title-delay mt-5 max-w-4xl font-[var(--font-display)] text-5xl leading-none md:text-7xl">
                Create your agency workspace.
              </h1>
              <p className="motion-card mt-5 max-w-2xl text-lg leading-8 text-cloud/74">
                Set up a normal account with name, username, email, and password. After sign-up, OmniSite opens the working area automatically.
              </p>
            </div>

            <div className="motion-float max-w-xl rounded-ui border border-cloud/15 bg-cloud/10 p-5 backdrop-blur-xl">
              <p className="text-xs font-black uppercase text-citron">What happens next</p>
              <h2 className="mt-2 text-3xl font-black">Add site, test credentials, run AI audit</h2>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                <MiniProof label="Step 01" value="Account" />
                <MiniProof label="Step 02" value="Workspace" />
                <MiniProof label="Step 03" value="Audit" />
              </div>
            </div>
          </div>
        </div>

        <section className="flex flex-col justify-center">
          <div className="surface motion-card w-full p-6 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-moss">Create account</p>
                <h2 className="mt-2 text-4xl font-black">Start using OmniSite</h2>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-ui bg-citron text-ink">
                <ShieldCheck className="h-5 w-5" />
              </span>
            </div>

            {error ? (
              <div className="mt-5 rounded-ui border border-coral/25 bg-coral/10 p-4 text-sm font-bold text-coral">
                {error}
              </div>
            ) : null}

            <form action={signUpAction} className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <AuthField autoComplete="name" icon={<UserRound className="h-4 w-4 text-teal" />} label="Full name" name="name" placeholder="Ahmed Hadi" type="text" />
                <AuthField autoComplete="username" icon={<UserRound className="h-4 w-4 text-teal" />} label="Username" name="username" placeholder="ahmedhadi" type="text" />
              </div>
              <AuthField autoComplete="organization" icon={<Building2 className="h-4 w-4 text-teal" />} label="Agency name" name="agencyName" placeholder="GrowthOps Studio" type="text" />
              <AuthField autoComplete="email" icon={<Mail className="h-4 w-4 text-teal" />} label="Email address" name="email" placeholder="you@agency.com" type="email" />
              <AuthField autoComplete="new-password" icon={<KeyRound className="h-4 w-4 text-teal" />} label="Password" minLength={8} name="password" placeholder="At least 8 characters" type="password" />
              <button className="btn-primary mt-2 w-full" type="submit">
                Create account and open workspace
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-5 text-center text-sm font-bold text-steel">
              Already created your account?{" "}
              <a className="text-moss underline decoration-citron decoration-2 underline-offset-4" href="/sign-in">
                Sign in
              </a>
            </p>
          </div>
        </section>
      </section>
    </main>
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

function MiniProof({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-ui bg-cloud/10 p-3">
      <p className="text-[0.65rem] font-black uppercase text-cloud/58">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}
