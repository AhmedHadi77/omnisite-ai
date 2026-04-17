import { ArrowUpRight, Cable, CheckCircle2, DatabaseZap } from "lucide-react";
import { DemoFlow } from "../../../components/app/demo-flow";
import { AppPageHero, AppStatCard, MetricStrip } from "../../../components/app/page-chrome";
import { AddSiteForm } from "../../../components/sites/add-site-form";
import { PlatformCard } from "../../../components/sites/platform-card";
import { getDashboardData } from "../../../lib/dashboard-data";

export default async function ConnectedSitesPage({
  searchParams
}: {
  searchParams?: Promise<{ added?: string; tested?: string; flow?: string }>;
}) {
  const params = await searchParams;
  const { sites } = await getDashboardData();
  const connectedCount = sites.filter((site) => site.status === "Connected").length;
  const credentialCount = sites.filter((site) => site.credentialStatus === "Credential saved").length;

  return (
    <main className="page-enter">
      <AppPageHero
        accent="teal"
        action={
          <>
            <a className="btn-accent" href="#add-site">
              <Cable className="h-4 w-4" />
              Add site
            </a>
            <a className="btn-secondary border-cloud/20 bg-cloud/12 text-cloud hover:bg-cloud/20" href="/dashboard">
              Back to dashboard
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </>
        }
        description="Connect Webflow, WordPress, and Shopify properties, then test access before work reaches the agency queue."
        eyebrow="Connected sites"
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=85"
        title="Platform sync center for every client property."
      >
        <p className="text-xs font-black uppercase text-citron">Live integration map</p>
        <h2 className="mt-2 text-3xl font-black">{connectedCount} sites online</h2>
        <p className="mt-3 text-sm leading-6 text-cloud/68">
          Credentials, status checks, and platform context stay attached to the workspace.
        </p>
        <div className="mt-5">
          <MetricStrip
            items={[
              { label: "Sites", value: sites.length.toString(), accent: "teal" },
              { label: "Connected", value: connectedCount.toString(), accent: "citron" },
              { label: "Credentials", value: credentialCount.toString(), accent: "coral" }
            ]}
          />
        </div>
      </AppPageHero>

      {params?.flow === "started" ? <Banner tone="success" text="Workspace opened. Add a client site to continue the demo flow." /> : null}
      {params?.added ? <Banner tone="success" text="Site added. Next, test the API connection from the site card." /> : null}
      {params?.tested === "pass" ? <Banner actionHref="/ai-audit#audit-runner" actionLabel="Run AI audit" tone="success" text="Connection readiness passed. Continue to the AI audit step." /> : null}
      {params?.tested === "fail" ? <Banner actionHref="/settings" actionLabel="Check settings" tone="error" text="Connection test needs attention. The flow can continue, but review the credential message first." /> : null}
      {params?.tested === "missing" ? <Banner tone="error" text="No credential record was found for that site." /> : null}

      <DemoFlow
        active={params?.tested === "pass" ? "test-credentials" : params?.added ? "test-credentials" : "add-site"}
        description="Use this checklist while recording: add a property, test access, then run an audit."
        nextHref={params?.tested === "pass" ? "/ai-audit#audit-runner" : "#add-site"}
        nextLabel={params?.tested === "pass" ? "Run AI audit" : "Add or test site"}
      />

      <section className="motion-list mt-6 grid gap-4 md:grid-cols-3">
        <AppStatCard icon={<DatabaseZap className="h-5 w-5" />} label="Sites tracked" note="Workspace records" value={sites.length.toString()} />
        <AppStatCard accent="citron" icon={<CheckCircle2 className="h-5 w-5" />} label="Connected" note="Ready for audits" value={`${connectedCount}/${sites.length}`} />
        <AppStatCard accent="coral" icon={<Cable className="h-5 w-5" />} label="Credentials saved" note="API metadata present" value={`${credentialCount}/${sites.length}`} />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[400px_1fr]" id="add-site">
        <AddSiteForm />
        {sites.length ? (
          <div className="motion-list grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {sites.map((site) => (
              <PlatformCard key={site.domain} site={site} />
            ))}
          </div>
        ) : (
          <div className="surface grid min-h-80 place-items-center p-8 text-center">
            <div>
              <p className="text-sm font-black uppercase text-teal">No sites yet</p>
              <h2 className="mt-2 text-3xl font-black">Add your first Webflow, WordPress, or Shopify property.</h2>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Banner({
  tone,
  text,
  actionHref,
  actionLabel
}: {
  tone: "success" | "error";
  text: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className={`motion-card mt-5 flex flex-col gap-3 rounded-ui border px-4 py-3 text-sm font-black md:flex-row md:items-center md:justify-between ${tone === "success" ? "border-teal/20 bg-teal/10 text-teal" : "border-coral/20 bg-coral/10 text-coral"}`}>
      <span>{text}</span>
      {actionHref && actionLabel ? (
        <a className="inline-flex items-center gap-2 text-ink hover:text-moss" href={actionHref}>
          {actionLabel}
          <ArrowUpRight className="h-4 w-4" />
        </a>
      ) : null}
    </div>
  );
}
