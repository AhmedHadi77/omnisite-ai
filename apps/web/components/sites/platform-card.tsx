import { testCredentialAction } from "../../app/actions";
import type { DemoSite } from "../../lib/demo-data";
import { SubmitButton } from "../ui/submit-button";

export function PlatformCard({ site }: { site: DemoSite }) {
  const statusTone = site.status === "Needs review" ? "bg-coral text-white" : "bg-citron text-ink";

  return (
    <article className="surface hover-lift motion-card overflow-hidden">
      <div className="scan-panel relative h-36 overflow-hidden">
        <img alt={`${site.name} website workspace`} className="h-full w-full object-cover" src={site.image} />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/70 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
          <span className="status-pill bg-cloud/14 text-cloud">{site.platform}</span>
          <span className={`status-pill ${statusTone}`}>{site.status}</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-black uppercase text-teal">Client property</p>
          <span className="text-xs font-black uppercase text-steel">{site.lastSync}</span>
        </div>
        <h2 className="mt-4 text-2xl font-black">{site.name}</h2>
        <p className="text-sm text-steel">{site.domain}</p>
        <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
          <Score label="SEO" value={site.seoScore} />
          <Score label="UX" value={site.uxScore} />
          <Score label="Speed" value={site.speedScore} />
        </div>
        <div className="mt-5 rounded-ui border border-ink/10 bg-paper p-3 text-sm">
          <p className="font-black text-moss">{site.authType ?? "Credential metadata"}</p>
          <p className="mt-1 text-steel">{site.credentialStatus ?? "Credential needed"}</p>
          {site.credentialPreview ? <p className="mt-2 text-xs font-black uppercase text-teal">{site.credentialPreview}</p> : null}
          <p className="mt-2 text-xs font-black uppercase text-steel">
            {site.connectionTestStatus ?? "NOT_TESTED"}
          </p>
          <p className="mt-1 text-xs text-steel">{site.connectionTestMessage ?? "Connection has not been tested yet."}</p>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-sm">
          <span className="text-steel">Owner: {site.owner}</span>
          <span className="font-black text-moss">{site.healthScore}% health</span>
        </div>
        <a className="btn-primary mt-4 w-full text-sm" href={`/sites/${site.id}`}>
          View site details
        </a>
        <form action={testCredentialAction} className="mt-4">
          <input name="domain" type="hidden" value={site.domain} />
          <SubmitButton className="btn-secondary w-full text-sm" loadingText="Testing API...">
            Test API connection
          </SubmitButton>
        </form>
      </div>
    </article>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-ui bg-paper p-3">
      <p className="text-steel">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}
