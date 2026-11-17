"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/site.config";
import { apiGet, apiPut } from "@/lib/api-client";
import { Save, Check, RefreshCw, AlertCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [headline, setHeadline] = useState(siteConfig.tagline);
  const [subheadline, setSubheadline] = useState(
    "Collabefy connects short-form creators with brand sponsorships backed by guaranteed escrow pools."
  );
  const [ctaPrimaryText, setCtaPrimaryText] = useState("Browse Active Campaigns");
  const [ctaSecondaryText, setCtaSecondaryText] = useState("Join as Creator");
  const [discordLink, setDiscordLink] = useState(siteConfig.links.discord);
  const [supportEmail, setSupportEmail] = useState(siteConfig.supportEmail);
  const [minWithdrawal, setMinWithdrawal] = useState("50");
  const [platformFee, setPlatformFee] = useState("10");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const [cmsRes, settingsRes] = await Promise.all([
          apiGet<{ success: boolean; data: any }>("/api/v1/cms/homepage_hero").catch(() => null),
          apiGet<{ success: boolean; data: any[] }>("/api/v1/admin/settings").catch(() => null),
        ]);

        if (cmsRes?.data?.content) {
          const c = cmsRes.data.content;
          if (c.headline) setHeadline(c.headline);
          if (c.subheadline) setSubheadline(c.subheadline);
          if (c.ctaPrimaryText) setCtaPrimaryText(c.ctaPrimaryText);
          if (c.ctaSecondaryText) setCtaSecondaryText(c.ctaSecondaryText);
        }

        if (settingsRes?.data) {
          const map = Object.fromEntries(settingsRes.data.map((s) => [s.key, s.value]));
          if (map.support_contact_email) setSupportEmail(map.support_contact_email);
          if (map.min_withdrawal_usd) setMinWithdrawal(map.min_withdrawal_usd);
          if (map.platform_fee_percent) setPlatformFee(map.platform_fee_percent);
        }
      } catch (err: any) {
        console.error("Failed to load platform settings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      // 1. Update CMS Content in Database
      await apiPut("/api/v1/cms/admin/homepage_hero", {
        section: "HERO",
        content: {
          badge: "CREATOR PERFORMANCE MARKETPLACE",
          headline,
          subheadline,
          ctaPrimaryText,
          ctaPrimaryLink: "/campaigns",
          ctaSecondaryText,
          ctaSecondaryLink: "/register",
          footerHighlights: [
            "Escrow-funded pools",
            "Fixed CPM rates upfront",
            "48h organic fraud audit",
            "Weekly Friday payouts",
          ],
        },
      });

      // 2. Update Platform Settings in Database
      await apiPut("/api/v1/admin/settings", {
        support_contact_email: supportEmail,
        min_withdrawal_usd: minWithdrawal,
        platform_fee_percent: platformFee,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to persist platform settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="pb-6 border-b border-border">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
          Platform Configuration & CMS
        </span>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text">
          Site & Platform Settings
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          Dynamically manage central branding, homepage headline copy, escrow thresholds, and notification endpoints.
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs text-danger bg-danger/10 border border-danger/30 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {saved && (
        <div className="p-3 text-xs text-success bg-success/10 border border-success/30 rounded-md flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>All platform settings successfully written and persisted in database!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Dynamic CMS Homepage Hero */}
        <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent block">
            Homepage Hero Copy (Live CMS)
          </span>

          <div>
            <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
              Primary Hero Headline
            </label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
              Subheadline / Descriptive Body
            </label>
            <textarea
              rows={3}
              required
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Primary CTA Button Text
              </label>
              <input
                type="text"
                value={ctaPrimaryText}
                onChange={(e) => setCtaPrimaryText(e.target.value)}
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Secondary CTA Button Text
              </label>
              <input
                type="text"
                value={ctaSecondaryText}
                onChange={(e) => setCtaSecondaryText(e.target.value)}
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Platform Financial Parameters */}
        <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent block">
            Financial & Settlement Controls
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Minimum Withdrawal Threshold ($ USD)
              </label>
              <input
                type="number"
                min="10"
                value={minWithdrawal}
                onChange={(e) => setMinWithdrawal(e.target.value)}
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Platform Marketplace Fee (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Community & Support */}
        <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent block">
            Community & Support Endpoints
          </span>

          <div>
            <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
              Main Discord Community Invite URL
            </label>
            <input
              type="url"
              value={discordLink}
              onChange={(e) => setDiscordLink(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
              Platform Support Email Address
            </label>
            <input
              type="email"
              required
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving || loading}
            className="flex items-center gap-1.5 rounded-md bg-accent px-5 py-2 text-xs font-semibold text-accent-ink hover:opacity-95 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Writing to Database...</span>
              </>
            ) : saved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved Settings</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
