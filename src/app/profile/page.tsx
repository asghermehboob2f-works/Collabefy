"use client";

import React, { useState } from "react";
import { sampleCreators } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { PlatformIcon } from "@/components/PlatformIcons";
import { ShieldCheck, Plus, Check, ExternalLink, Globe } from "lucide-react";
import { PlatformType } from "@/types";

export default function ProfilePage() {
  const creator = sampleCreators[0];
  const [bio, setBio] = useState(creator.bio);
  const [socials, setSocials] = useState(creator.socialAccounts);
  const [isPublic, setIsPublic] = useState(creator.isPublicProfile);
  const [saved, setSaved] = useState(false);

  // New social modal/field state
  const [newPlatform, setNewPlatform] = useState<PlatformType>("tiktok");
  const [newHandle, setNewHandle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle || !newUrl) return;
    setSocials([
      ...socials,
      {
        id: `sa-${Date.now()}`,
        platform: newPlatform,
        handle: newHandle,
        profileUrl: newUrl,
        status: "unverified",
        verificationMethod: "manual_link",
        connectedAt: new Date().toISOString(),
      },
    ]);
    setNewHandle("");
    setNewUrl("");
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-text">{creator.name}</h1>
                  <span className="rounded-sm bg-accent/10 border border-accent/20 px-2 py-0.5 text-xs font-mono text-accent">
                    {creator.role.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-mono text-text-subtle">
                  @{creator.username} • {creator.email}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-accent-ink hover:opacity-95 transition-opacity"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{saved ? "Saved" : "Save Changes"}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-surface-1 p-4">
              <span className="text-xs font-mono text-text-subtle block">Verified Views</span>
              <span className="text-xl font-bold font-mono text-text tabular-nums mt-1 block">
                {formatNumber(creator.totalVerifiedViews)}
              </span>
            </div>
            <div className="rounded-lg border border-border bg-surface-1 p-4">
              <span className="text-xs font-mono text-text-subtle block">Rewards Distributed</span>
              <span className="text-xl font-bold font-mono text-accent tabular-nums mt-1 block">
                {formatCurrency(creator.totalEarnings)}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-lg border border-border bg-surface-1 p-4">
              <span className="text-xs font-mono text-text-subtle block">Email Verification</span>
              <span className="text-sm font-mono text-success flex items-center gap-1 mt-1 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified</span>
              </span>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent block">
              Creator Bio
            </span>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-2 p-3 text-sm text-text placeholder:text-text-subtle focus:border-border-strong focus:outline-none resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-text-muted">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                <span>Public profile directory listing enabled</span>
              </label>
            </div>
          </div>

          {/* Social Channels Section */}
          <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent block">
                  Connected Social Channels
                </span>
                <span className="text-xs text-text-subtle">
                  Manually linked URLs are labelled Unverified. Official OAuth authentications show Verified.
                </span>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {socials.map((sa) => (
                <div
                  key={sa.id}
                  className="flex items-center justify-between rounded-md border border-border bg-surface-2 p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <PlatformIcon platform={sa.platform} className="w-4 h-4 text-text" />
                    <div>
                      <span className="font-semibold text-text">{sa.handle}</span>
                      <a
                        href={sa.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-subtle hover:text-accent flex items-center gap-1 text-[11px] font-mono mt-0.5"
                      >
                        <span>{sa.profileUrl}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {sa.status === "verified" ? (
                      <span className="inline-flex items-center gap-1 rounded bg-success/10 text-success border border-success/20 px-2 py-0.5 font-mono text-[10px]">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified OAuth</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-surface-3 text-text-subtle border border-border px-2 py-0.5 font-mono text-[10px]">
                        <span>Unverified Link</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Channel Form */}
            <form onSubmit={handleAddSocial} className="pt-4 border-t border-border space-y-3">
              <span className="text-xs font-mono text-text-subtle uppercase block">
                Add New Social Channel
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as PlatformType)}
                  className="rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
                >
                  <option value="tiktok">TikTok</option>
                  <option value="youtube_shorts">YouTube Shorts</option>
                  <option value="instagram_reels">Instagram Reels</option>
                  <option value="x">X / Twitter</option>
                </select>
                <input
                  type="text"
                  placeholder="@handle"
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  className="rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text placeholder:text-text-subtle focus:outline-none"
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text placeholder:text-text-subtle focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-md bg-surface-2 border border-border px-3 py-1.5 text-xs font-medium text-text hover:bg-surface-3 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-accent" />
                <span>Add Channel</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

