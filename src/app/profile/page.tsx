"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import { PlatformIcon } from "@/components/PlatformIcons";
import { apiGet, apiPatch, apiPost } from "@/lib/api-client";
import {
  ShieldCheck,
  Plus,
  Check,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Wallet,
  RefreshCw,
} from "lucide-react";
import { PlatformType } from "@/types";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  status: string;
  creatorProfile?: {
    displayName: string;
    handle: string;
    bio?: string;
    avatarUrl?: string;
    socialAccounts?: string;
    walletAddress?: string;
    totalEarnings: number;
    totalViews: number;
    isVerified: boolean;
  };
}

interface Submission {
  id: string;
  campaignId: string;
  platform: string;
  contentUrl: string;
  submittedAt: string;
  status: "PENDING" | "VERIFIED" | "REJECTED" | "FLAGGED";
  reportedViews: number;
  verifiedViews: number;
  rewardAmount: number;
  campaign?: {
    title: string;
    slug?: string;
    rewardRateCpm: number;
  };
}

interface BalanceData {
  totalEarnings: number;
  totalViews: number;
  ledger: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    createdAt: string;
  }>;
  withdrawals: Array<{
    id: string;
    amount: number;
    status: string;
    paymentMethod: string;
    requestedAt: string;
  }>;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"submissions" | "earnings" | "settings">("submissions");

  // Profile edit states
  const [bio, setBio] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [socials, setSocials] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Withdrawal state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState<"STRIPE" | "USDC" | "BANK_WIRE">("STRIPE");
  const [withdrawDestination, setWithdrawDestination] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // New social channel input
  const [newPlatform, setNewPlatform] = useState<PlatformType>("tiktok");
  const [newHandle, setNewHandle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      // Check if logged in
      const resUser = await apiGet<{ success: boolean; data: { user: UserProfile } }>("/api/v1/auth/me").catch(() => null);
      if (!resUser?.data?.user) {
        if (typeof window !== "undefined") {
          window.location.href = "/login?redirect=/profile";
        }
        return;
      }

      const u = resUser.data.user;
      setUser(u);
      setBio(u.creatorProfile?.bio || "Verified creator on the Collabefy performance marketing network.");
      setWalletAddress(u.creatorProfile?.walletAddress || "");

      // Parse social accounts
      if (u.creatorProfile?.socialAccounts) {
        try {
          const parsed = JSON.parse(u.creatorProfile.socialAccounts);
          if (Array.isArray(parsed)) setSocials(parsed);
        } catch {
          setSocials([]);
        }
      }

      // Fetch Submissions and Finance
      const [subsRes, balRes] = await Promise.all([
        apiGet<{ success: boolean; data: Submission[] }>("/api/v1/submissions/my").catch(() => ({ data: [] })),
        apiGet<{ success: boolean; data: BalanceData }>("/api/v1/finance/balance").catch(() => ({ data: null })),
      ]);

      if (subsRes?.data) setSubmissions(subsRes.data);
      if (balRes?.data) setBalance(balRes.data);
    } catch (err) {
      console.error("Failed to load profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProfile = async () => {
    setSaved(false);
    setSaveError(null);
    try {
      await apiPatch("/api/v1/auth/profile", {
        bio,
        walletAddress,
        socialAccounts: JSON.stringify(socials),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save profile changes.");
    }
  };

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle || !newUrl) return;
    const updated = [
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
    ];
    setSocials(updated);
    setNewHandle("");
    setNewUrl("");
  };

  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    setWithdrawSuccess(null);
    setWithdrawing(true);

    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) {
      setWithdrawError("Please enter a valid amount.");
      setWithdrawing(false);
      return;
    }

    try {
      const res = await apiPost<{ success: boolean; data: any }>("/api/v1/finance/withdraw", {
        amount: amt,
        paymentMethod: withdrawMethod,
        destinationDetails: withdrawDestination || user?.email || "Account on file",
      });

      if (res?.data) {
        setWithdrawSuccess(`Withdrawal request of $${amt.toFixed(2)} submitted successfully.`);
        setWithdrawAmount("");
        setWithdrawDestination("");
        // Reload balance & ledger
        const balRes = await apiGet<{ success: boolean; data: BalanceData }>("/api/v1/finance/balance").catch(() => null);
        if (balRes?.data) setBalance(balRes.data);
      }
    } catch (err: any) {
      setWithdrawError(err.message || "Failed to submit withdrawal request.");
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-xs font-mono text-text-subtle">
          <RefreshCw className="w-4 h-4 text-accent animate-spin" />
          <span>Loading creator workspace...</span>
        </div>
      </div>
    );
  }

  const creatorName = user?.creatorProfile?.displayName || user?.email.split("@")[0] || "Creator";
  const creatorHandle = user?.creatorProfile?.handle || user?.email.split("@")[0] || "handle";
  const totalViews = balance?.totalViews ?? (user?.creatorProfile?.totalViews || 0);
  const totalEarned = balance?.totalEarnings ?? (user?.creatorProfile?.totalEarnings || 0);

  return (
    <div className="py-12 md:py-16">
      <div className="container-fluid">
        {/* Creator Header Profile Card */}
        <div className="rounded-xl border border-border bg-surface-1 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center font-mono text-xl sm:text-2xl font-bold text-accent shadow-md">
                {creatorName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-text">{creatorName}</h1>
                  <span className="rounded bg-accent/10 border border-accent/20 px-2 py-0.5 text-xs font-mono text-accent font-semibold uppercase">
                    {user?.role || "CREATOR"}
                  </span>
                  {user?.creatorProfile?.isVerified && (
                    <span className="inline-flex items-center gap-1 rounded bg-success/10 text-success border border-success/20 px-2 py-0.5 text-[10px] font-mono">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-text-subtle mt-1">
                  @{creatorHandle} • {user?.email}
                </div>
                <p className="text-xs text-text-muted mt-2 max-w-xl leading-relaxed">{bio}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/campaigns"
                className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-accent-ink hover:opacity-95 transition-opacity shadow-sm"
              >
                <span>Browse Campaigns</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Real Metrics Bar from Database */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/80">
            <div className="rounded-lg border border-border/60 bg-surface-2 p-3.5">
              <span className="text-[11px] font-mono text-text-subtle uppercase">Audited Views</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-text tabular-nums mt-1 block">
                {formatNumber(totalViews)}
              </span>
            </div>
            <div className="rounded-lg border border-border/60 bg-surface-2 p-3.5">
              <span className="text-[11px] font-mono text-text-subtle uppercase">Lifetime Earnings</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-accent tabular-nums mt-1 block">
                {formatCurrency(totalEarned)}
              </span>
            </div>
            <div className="rounded-lg border border-border/60 bg-surface-2 p-3.5">
              <span className="text-[11px] font-mono text-text-subtle uppercase">Active Submissions</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-text tabular-nums mt-1 block">
                {submissions.length}
              </span>
            </div>
            <div className="rounded-lg border border-border/60 bg-surface-2 p-3.5">
              <span className="text-[11px] font-mono text-text-subtle uppercase">Account Standing</span>
              <span className="text-sm font-mono text-success flex items-center gap-1.5 mt-2 font-semibold">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>Active & In Good Standing</span>
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("submissions")}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "submissions"
                ? "border-accent text-accent font-semibold"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            My Submissions ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "earnings"
                ? "border-accent text-accent font-semibold"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Earnings & Payouts
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "settings"
                ? "border-accent text-accent font-semibold"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Profile & Channels
          </button>
        </div>

        {/* Tab 1: Submissions */}
        {activeTab === "submissions" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-text">Content Submissions & Audit Status</h3>
                  <span className="text-xs text-text-subtle">
                    Real-time verification status from the Collabefy audit engine.
                  </span>
                </div>
                <button
                  onClick={fetchData}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-surface-2 text-xs font-mono text-text hover:bg-surface-3 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-accent" />
                  <span>Refresh</span>
                </button>
              </div>

              {submissions.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center mx-auto text-text-subtle">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-text">No Submissions Found</h4>
                  <p className="text-xs text-text-muted max-w-sm mx-auto">
                    You have not submitted any clips to active campaigns yet. Browse campaigns to get started!
                  </p>
                  <Link
                    href="/campaigns"
                    className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-accent-ink hover:opacity-95 mt-2"
                  >
                    <span>Browse Active Campaigns</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-border text-text-subtle bg-surface-2/40">
                        <th className="py-3 px-4 font-medium">Campaign</th>
                        <th className="py-3 px-4 font-medium">Platform</th>
                        <th className="py-3 px-4 font-medium">Submitted</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium text-right">Audited Views</th>
                        <th className="py-3 px-4 font-medium text-right">Reward Earned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-surface-2/30 transition-colors">
                          <td className="py-3.5 px-4 font-sans">
                            <Link
                              href={`/campaigns/${sub.campaign?.slug || ""}`}
                              className="font-semibold text-text hover:text-accent transition-colors block"
                            >
                              {sub.campaign?.title || "Campaign"}
                            </Link>
                            <a
                              href={sub.contentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-mono text-text-subtle hover:text-text flex items-center gap-1 mt-0.5 truncate max-w-xs"
                            >
                              <span>{sub.contentUrl}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="capitalize text-text">{sub.platform}</span>
                          </td>
                          <td className="py-3.5 px-4 text-text-subtle">{formatDate(sub.submittedAt)}</td>
                          <td className="py-3.5 px-4">
                            {sub.status === "VERIFIED" ? (
                              <span className="inline-flex items-center gap-1 rounded bg-success/10 text-success border border-success/20 px-2 py-0.5 text-[10px] font-semibold">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Verified</span>
                              </span>
                            ) : sub.status === "REJECTED" ? (
                              <span className="inline-flex items-center gap-1 rounded bg-danger/10 text-danger border border-danger/20 px-2 py-0.5 text-[10px] font-semibold">
                                <span>Rejected</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded bg-warning/10 text-warning border border-warning/20 px-2 py-0.5 text-[10px] font-semibold">
                                <Clock className="w-3 h-3" />
                                <span>Under 48h Audit</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right font-medium text-text tabular-nums">
                            {formatNumber(sub.verifiedViews || sub.reportedViews || 0)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-accent tabular-nums">
                            {formatCurrency(sub.rewardAmount || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Earnings & Payouts */}
        {activeTab === "earnings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-2">
                <span className="text-xs font-mono text-text-subtle uppercase">Settled Lifetime Earnings</span>
                <div className="text-3xl font-bold font-mono text-accent tabular-nums">
                  {formatCurrency(totalEarned)}
                </div>
                <p className="text-xs text-text-muted pt-2">Total credited to your account ledger.</p>
              </div>

              <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-2">
                <span className="text-xs font-mono text-text-subtle uppercase">Audited Views Delivered</span>
                <div className="text-3xl font-bold font-mono text-text tabular-nums">
                  {formatNumber(totalViews)}
                </div>
                <p className="text-xs text-text-muted pt-2">Qualified views across active brand campaigns.</p>
              </div>

              <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-2">
                <span className="text-xs font-mono text-text-subtle uppercase">Payout Settlement</span>
                <div className="flex items-center gap-2 pt-1">
                  <span className="rounded bg-surface-2 border border-border px-2 py-1 text-xs font-mono text-text font-medium">
                    Weekly Automatic & On-Demand
                  </span>
                  <span className="text-xs text-success font-mono font-semibold">Active</span>
                </div>
                <p className="text-xs text-text-muted pt-2">Automated ACH, Stripe Direct & USDC transfers.</p>
              </div>
            </div>

            {/* Request Withdrawal Form Card */}
            <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-accent" />
                <h3 className="text-base font-semibold text-text">Request Earnings Withdrawal</h3>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Available settled balance is eligible for disbursement. Minimum withdrawal threshold is $50.00.
              </p>

              {withdrawSuccess && (
                <div className="rounded-md border border-success/40 bg-success/10 p-3 text-xs text-success flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{withdrawSuccess}</span>
                </div>
              )}
              {withdrawError && (
                <div className="rounded-md border border-danger/40 bg-danger/10 p-3 text-xs text-danger flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{withdrawError}</span>
                </div>
              )}

              <form onSubmit={handleRequestWithdrawal} className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                <div>
                  <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                    Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="50.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text font-mono focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                    Payout Method
                  </label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value as any)}
                    className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text font-mono focus:border-accent focus:outline-none"
                  >
                    <option value="STRIPE">Stripe Direct</option>
                    <option value="USDC">USDC (Base / Solana)</option>
                    <option value="BANK_WIRE">Bank Wire</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                    Destination Details
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Email, IBAN, or Wallet Address"
                    value={withdrawDestination}
                    onChange={(e) => setWithdrawDestination(e.target.value)}
                    className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text font-mono focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={withdrawing}
                    className="w-full rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity disabled:opacity-50"
                  >
                    {withdrawing ? "Submitting..." : "Submit Withdrawal"}
                  </button>
                </div>
              </form>
            </div>

            {/* Earnings Ledger Table */}
            {balance?.ledger && balance.ledger.length > 0 && (
              <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h4 className="text-sm font-semibold text-text">Recent Ledger Activity</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-border text-text-subtle bg-surface-2/40">
                        <th className="py-2.5 px-4 font-medium">Type</th>
                        <th className="py-2.5 px-4 font-medium">Description</th>
                        <th className="py-2.5 px-4 font-medium">Date</th>
                        <th className="py-2.5 px-4 font-medium text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {balance.ledger.map((entry) => (
                        <tr key={entry.id} className="hover:bg-surface-2/30">
                          <td className="py-2.5 px-4 font-semibold text-text">{entry.type}</td>
                          <td className="py-2.5 px-4 text-text-muted">{entry.description}</td>
                          <td className="py-2.5 px-4 text-text-subtle">{formatDate(entry.createdAt)}</td>
                          <td className="py-2.5 px-4 text-right font-bold text-accent tabular-nums">
                            {formatCurrency(entry.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Settings & Channels */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-3xl">
            {/* Bio and Wallet Card */}
            <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                  Creator Profile Details
                </span>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-1.5 text-xs font-semibold text-accent-ink hover:opacity-95 transition-opacity"
                >
                  {saved ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{saved ? "Saved to Database" : "Save Changes"}</span>
                </button>
              </div>

              {saveError && (
                <div className="rounded-md border border-danger/40 bg-danger/10 p-3 text-xs text-danger">
                  {saveError}
                </div>
              )}

              <div>
                <label className="text-xs font-mono text-text-subtle block mb-1.5">Bio Narrative</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface-2 p-3 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle block mb-1.5">USDC Wallet Address (Optional)</label>
                <input
                  type="text"
                  placeholder="0x... or Solana pubkey"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text font-mono placeholder:text-text-subtle focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Social channels */}
            <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-5">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent block">
                Connected Creator Social Channels
              </span>

              {socials.length === 0 ? (
                <p className="text-xs text-text-subtle">No channels linked yet. Add your social media profiles below.</p>
              ) : (
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
                            <span>Linked Channel</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add social form */}
              <form onSubmit={handleAddSocial} className="pt-4 border-t border-border space-y-3">
                <span className="text-xs font-mono text-text-subtle uppercase block">Link Additional Channel</span>
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
                  className="flex items-center gap-1.5 rounded-md bg-surface-2 border border-border px-3.5 py-2 text-xs font-medium text-text hover:bg-surface-3 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-accent" />
                  <span>Connect Channel</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
