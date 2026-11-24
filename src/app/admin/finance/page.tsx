"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { apiGet, apiPatch } from "@/lib/api-client";
import {
  DollarSign,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  FileText,
} from "lucide-react";

interface WithdrawalItem {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  destinationDetails: string;
  status: "PENDING" | "APPROVED" | "PROCESSED" | "REJECTED" | "FAILED";
  requestedAt: string;
  processedAt?: string;
  transactionReference?: string;
  creator?: {
    id: string;
    email: string;
    creatorProfile?: {
      displayName: string;
      handle: string;
      totalEarnings: number;
    };
  };
}

interface FinanceOverview {
  totalEscrowBudget: number;
  totalDistributedRewards: number;
  pendingWithdrawalsTotal: number;
  pendingWithdrawalsCount: number;
  totalPaidOut: number;
}

export default function AdminFinancePage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([]);
  const [overview, setOverview] = useState<FinanceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"withdrawals" | "ledger">("withdrawals");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [txRefInput, setTxRefInput] = useState("");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ovRes, wdRes] = await Promise.all([
        apiGet<{ success: boolean; data: FinanceOverview }>("/api/v1/finance/admin/overview").catch(() => null),
        apiGet<{ success: boolean; data: WithdrawalItem[] }>("/api/v1/finance/admin/withdrawals").catch(() => null),
      ]);

      if (ovRes?.data) setOverview(ovRes.data);
      if (wdRes?.data) setWithdrawals(wdRes.data);
    } catch (err) {
      console.error("Failed to load finance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReview = async (id: string, status: "PROCESSED" | "APPROVED" | "REJECTED") => {
    setActionInProgress(id);
    try {
      const res = await apiPatch<{ success: boolean; data: any }>(
        `/api/v1/finance/admin/withdrawals/${id}/review`,
        {
          status,
          transactionReference: txRefInput.trim() || undefined,
        }
      );

      if (res?.data) {
        setWithdrawals((prev) =>
          prev.map((w) => (w.id === id ? { ...w, status, transactionReference: txRefInput.trim() || w.transactionReference } : w))
        );
        setProcessingId(null);
        setTxRefInput("");
        // Refresh overview
        apiGet<{ success: boolean; data: FinanceOverview }>("/api/v1/finance/admin/overview").then((r) => {
          if (r?.data) setOverview(r.data);
        });
      }
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  const filtered = withdrawals.filter((w) => {
    const creatorName = w.creator?.creatorProfile?.displayName || "";
    const creatorHandle = w.creator?.creatorProfile?.handle || w.creator?.email || "";
    const matchesSearch =
      creatorName.toLowerCase().includes(search.toLowerCase()) ||
      creatorHandle.toLowerCase().includes(search.toLowerCase()) ||
      w.destinationDetails.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            Escrow & Treasury Operations
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-text">
            Finance & Payout Ledger
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Audit brand escrow reserves, review creator withdrawal requests, and reconcile transaction settlement history.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text hover:bg-surface-3 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-subtle">
            <span>Total Escrow Pool</span>
            <DollarSign className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-accent tabular-nums">
            {formatCurrency(overview?.totalEscrowBudget || 0)}
          </div>
          <div className="text-[11px] font-mono text-text-muted">
            Committed by sponsors
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-subtle">
            <span>Rewards Allocated</span>
            <Wallet className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-text tabular-nums">
            {formatCurrency(overview?.totalDistributedRewards || 0)}
          </div>
          <div className="text-[11px] font-mono text-text-muted">
            Earned on audited views
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-subtle">
            <span>Pending Payout Queue</span>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-bold font-mono text-warning tabular-nums">
            {formatCurrency(overview?.pendingWithdrawalsTotal || 0)}
          </div>
          <div className="text-[11px] font-mono text-text-muted">
            {overview?.pendingWithdrawalsCount || 0} requests awaiting review
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-subtle">
            <span>Settled Payouts</span>
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-bold font-mono text-success tabular-nums">
            {formatCurrency(overview?.totalPaidOut || 0)}
          </div>
          <div className="text-[11px] font-mono text-text-muted">
            Transferred via Stripe & USDC
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="w-3.5 h-3.5 text-text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by creator, handle, or account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-1 py-1.5 pl-9 pr-3 text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {["ALL", "PENDING", "PROCESSED", "APPROVED", "REJECTED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-3 py-1.5 text-xs font-mono transition-colors ${
                statusFilter === s
                  ? "bg-accent text-accent-ink font-semibold"
                  : "border border-border bg-surface-1 text-text-muted hover:text-text"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="rounded-xl border border-border bg-surface-1 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-text-subtle bg-surface-2/40">
                <th className="py-3 px-4 font-medium">Creator</th>
                <th className="py-3 px-4 font-medium">Amount</th>
                <th className="py-3 px-4 font-medium">Method</th>
                <th className="py-3 px-4 font-medium">Destination</th>
                <th className="py-3 px-4 font-medium">Requested</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading && withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-text-subtle">
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-accent" />
                    Loading withdrawal requests...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-text-subtle">
                    No withdrawal requests matching current criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((w) => {
                  const creatorDisplayName = w.creator?.creatorProfile?.displayName || "Creator";
                  const creatorHandle = w.creator?.creatorProfile?.handle
                    ? `@${w.creator.creatorProfile.handle}`
                    : w.creator?.email || "creator";
                  const isPending = w.status === "PENDING";

                  return (
                    <tr key={w.id} className="hover:bg-surface-2/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-sans font-medium text-text">{creatorDisplayName}</div>
                        <div className="text-[11px] text-text-subtle">{creatorHandle}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-accent tabular-nums">
                        {formatCurrency(w.amount, w.currency)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded bg-surface-2 px-2 py-0.5 text-[11px] font-mono border border-border">
                          {w.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text truncate max-w-[200px]" title={w.destinationDetails}>
                        {w.destinationDetails}
                      </td>
                      <td className="py-3 px-4 text-text-muted">
                        {formatDate(w.requestedAt)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`rounded px-2 py-0.5 text-[11px] font-mono font-semibold border ${
                            w.status === "PROCESSED"
                              ? "bg-success/10 text-success border-success/30"
                              : w.status === "APPROVED"
                              ? "bg-accent/10 text-accent border-accent/30"
                              : w.status === "REJECTED"
                              ? "bg-danger/10 text-danger border-danger/30"
                              : "bg-warning/10 text-warning border-warning/30"
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isPending ? (
                          processingId === w.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <input
                                type="text"
                                placeholder="Tx Hash / Reference (optional)"
                                value={txRefInput}
                                onChange={(e) => setTxRefInput(e.target.value)}
                                className="rounded border border-border bg-surface-2 px-2 py-1 text-[11px] text-text w-44 focus:outline-none focus:border-accent"
                              />
                              <button
                                onClick={() => handleReview(w.id, "PROCESSED")}
                                disabled={actionInProgress === w.id}
                                className="rounded bg-success px-2.5 py-1 text-[11px] font-bold text-black hover:opacity-90 transition-opacity"
                              >
                                Confirm Payout
                              </button>
                              <button
                                onClick={() => setProcessingId(null)}
                                className="rounded border border-border px-2 py-1 text-[11px] text-text-muted hover:text-text"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setProcessingId(w.id)}
                                className="rounded bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-ink hover:opacity-95 shadow transition-all"
                              >
                                Process Payout
                              </button>
                              <button
                                onClick={() => handleReview(w.id, "REJECTED")}
                                disabled={actionInProgress === w.id}
                                className="rounded bg-danger/15 border border-danger/30 px-2 py-1 text-[11px] font-medium text-danger hover:bg-danger/25 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )
                        ) : (
                          <span className="text-[11px] text-text-subtle font-mono">
                            {w.transactionReference ? `Ref: ${w.transactionReference.slice(0, 12)}...` : "Reconciled"}
                          </span>
                        )}
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
