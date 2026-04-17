import { Bot, CheckCircle2, ClipboardList, Globe2, KeyRound, MessageSquareText, UserRound } from "lucide-react";

const steps = [
  { id: "sign-in", label: "Sign in", href: "/sign-in", icon: UserRound },
  { id: "add-site", label: "Add site", href: "/connected-sites#add-site", icon: Globe2 },
  { id: "test-credentials", label: "Test credentials", href: "/connected-sites", icon: KeyRound },
  { id: "ai-audit", label: "Run AI audit", href: "/ai-audit#audit-runner", icon: Bot },
  { id: "tasks", label: "Generate tasks", href: "/tasks", icon: ClipboardList },
  { id: "client-review", label: "Review requests", href: "/client-requests", icon: MessageSquareText }
] as const;

export type DemoFlowStep = (typeof steps)[number]["id"];

export function DemoFlow({
  active,
  title = "Demo flow",
  description = "Follow this path for the portfolio walkthrough.",
  nextHref,
  nextLabel
}: {
  active: DemoFlowStep;
  title?: string;
  description?: string;
  nextHref?: string;
  nextLabel?: string;
}) {
  const activeIndex = steps.findIndex((step) => step.id === active);

  return (
    <section className="motion-card mt-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-teal">{title}</p>
          <h2 className="mt-1 text-3xl font-black">Sign in to client review in one clear path.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-steel">{description}</p>
        </div>
        {nextHref && nextLabel ? (
          <a className="btn-primary" href={nextHref}>
            {nextLabel}
          </a>
        ) : null}
      </div>

      <div className="motion-list mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCurrent = index === activeIndex;
          const isDone = index < activeIndex;
          const tone = isCurrent
            ? "border-graphite bg-graphite text-cloud shadow-2xl shadow-graphite/15"
            : isDone
              ? "border-teal/20 bg-teal/10 text-ink"
              : "border-ink/10 bg-cloud/80 text-ink";

          return (
            <a className={`hover-lift rounded-ui border p-4 ${tone}`} href={step.href} key={step.id}>
              <div className="flex items-center justify-between gap-3">
                <span className={`grid h-9 w-9 place-items-center rounded-ui ${isCurrent ? "bg-citron text-ink" : "bg-paper text-teal"}`}>
                  <Icon className="h-4 w-4" />
                </span>
                {isDone ? <CheckCircle2 className="h-5 w-5 text-teal" /> : <span className="text-xs font-black uppercase opacity-60">0{index + 1}</span>}
              </div>
              <p className="mt-4 text-sm font-black">{step.label}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
