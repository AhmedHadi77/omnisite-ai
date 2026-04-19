import { SignUpForm } from "../../../components/auth/auth-forms";

const errorMessages: Record<string, string> = {
  account_exists: "That email already has an account. Use sign in instead.",
  invalid_credentials: "Email or password is not correct.",
  invalid_email: "Enter a valid email address.",
  google_not_configured: "Google sign-up is not connected yet. Add Google OAuth keys in Vercel first.",
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
          <SignUpForm initialError={error} />

          <div className="surface motion-card mt-4 p-4">
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

function MiniProof({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-ui bg-cloud/10 p-3">
      <p className="text-[0.65rem] font-black uppercase text-cloud/58">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}
