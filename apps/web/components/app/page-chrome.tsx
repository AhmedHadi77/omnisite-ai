import type { ReactNode } from "react";

const accentText = {
  citron: "text-citron",
  teal: "text-teal",
  coral: "text-coral"
};

const accentBg = {
  citron: "bg-citron text-ink",
  teal: "bg-teal text-white",
  coral: "bg-coral text-white"
};

export function AppPageHero({
  eyebrow,
  title,
  description,
  image,
  accent = "citron",
  action,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  accent?: keyof typeof accentText;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="scan-panel relative overflow-hidden rounded-ui bg-graphite p-5 text-cloud shadow-2xl shadow-graphite/15 md:p-7">
      <img alt="" className="motion-image-pan absolute inset-0 h-full w-full object-cover opacity-[0.28]" src={image} />
      <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/88 to-graphite/46" />
      <div className="relative z-10 grid gap-8 xl:grid-cols-[1fr_360px] xl:items-center">
        <div>
          <p className={`motion-title text-sm font-black uppercase ${accentText[accent]}`}>{eyebrow}</p>
          <h1 className="motion-title-delay mt-2 max-w-4xl font-[var(--font-display)] text-5xl leading-none md:text-6xl">
            {title}
          </h1>
          <p className="motion-card mt-4 max-w-2xl text-lg leading-8 text-cloud/74">{description}</p>
          {action ? <div className="motion-card mt-7 flex flex-wrap gap-3">{action}</div> : null}
        </div>
        {children ? (
          <div className="motion-float hidden xl:block">
            <div className="scan-panel rounded-ui border border-cloud/15 bg-cloud/12 p-4 shadow-2xl shadow-ink/25 backdrop-blur-xl">
              {children}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export function AppStatCard({
  label,
  value,
  note,
  icon,
  accent = "teal"
}: {
  label: string;
  value: string;
  note?: string;
  icon?: ReactNode;
  accent?: keyof typeof accentBg;
}) {
  return (
    <article className="surface hover-lift p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black uppercase text-steel">{label}</p>
        {icon ? <span className="text-teal">{icon}</span> : null}
      </div>
      <p className="mt-4 break-words text-3xl font-black md:text-4xl">{value}</p>
      {note ? <p className="mt-2 text-sm font-bold text-moss">{note}</p> : null}
      <div className="mt-4 h-2 overflow-hidden rounded-ui bg-paper">
        <div className={`motion-bar h-full rounded-ui ${accentBg[accent]}`} style={{ width: "82%" }} />
      </div>
    </article>
  );
}

export function MetricStrip({ items }: { items: Array<{ label: string; value: string; accent?: keyof typeof accentBg }> }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {items.map((item) => (
        <div className="rounded-ui bg-cloud/10 p-3" key={item.label}>
          <p className="text-[0.65rem] font-black uppercase text-cloud/58">{item.label}</p>
          <p className="mt-1 text-2xl font-black">{item.value}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-ui bg-cloud/12">
            <div className={`motion-bar h-full rounded-ui ${accentBg[item.accent ?? "citron"]}`} style={{ width: "78%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
