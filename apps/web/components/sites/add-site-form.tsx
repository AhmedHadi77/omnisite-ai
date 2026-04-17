"use client";

import { useState } from "react";
import { addSiteAction } from "../../app/actions";
import type { Platform } from "../../lib/demo-data";
import { SubmitButton } from "../ui/submit-button";

const platforms: Platform[] = ["Webflow", "WordPress", "Shopify"];

export function AddSiteForm() {
  const [platform, setPlatform] = useState<Platform>("Webflow");

  return (
    <form action={addSiteAction} className="surface motion-card overflow-hidden bg-graphite p-5 text-cloud">
      <p className="text-sm font-black uppercase text-citron">Add connected site</p>
      <h2 className="mt-2 font-[var(--font-display)] text-4xl leading-none">Connect platform access.</h2>
      <p className="mt-3 text-sm leading-6 text-cloud/70">
        Add the same credentials an agency would collect. OmniSite stores connection metadata and a masked token preview for this local MVP.
      </p>

      <div className="mt-5 grid gap-3">
        <label className="grid gap-2 text-sm">
          Platform
          <select
            className="field"
            name="platform"
            onChange={(event) => setPlatform(event.target.value as Platform)}
            value={platform}
          >
            {platforms.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          Site name
          <input
            className="field"
            name="siteName"
            placeholder="Client launch site"
            required
          />
        </label>

        <label className="grid gap-2 text-sm">
          Domain
          <input
            className="field"
            name="domain"
            placeholder="client.example"
            required
          />
        </label>

        <label className="grid gap-2 text-sm">
          Owner
          <input className="field" name="ownerName" placeholder="Ahmed" />
        </label>

        <label className="grid gap-2 text-sm">
          Connection label
          <input
            className="field"
            name="accountLabel"
            placeholder={`${platform} production access`}
          />
        </label>
      </div>

      <div className="mt-5 rounded-ui border border-cloud/10 bg-cloud/5 p-4">
        {platform === "Webflow" && <WebflowFields />}
        {platform === "WordPress" && <WordPressFields />}
        {platform === "Shopify" && <ShopifyFields />}
      </div>

      <SubmitButton className="btn-accent mt-5 w-full" loadingText="Adding site...">
        Add site to workspace
      </SubmitButton>
    </form>
  );
}

function WebflowFields() {
  return (
    <div className="grid gap-3">
      <p className="text-sm font-bold uppercase text-citron">Webflow credentials</p>
      <label className="grid gap-2 text-sm">
        Webflow site ID
        <input className="field" name="webflowSiteId" placeholder="site_abc123" />
      </label>
      <label className="grid gap-2 text-sm">
        Webflow API token
        <input
          autoComplete="off"
          className="field"
          name="webflowToken"
          placeholder="wf_live_..."
          type="password"
        />
      </label>
    </div>
  );
}

function WordPressFields() {
  return (
    <div className="grid gap-3">
      <p className="text-sm font-bold uppercase text-citron">WordPress credentials</p>
      <label className="grid gap-2 text-sm">
        WordPress REST URL
        <input
          className="field"
          name="wordpressUrl"
          placeholder="https://client.example/wp-json/wp/v2"
        />
      </label>
      <label className="grid gap-2 text-sm">
        WordPress username
        <input className="field" name="wordpressUsername" placeholder="editor" />
      </label>
      <label className="grid gap-2 text-sm">
        Application password
        <input
          autoComplete="off"
          className="field"
          name="wordpressAppPassword"
          placeholder="xxxx xxxx xxxx xxxx"
          type="password"
        />
      </label>
    </div>
  );
}

function ShopifyFields() {
  return (
    <div className="grid gap-3">
      <p className="text-sm font-bold uppercase text-citron">Shopify credentials</p>
      <label className="grid gap-2 text-sm">
        Shopify shop domain
        <input
          className="field"
          name="shopifyShopDomain"
          placeholder="client.myshopify.com"
        />
      </label>
      <label className="grid gap-2 text-sm">
        Storefront or shop ID
        <input className="field" name="shopifyStorefrontId" placeholder="gid://shopify/Shop/..." />
      </label>
      <label className="grid gap-2 text-sm">
        Admin API access token
        <input
          autoComplete="off"
          className="field"
          name="shopifyAdminToken"
          placeholder="shpat_..."
          type="password"
        />
      </label>
    </div>
  );
}
