"use client";

import React, { useState } from "react";
import { siteConfig } from "@/site.config";
import { Save, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [headline, setHeadline] = useState(siteConfig.tagline);
  const [discordLink, setDiscordLink] = useState(siteConfig.links.discord);
  const [supportEmail, setSupportEmail] = useState(siteConfig.supportEmail);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="pb-6 border-b border-border">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
          Platform Configuration
        </span>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text">
          Site Settings
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          Manage central branding, headline copy, community invitation URLs, and notification endpoints.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent block">
            Homepage Hero Copy
          </span>

          <div>
            <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
              Primary Hero Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none"
            />
          </div>
        </div>

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
              Support Email Address
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-md bg-accent px-5 py-2 text-xs font-semibold text-accent-ink hover:opacity-95 transition-opacity"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saved ? "Saved Settings" : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

