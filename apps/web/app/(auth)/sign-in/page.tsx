import { ArrowRight, Sparkles, UserPlus } from "lucide-react";
import { DemoFlow } from "../../../components/app/demo-flow";
import { SignInForm } from "../../../components/auth/auth-forms";

const errorMessages: Record<string, string> = {
  account_exists: "That email already has an account. Sign in here instead.",
  invalid_credentials: "Email or password is not correct.",
  invalid_email: "Enter a valid email address.",
  google_not_configured: "Google login is not connected yet. Add Google OAuth keys in Vercel first.",
  weak_password: "Password must be at least 8 characters."
};

export default async function SignInPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params?.error ? errorMessages[params.error] : "";

  return (
    <main className="min-h-screen bg-paper p-6 text-ink md:p-10">
      <section className="grid min-h-[calc(100vh-3rem)] gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="scan-panel relative overflow-hidden rounded-ui bg-graphite p-6 text-cloud shadow-2xl shadow-graphite/15 md:p-8">
          <img
            alt="Agency workspace with dashboards"
            className="motion-image-pan absolute inset-0 h-full w-full object-cover opacity-[0.3]"
            src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1800&q=85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/88 to-graphite/35" />
          <div className="relative z-10 flex h-full min-h-[620px] flex-col justify-between">
            <div>
              <a className="text-sm font-black uppercase text-citron" href="/">
                OmniSite AI
              </a>
              <h1 className="motion-title-delay mt-5 max-w-4xl font-[var(--font-display)] text-5xl leading-none md:text-7xl">
                Welcome back to your agency workspace.
              </h1>
              <p className="motion-card mt-5 max-w-2xl text-lg leading-8 text-cloud/74">
                Sign in with your email and password. After success, OmniSite opens the connected-sites workspace so you can add Webflow, WordPress, or Shopify access immediately.
              </p>
            </div>

            <div className="motion-float max-w-xl rounded-ui border border-cloud/15 bg-cloud/10 p-5 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-citron">Production route</p>
                  <h2 className="mt-2 text-3xl font-black">Sign in, add site, run audit</h2>
                </div>
                <Sparkles className="h-7 w-7 text-citron" />
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                <MiniProof label="Auth" value="Google" />
                <MiniProof label="Data" value="Owned" />
                <MiniProof label="AI" value="Ready" />
              </div>
            </div>
          </div>
        </div>

        <section className="flex flex-col justify-center">
          <div className="motion-card mb-4 rounded-ui border border-citron/40 bg-citron/15 p-4 text-sm text-moss">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-ui bg-citron text-ink">
                <UserPlus className="h-5 w-5" />
              </span>
              <div>
                <p className="font-black">First time here?</p>
                <p className="mt-1 leading-6 text-steel">
                  Create your account first. After that, use this sign-in page whenever you return.
                </p>
                <a className="btn-primary mt-3 inline-flex" href="/sign-up">
                  Create account first
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <SignInForm initialError={error} />

          <DemoFlow
            active="sign-in"
            description="This is the exact walkthrough to record for your portfolio demo."
            nextHref="/connected-sites?flow=started"
            nextLabel="Open workspace"
          />
        </section>
      </section>
    </main>
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
