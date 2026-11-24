"use client";

import React, { useState } from "react";
import { PlatformIcon } from "../PlatformIcons";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { X, ExternalLink, Music2, Layers, ShieldCheck, Eye, Smartphone, Monitor } from "lucide-react";
import { CampaignCard } from "../CampaignCard";
import { normalizeCampaign } from "@/lib/utils";

interface CampaignPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: any;
}

export function CampaignPreviewModal({ isOpen, onClose, campaign }: CampaignPreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [previewTab, setPreviewTab] = useState<"card" | "detail">("card");

  if (!isOpen || !campaign) return null;

  const normalized = normalizeCampaign(campaign);
  const rateVal = campaign.rewardRateCpm ?? campaign.rewardRate ?? 20;
  const totalB = campaign.totalBudget ?? 0;
  const allocB = campaign.allocatedBudget ?? 0;
  const audioTrack = campaign.audio || campaign.brief?.audio;
  const statusStr = (campaign.status || "ACTIVE").toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-surface-1 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-2/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                  Campaign Visual Preview
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold border bg-surface-3 text-text-subtle border-border">
                  {statusStr}
                </span>
              </div>
              <h2 className="text-sm font-bold text-text truncate max-w-md">{campaign.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-surface-3 p-1 rounded-lg border border-border text-xs font-mono">
              <button
                onClick={() => setPreviewTab("card")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  previewTab === "card" ? "bg-surface-1 text-text shadow-sm" : "text-text-subtle hover:text-text"
                }`}
              >
                Card View
              </button>
              <button
                onClick={() => setPreviewTab("detail")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  previewTab === "detail" ? "bg-surface-1 text-text shadow-sm" : "text-text-subtle hover:text-text"
                }`}
              >
                Detail Banner
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-text-subtle hover:text-text hover:bg-surface-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-bg/50">
          {previewTab === "card" ? (
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-center text-xs font-mono text-text-subtle pb-2">
                This is how the campaign card renders in the public catalogue:
              </div>
              <CampaignCard campaign={normalized} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center text-xs font-mono text-text-subtle pb-2">
                This is how the public campaign header banner renders on <span className="text-accent font-semibold">/campaigns/{campaign.slug}</span>:
              </div>

              {/* Detail Banner Preview */}
              <div className="relative aspect-[21/9] min-h-[200px] max-h-[320px] w-full rounded-2xl overflow-hidden border border-border bg-surface-2 shadow-xl">
                <img
                  src={campaign.coverImage || "/placeholder.png"}
                  alt={campaign.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl border border-border/80 bg-surface-1 p-1 shadow-2xl shrink-0">
                      <img
                        src={campaign.brandLogoUrl || campaign.brandLogo || "/placeholder.png"}
                        alt={campaign.brandName}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-text-muted uppercase tracking-wider">
                          {campaign.brandName} • {campaign.category || campaign.brandCategory || "General"}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-accent/20 text-accent border border-accent/30">
                          {statusStr}
                        </span>
                      </div>
                      <h1 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text">
                        {campaign.title}
                      </h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-surface-1/90 px-3 py-1.5 border border-border text-xs font-mono font-semibold text-accent">
                      {formatCurrency(rateVal)} / 1,000 Views
                    </div>
                  </div>
                </div>
              </div>

              {/* Brief highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="p-4 rounded-xl border border-border bg-surface-1 space-y-1">
                  <span className="text-[11px] font-mono text-text-subtle uppercase block">Audio Track</span>
                  <div className="text-xs font-semibold text-text flex items-center gap-1.5 truncate">
                    <Music2 className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>{audioTrack || "No specific audio required"}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border bg-surface-1 space-y-1">
                  <span className="text-[11px] font-mono text-text-subtle uppercase block">Total Escrow Budget</span>
                  <div className="text-xs font-semibold text-text tabular-nums">
                    {formatCurrency(totalB)} ({formatCurrency(allocB)} allocated)
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border bg-surface-1 space-y-1">
                  <span className="text-[11px] font-mono text-text-subtle uppercase block">Eligible Platforms</span>
                  <div className="text-xs font-semibold text-text truncate">
                    {(Array.isArray(campaign.platforms) ? campaign.platforms : ["TikTok", "Reels"]).join(", ")}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-surface-2/40 text-xs font-mono">
          <span className="text-text-subtle">
            Previewing: <span className="text-text font-semibold">{campaign.title}</span> ({campaign.slug})
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-surface-2 border border-border px-4 py-1.5 font-semibold text-text hover:bg-surface-3 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
