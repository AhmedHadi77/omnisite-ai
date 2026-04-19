import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ClipboardList,
  Database,
  GitBranch,
  Globe2,
  KeyRound,
  Layers3,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap
} from "lucide-react";
import type { ReactNode } from "react";

const proofStats = [
  { label: "Platforms", value: "3", text: "Webflow, WordPress, Shopify" },
  { label: "Core flow", value: "6", text: "Sign in through client review" },
  { label: "Data layer", value: "Prisma", text: "Workspace-owned records" },
  { label: "AI output", value: "Tasks", text: "Audit summaries become work" }
];

const productScreens = [
  {
    title: "Dashboard",
    eyebrow: "Command center",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
    points: ["Site health", "Urgent tasks", "Client approvals"]
  },
  {
    title: "Connected Sites",
    eyebrow: "Integration flow",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
    points: ["Add site", "Store credential metadata", "Test readiness"]
  },
  {
    title: "AI Audit",
    eyebrow: "Intelligence layer",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
    points: ["Select property", "Generate summary", "Create tasks"]
  },
  {
    title: "Client Requests",
    eyebrow: "Approval queue",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
    points: ["Request intake", "AI draft ready", "Task conversion"]
  }
];

const architecture = [
  { label: "Next.js App Router", text: "Public pages, app shell, server-rendered dashboard routes", icon: Layers3 },
  { label: "Server actions", text: "Sign in, add site, test credentials, run AI audit", icon: Workflow },
  { label: "Prisma models", text: "Users, workspaces, sites, credentials, audits, tasks, requests", icon: Database },
  { label: "AI service", text: "OpenAI audit generation with local fallback for demos", icon: Bot },
  { label: "Platform adapters", text: "Webflow, WordPress, and Shopify readiness checks", icon: Globe2 },
  { label: "Workspace ownership", text: "Every record is scoped to the signed-in agency workspace", icon: ShieldCheck }
];

const aiFlow = [
  { label: "Collect", text: "Use site platform, scores, credential state, and owner context." },
  { label: "Analyze", text: "Generate SEO, UX, speed, and conversion recommendations." },
  { label: "Create", text: "Turn audit output into structured tasks with priority and impact." },
  { label: "Review", text: "Move the work into task and client approval queues." }
];

const nextBuild = [
  "Move SQLite to hosted PostgreSQL on Supabase or Neon.",
  "Add more OAuth providers after Google, such as GitHub or Microsoft.",
  "Store encrypted platform secrets instead of masked demo metadata.",
  "Add background jobs for scheduled audits and sync events.",
  "Add real approval actions for client requests and task status changes.",
  "Deploy to Vercel with production environment variables."
];

export default function CaseStudyPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="scan-panel relative overflow-hidden bg-graphite text-cloud">
        <img
          alt="Agency team planning website operations"
          className="motion-image-pan absolute inset-0 h-full w-full object-cover opacity-[0.32]"
          src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=2200&q=90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/90 to-graphite/42" />
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col px-6 py-7 md:px-10">
          <nav className="motion-slide flex items-center justify-between gap-4">
            <a className="text-sm font-black uppercase" href="/">OmniSite AI</a>
            <div className="hidden items-center gap-7 text-sm font-black text-cloud/72 md:flex">
              <a className="hover:text-citron" href="#problem">Problem</a>
              <a className="hover:text-citron" href="#architecture">Architecture</a>
              <a className="hover:text-citron" href="#screens">Screens</a>
            </div>
            <a className="btn-accent" href="/connected-sites?flow=started">Open app</a>
          </nav>

          <div className="grid flex-1 items-center gap-10 py-14 xl:grid-cols-[1fr_430px]">
            <div>
              <p className="motion-title inline-flex rounded-ui bg-citron px-3 py-2 text-sm font-black uppercase text-ink">
                Portfolio case study
              </p>
              <h1 className="motion-title-delay mt-5 max-w-5xl font-[var(--font-display)] text-5xl leading-none md:text-7xl">
                AI-powered website operations for agency teams.
              </h1>
              <p className="motion-card mt-6 max-w-3xl text-xl leading-9 text-cloud/76">
                OmniSite AI unifies Webflow, WordPress, and Shopify operations into one workspace where audits become tasks and client requests stay visible.
              </p>
              <div className="motion-card mt-8 flex flex-wrap gap-3">
                <a className="btn-accent" href="/connected-sites?flow=started">
                  Walk the demo
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a className="btn-secondary border-cloud/20 bg-cloud/12 text-cloud hover:bg-cloud/20" href="/connected-sites?flow=started">
                  View workspace
                </a>
              </div>
            </div>

            <div className="motion-float hidden xl:block">
              <div className="scan-panel rounded-ui border border-cloud/15 bg-cloud/12 p-4 shadow-2xl shadow-ink/25 backdrop-blur-xl">
                <p className="text-xs font-black uppercase text-citron">Demo script</p>
                <h2 className="mt-2 text-3xl font-black">Sign in, add site, audit, tasks, client review</h2>
                <div className="mt-5 grid gap-3">
                  {["Workspace owner", "Connected property", "Credential test", "AI task queue"].map((item) => (
                    <div className="flex items-center gap-3 rounded-ui bg-cloud/10 p-3" key={item}>
                      <CheckCircle2 className="h-5 w-5 text-citron" />
                      <span className="font-black">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-10 md:grid-cols-4 md:px-10">
        {proofStats.map((stat) => (
          <article className="surface hover-lift p-5" key={stat.label}>
            <p className="text-sm font-black uppercase text-teal">{stat.label}</p>
            <p className="mt-3 text-4xl font-black">{stat.value}</p>
            <p className="mt-2 text-sm leading-6 text-steel">{stat.text}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10" id="problem">
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
          <div>
            <p className="text-sm font-black uppercase text-coral">Problem</p>
            <h2 className="mt-2 max-w-3xl font-[var(--font-display)] text-5xl leading-none">Agency website work gets scattered fast.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-steel">
              A client might have a Webflow marketing site, a WordPress blog, and a Shopify store. Updates, credentials, SEO issues, and approvals usually live in different places, which slows delivery.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <ProblemCard icon={<Globe2 className="h-6 w-6" />} title="Platform sprawl" text="Teams jump between CMS, ecommerce, docs, and chat." />
            <ProblemCard icon={<KeyRound className="h-6 w-6" />} title="Access friction" text="Credential readiness is unclear until work starts." />
            <ProblemCard icon={<MessageSquareText className="h-6 w-6" />} title="Approval drift" text="Client requests are easy to lose after handoff." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="rounded-ui bg-graphite p-6 text-cloud md:p-8">
          <p className="text-sm font-black uppercase text-citron">Solution</p>
          <div className="mt-5 grid gap-6 xl:grid-cols-[1fr_0.9fr] xl:items-end">
            <h2 className="font-[var(--font-display)] text-5xl leading-none">A single operating layer for sites, AI audits, tasks, and client requests.</h2>
            <p className="text-lg leading-8 text-cloud/72">
              The app connects site records, credential status, audit generation, and task creation into one repeatable workflow for agency delivery.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10" id="architecture">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-teal">Architecture</p>
            <h2 className="mt-2 font-[var(--font-display)] text-5xl leading-none">Built like a real product, not a static clone.</h2>
          </div>
          <a className="btn-primary" href="/settings">
            View settings
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <div className="motion-list mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {architecture.map((item) => {
            const Icon = item.icon;
            return (
              <article className="surface hover-lift p-5" key={item.label}>
                <Icon className="h-8 w-8 text-teal" />
                <h3 className="mt-5 text-2xl font-black">{item.label}</h3>
                <p className="mt-3 text-sm leading-6 text-steel">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="grid gap-5 xl:grid-cols-[420px_1fr] xl:items-start">
          <div>
            <p className="text-sm font-black uppercase text-coral">AI workflow</p>
            <h2 className="mt-2 font-[var(--font-display)] text-5xl leading-none">AI output becomes structured work.</h2>
            <p className="mt-5 text-lg leading-8 text-steel">
              The audit flow is intentionally practical: recommendations are stored, task records are created, and the user lands on a production board.
            </p>
            <a className="btn-primary mt-6" href="/ai-audit">
              Run audit
              <Sparkles className="h-4 w-4" />
            </a>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {aiFlow.map((item, index) => (
              <article className="surface hover-lift p-5" key={item.label}>
                <p className="text-sm font-black uppercase text-teal">0{index + 1}</p>
                <h3 className="mt-3 text-2xl font-black">{item.label}</h3>
                <p className="mt-3 text-sm leading-6 text-steel">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10" id="screens">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-teal">Product screens</p>
            <h2 className="mt-2 font-[var(--font-display)] text-5xl leading-none">The demo has a complete clickable story.</h2>
          </div>
          <a className="btn-primary" href="/connected-sites">
            Start flow
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <div className="motion-list mt-6 grid gap-5 md:grid-cols-2">
          {productScreens.map((screen) => (
            <ScreenshotCard key={screen.title} screen={screen} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-ui bg-graphite p-6 text-cloud md:p-8">
            <p className="text-sm font-black uppercase text-citron">What this proves</p>
            <h2 className="mt-3 font-[var(--font-display)] text-5xl leading-none">Full-stack delivery with product judgment.</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <Proof icon={<Zap className="h-5 w-5" />} label="Frontend" text="Responsive dashboard UI, clear hierarchy, motion, forms, empty states, and workflow guidance." />
              <Proof icon={<Database className="h-5 w-5" />} label="Backend" text="Server actions, Prisma models, secure sessions, workspace ownership, and generated records." />
              <Proof icon={<Bot className="h-5 w-5" />} label="AI" text="OpenAI-ready audit generation that creates summaries and task records." />
              <Proof icon={<GitBranch className="h-5 w-5" />} label="Integration thinking" text="Webflow, WordPress, and Shopify credential flows with live-test hooks." />
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase text-coral">What I would build next</p>
            <h2 className="mt-2 text-4xl font-black">Production upgrades</h2>
            <div className="mt-5 grid gap-3">
              {nextBuild.map((item) => (
                <div className="surface flex items-center gap-3 p-4" key={item}>
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-teal" />
                  <p className="text-sm font-bold leading-6 text-steel">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="rounded-ui bg-citron p-6 text-ink md:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-black uppercase">Demo recording path</p>
              <h2 className="mt-2 text-4xl font-black">Sign in, add site, test credentials, run audit, generate tasks, review client request.</h2>
            </div>
            <a className="btn-primary" href="/connected-sites?flow=started">
              Record walkthrough
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProblemCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="surface hover-lift p-5">
      <span className="text-teal">{icon}</span>
      <h3 className="mt-4 text-2xl font-black">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-steel">{text}</p>
    </article>
  );
}

function ScreenshotCard({
  screen
}: {
  screen: {
    title: string;
    eyebrow: string;
    image: string;
    points: string[];
  };
}) {
  return (
    <article className="surface hover-lift overflow-hidden">
      <div className="scan-panel relative h-64 overflow-hidden">
        <img alt={`${screen.title} screen preview`} className="h-full w-full object-cover" src={screen.image} />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/86 via-graphite/30 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-cloud">
          <p className="text-xs font-black uppercase text-citron">{screen.eyebrow}</p>
          <h3 className="mt-1 text-3xl font-black">{screen.title}</h3>
        </div>
      </div>
      <div className="grid gap-3 p-5 md:grid-cols-3">
        {screen.points.map((point) => (
          <div className="rounded-ui bg-paper p-3" key={point}>
            <p className="text-sm font-black text-moss">{point}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function Proof({ icon, label, text }: { icon: ReactNode; label: string; text: string }) {
  return (
    <article className="rounded-ui border border-cloud/10 bg-cloud/6 p-4">
      <span className="text-citron">{icon}</span>
      <h3 className="mt-3 text-xl font-black">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-cloud/70">{text}</p>
    </article>
  );
}
