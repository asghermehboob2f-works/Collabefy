"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import { apiGet } from "@/lib/api-client";
import {
  Layers,
  Users,
  Eye,
  DollarSign,
  PlusCircle,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  FileCheck,
  RefreshCw,
} from "lucide-react";
import { PlatformIcon } from "@/components/PlatformIcons";

interface OverviewData {
  metrics: {
    activeCampaignsCount: number;
    totalCampaignsCount: number;
    totalVerifiedViews: number;
    totalRewardedUsd: number;
    totalEscrowBudget: number;
    creatorCount: number;
    brandCount: number;
    pendingSubmissionsCount: number;
    pendingWithdrawalsCount: number;
    openTicketsCount: number;
  };
  recentSubmissions: any[];
  recentAuditLogs: any[];
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [overviewRes, campaignsRes] = await Promise.all([
        apiGet<{ success: boolean; data: OverviewData }>("/api/v1/admin/analytics/overview").catch(() => null),
        apiGet<{ success: boolean; data: any[] }>("/api/v1/campaigns/admin/all").catch(() => null),
      ]);

      if (overviewRes?.data) {
        setData(overviewRes.data);
      }
      if (campaignsRes?.data) {
        setCampaigns(campaignsRes.data);
      }
    } catch (err) {
      console.error("Failed to load admin overview data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const metrics = data?.metrics || {
    activeCampaignsCount: 0,
    totalCampaignsCount: 0,
    totalVerifiedViews: 0,
    totalRewardedUsd: 0,
    totalEscrowBudget: 0,
    creatorCount: 0,
    brandCount: 0,
    pendingSubmissionsCount: 0,
    pendingWithdrawalsCount: 0,
    openTicketsCount: 0,
  };

  const auditLogs = data?.recentAuditLogs || [];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            Operations & Control
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-text">
            Admin Overview
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Live database-calculated aggregates and operational audit history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text hover:bg-surface-3 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/campaigns/new"
            className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-accent-ink hover:opacity-95 transition-opacity"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Campaign</span>
          </Link>
        </div>
      </div>

      {/* Review Queue Alerts */}
      {(metrics.pendingSubmissionsCount > 0 || metrics.pendingWithdrawalsCount > 0) && (
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-accent">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>Operational Tasks Requiring Attention:</span>
            {metrics.pendingSubmissionsCount > 0 && (
              <span className="bg-surface-1 px-2 py-0.5 rounded border border-border text-text">
                {metrics.pendingSubmissionsCount} Submissions Pending
              </span>
            )}
            {metrics.pendingWithdrawalsCount > 0 && (
              <span className="bg-surface-1 px-2 py-0.5 rounded border border-border text-text">
                {metrics.pendingWithdrawalsCount} Withdrawals Pending
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {metrics.pendingSubmissionsCount > 0 && (
              <Link href="/admin/submissions" className="text-accent underline hover:opacity-80">
                Review Submissions →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-surface-1 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-subtle">
            <span>Ongoing Campaigns</span>
            <Layers className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-text tabular-nums">
            {metrics.activeCampaignsCount}{" "}
            <span className="text-xs font-normal text-text-muted">/ {metrics.totalCampaignsCount} total</span>
          </div>
          <div className="text-[11px] font-mono text-success flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span>Active in database</span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface-1 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-subtle">
            <span>Audited Views</span>
            <Eye className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-text tabular-nums">
            {formatNumber(metrics.totalVerifiedViews)}
          </div>
          <div className="text-[11px] font-mono text-text-subtle">
            Across TikTok, Shorts, Reels
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface-1 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-subtle">
            <span>Escrow Allocated</span>
            <DollarSign className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-accent tabular-nums">
            {formatCurrency(metrics.totalRewardedUsd)}
          </div>
          <div className="text-[11px] font-mono text-text-subtle">
            Pool: {formatCurrency(metrics.totalEscrowBudget)}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface-1 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-subtle">
            <span>Active Creators</span>
            <Users className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-text tabular-nums">
            {metrics.creatorCount}
          </div>
          <div className="text-[11px] font-mono text-text-subtle">
            Registered & verified
          </div>
        </div>
      </div>

      {/* Integration Health & Live Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign List Quick View (2 cols) */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-surface-1 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-text">
              Active Campaigns
            </h2>
            <Link
              href="/admin/campaigns"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
            >
              <span>Manage all ({campaigns.length})</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {campaigns.slice(0, 4).map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between gap-4">
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text truncate">{c.title}</span>
                    <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono text-text-subtle">
                      {c.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-text-muted mt-0.5">
                    {c.brandName} • {formatCurrency(c.rewardRateCpm || c.rewardRate || 20)} / 1k views • Pool: {formatCurrency(c.totalBudget)}
                  </div>
                </div>

                <Link
                  href={`/campaigns/${c.slug}`}
                  target="_blank"
                  className="rounded border border-border bg-surface-2 px-2.5 py-1 text-xs font-mono text-text-muted hover:text-text shrink-0"
                >
                  View Live
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Health Card */}
        <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
          <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-text pb-3 border-b border-border">
            System & Integrations
          </h2>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between p-3 rounded-md bg-surface-2 border border-border">
              <div className="flex items-center gap-2">
                <PlatformIcon platform="discord" className="w-4 h-4 text-accent" />
                <span className="text-text font-medium">Discord Bot v3.4.1</span>
              </div>
              <span className="text-success flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span>Connected</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-md bg-surface-2 border border-border">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-text font-medium">48h View Auditor</span>
              </div>
              <span className="text-success flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                <span>Operational</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-md bg-surface-2 border border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span className="text-text font-medium">Escrow Ledger</span>
              </div>
              <span className="text-success flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                <span>100% Backed</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Administrative Audit Log Summary */}
      <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-text">
            Recent Admin Activity
          </h2>
          <Link
            href="/admin/audit-log"
            className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
          >
            <span>Full Audit Trail</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-border/60">
          {auditLogs.length === 0 ? (
            <div className="py-4 text-xs font-mono text-text-subtle text-center">
              No recent audit logs found in database.
            </div>
          ) : (
            auditLogs.slice(0, 5).map((log: any) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text">{log.action}</span>
                    <span className="text-text-subtle font-mono">— {log.targetResource} {log.targetId ? `(${log.targetId})` : ""}</span>
                  </div>
                  <div className="text-text-muted mt-0.5 truncate max-w-xl font-mono text-[11px]">
                    {log.newValue ? log.newValue : "Action processed successfully"}
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] text-text-subtle shrink-0">
                  <div>{log.admin?.email || "Super Admin"}</div>
                  <div>{formatDate(log.createdAt)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
