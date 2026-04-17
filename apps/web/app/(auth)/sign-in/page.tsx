import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { signInAction } from "../../actions";
import { DemoFlow } from "../../../components/app/demo-flow";
import { SubmitButton } from "../../../components/ui/submit-button";

export default function SignInPage() {
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
                Start the agency demo with one owned workspace.
              </h1>
              <p className="motion-card mt-5 max-w-2xl text-lg leading-8 text-cloud/74">
                Create a local session, then move straight into adding a client site, testing access, running AI, and reviewing work.
              </p>
            </div>

            <div className="motion-float max-w-xl rounded-ui border border-cloud/15 bg-cloud/10 p-5 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-citron">Demo route</p>
                  <h2 className="mt-2 text-3xl font-black">Sign in, add site, run audit</h2>
                </div>
                <Sparkles className="h-7 w-7 text-citron" />
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                <MiniProof label="Workspace" value="Owned" />
                <MiniProof label="Data" value="Prisma" />
                <MiniProof label="AI" value="Ready" />
              </div>
            </div>
          </div>
        </div>

        <section className="flex flex-col justify-center">
          <form action={signInAction} className="surface motion-card w-full p-6 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-moss">Local session</p>
                <h2 className="mt-2 text-4xl font-black">Sign in to continue the flow</h2>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-ui bg-citron text-ink">
                <ShieldCheck className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-black">
                Name
                <input className="field" defaultValue="Ahmed" name="name" required />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Email
                <input className="field" defaultValue="ahmed@example.com" name="email" required type="email" />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Agency name
                <input className="field" defaultValue="GrowthOps Studio" name="agencyName" required />
              </label>
            </div>
            <SubmitButton className="btn-primary mt-6 w-full" loadingText="Opening workspace...">
              Start with connected sites
              <ArrowRight className="h-4 w-4" />
            </SubmitButton>
            <p className="mt-4 text-sm leading-6 text-steel">
              After sign in, OmniSite takes you to the Add Site step so the demo path stays obvious.
            </p>
          </form>

          <DemoFlow
            active="sign-in"
            description="This is the exact walkthrough to record for your portfolio demo."
            nextHref="/connected-sites#add-site"
            nextLabel="Skip to add site"
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
