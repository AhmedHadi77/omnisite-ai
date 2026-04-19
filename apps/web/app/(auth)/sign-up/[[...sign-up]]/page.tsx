import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const clerkIsConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

  if (clerkIsConfigured) {
    const { isAuthenticated } = await auth();

    if (isAuthenticated) {
      redirect("/connected-sites?flow=started");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper p-6 text-ink">
      <section className="surface motion-card w-full max-w-xl p-6 md:p-7">
        <div className="mb-6">
          <a className="text-sm font-black uppercase text-moss" href="/">
            OmniSite AI
          </a>
          <h1 className="mt-3 font-[var(--font-display)] text-5xl leading-none">
            Create your agency workspace.
          </h1>
          <p className="mt-3 text-sm leading-6 text-steel">
            Use this page the first time only. After your account exists, use the sign-in page to return to your workspace.
          </p>
        </div>
        {clerkIsConfigured ? (
          <SignUp
            appearance={{
              elements: {
                cardBox: "shadow-none",
                card: "border-0 shadow-none",
                formButtonPrimary: "bg-ink text-cloud hover:bg-moss",
                footerActionLink: "text-moss"
              }
            }}
            fallbackRedirectUrl="/connected-sites?flow=started"
            forceRedirectUrl="/connected-sites?flow=started"
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
          />
        ) : (
          <div className="rounded-ui border border-coral/20 bg-coral/10 p-4 text-sm font-bold text-coral">
            Clerk is not configured yet. Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
          </div>
        )}
      </section>
    </main>
  );
}
