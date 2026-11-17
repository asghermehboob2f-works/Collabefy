"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { apiGet, apiPatch } from "@/lib/api-client";
import { ShieldCheck, Search, RefreshCw, Ban, CheckCircle } from "lucide-react";

interface CreatorItem {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  creatorProfile?: {
    displayName: string;
    handle: string;
    avatarUrl?: string;
    totalEarnings: number;
    totalViews: number;
    isVerified: boolean;
    socialAccounts?: string;
  };
  _count?: {
    submissions: number;
    applications: number;
  };
}

export default function AdminCreatorsPage() {
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const res = await apiGet<{ success: boolean; data: CreatorItem[] }>("/api/v1/creators/admin/all");
      if (res?.data) {
        setCreators(res.data);
      }
    } catch (err) {
      console.error("Failed to load creators:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await apiPatch(`/api/v1/creators/admin/${id}/status`, { status: nextStatus });
      setCreators((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
      );
    } catch (err: any) {
      alert(`Failed to update creator: ${err.message}`);
    }
  };

  const handleToggleVerify = async (id: string, currentVerified: boolean) => {
    try {
      await apiPatch(`/api/v1/creators/admin/${id}/status`, { isVerified: !currentVerified });
      setCreators((prev) =>
        prev.map((c) =>
          c.id === id && c.creatorProfile
            ? { ...c, creatorProfile: { ...c.creatorProfile, isVerified: !currentVerified } }
            : c
        )
      );
    } catch (err: any) {
      alert(`Failed to update verification: ${err.message}`);
    }
  };

  const filtered = creators.filter((c) => {
    const name = c.creatorProfile?.displayName || "";
    const handle = c.creatorProfile?.handle || c.email;
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      handle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            User Management
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text">
            Creator Directory ({creators.length})
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Review creator profiles, social verification status, and historical performance metrics.
          </p>
        </div>

        <button
          onClick={fetchCreators}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text hover:bg-surface-3 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="w-3.5 h-3.5 text-text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by creator name or handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-1 py-1.5 pl-9 pr-3 text-xs text-text placeholder:text-text-subtle focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "ACTIVE", "SUSPENDED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded px-3 py-1 text-xs font-mono capitalize transition-colors ${
                statusFilter === st
                  ? "bg-surface-3 text-accent border border-accent/30 font-semibold"
                  : "bg-surface-1 text-text-muted border border-border hover:text-text"
              }`}
            >
              {st.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-surface-1 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-text-subtle">
                <th className="py-3 px-4 font-medium">Creator</th>
                <th className="py-3 px-4 font-medium">Contact / Role</th>
                <th className="py-3 px-4 font-medium text-right">Audited Views</th>
                <th className="py-3 px-4 font-medium text-right">Total Distributed</th>
                <th className="py-3 px-4 font-medium text-center">Verification</th>
                <th className="py-3 px-4 font-medium text-right">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs font-mono text-text-subtle">
                    {loading ? "Loading creators from database..." : "No creators found."}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const profile = c.creatorProfile;
                  const displayName = profile?.displayName || "Creator";
                  const handle = profile?.handle ? `@${profile.handle}` : c.email;
                  const isVerified = profile?.isVerified ?? false;

                  return (
                    <tr key={c.id} className="hover:bg-surface-2/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={profile?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"}
                            alt={displayName}
                            className="w-8 h-8 rounded-full object-cover border border-border"
                          />
                          <div>
                            <div className="font-sans font-semibold text-text">{displayName}</div>
                            <div className="text-[11px] text-text-subtle">{handle}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-text-muted">
                        <div>{c.email}</div>
                        <div className="text-[10px] text-text-subtle">
                          {c._count?.submissions || 0} clips • {c._count?.applications || 0} applied
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-semibold text-text tabular-nums">
                        {formatNumber(profile?.totalViews || 0)}
                      </td>

                      <td className="py-3 px-4 text-right font-semibold text-accent tabular-nums">
                        {formatCurrency(profile?.totalEarnings || 0)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleVerify(c.id, isVerified)}
                          className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
                            isVerified
                              ? "bg-success/10 text-success border border-success/20 hover:bg-success/20"
                              : "bg-surface-3 text-text-subtle border border-border hover:text-text"
                          }`}
                          title="Click to toggle verification status"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{isVerified ? "Verified" : "Unverified"}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                              c.status === "ACTIVE"
                                ? "bg-success/10 text-success border border-success/20"
                                : "bg-danger/10 text-danger border border-danger/20"
                            }`}
                          >
                            {c.status}
                          </span>

                          <button
                            onClick={() => handleToggleStatus(c.id, c.status)}
                            className="p-1 rounded text-text-subtle hover:text-danger hover:bg-surface-2"
                            title={c.status === "ACTIVE" ? "Suspend Creator" : "Re-activate Creator"}
                          >
                            {c.status === "ACTIVE" ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
