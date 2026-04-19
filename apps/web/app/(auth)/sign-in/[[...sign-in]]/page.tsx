import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { redirect } from "next/navigation";
import { RedirectIfSignedIn } from "../../../../components/auth/redirect-if-signed-in";
import { DemoFlow } from "../../../../components/app/demo-flow";

const appHome = "/connected-sites#add-site";

export default async function SignInPage({
  searchParams
}: {
  searchParams?: Promise<{ redirect_url?: string }>;
}) {
  const params = await searchParams;
  const isReturningFromAuth = Boolean(params?.redirect_url);
  const clerkIsConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

  if (clerkIsConfigured) {
    const { isAuthenticated } = await auth();

    if (isAuthenticated) {
      redirect(appHome);
    }
  }

  return (
    <main className="min-h-screen bg-paper p-6 text-ink md:p-10">
      {clerkIsConfigured ? <RedirectIfSignedIn to={appHome} /> : null}
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
                {isReturningFromAuth ? "Finishing your secure sign in." : "Sign in only after your account exists."}
              </h1>
              <p className="motion-card mt-5 max-w-2xl text-lg leading-8 text-cloud/74">
                {isReturningFromAuth
                  ? "Once Clerk confirms your session, OmniSite opens your dashboard automatically."
                  : "First-time users should create an account. After that, come back here to sign in with Google or email."}
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
                <MiniProof label="Auth" value="Clerk" />
                <MiniProof label="Data" value="Owned" />
                <MiniProof label="AI" value="Ready" />
              </div>
            </div>
          </div>
        </div>

        <section className="flex flex-col justify-center">
          {clerkIsConfigured ? (
            <>
              <div className="motion-card mb-4 rounded-ui border border-citron/40 bg-citron/15 p-4 text-sm text-moss">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-ui bg-citron text-ink">
                    <UserPlus className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-black">{isReturningFromAuth ? "Verification complete?" : "First time here?"}</p>
                    <p className="mt-1 leading-6 text-steel">
                      {isReturningFromAuth
                        ? "If this page does not move automatically, click Continue after sign in once and OmniSite will open your dashboard."
                        : "You do not have an OmniSite account yet. Create your account first, then use this sign-in page next time."}
                    </p>
                    {!isReturningFromAuth ? (
                      <a className="btn-primary mt-3 inline-flex" href="/sign-up">
                        Create account first
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="surface motion-card flex w-full justify-center p-6 md:p-7">
                <SignIn
                  appearance={{
                    elements: {
                      cardBox: "shadow-none",
                      card: "border-0 shadow-none",
                      formButtonPrimary: "bg-ink text-cloud hover:bg-moss",
                      footerActionLink: "text-moss"
                    }
                  }}
                  fallbackRedirectUrl={appHome}
                  forceRedirectUrl={appHome}
                  path="/sign-in"
                  routing="path"
                  signUpFallbackRedirectUrl={appHome}
                  signUpForceRedirectUrl={appHome}
                  signUpUrl="/sign-up"
                  transferable={false}
                  withSignUp={false}
                />
              </div>
            </>
          ) : (
            <div className="surface motion-card w-full p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase text-moss">Clerk setup required</p>
                  <h2 className="mt-2 text-4xl font-black">Add Clerk keys to enable real auth</h2>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-ui bg-citron text-ink">
                  <ShieldCheck className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-steel">
                Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env.local` and Vercel, then redeploy.
              </p>
              <a className="btn-primary mt-6 w-full" href="/settings">
                Check settings
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}

          <DemoFlow
            active="sign-in"
            description="This is the exact walkthrough to record for your portfolio demo."
            nextHref={appHome}
            nextLabel="Continue after sign in"
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
