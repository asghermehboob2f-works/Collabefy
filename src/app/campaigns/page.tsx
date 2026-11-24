"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Campaign, PlatformType } from "@/types";
import { CampaignCard } from "@/components/CampaignCard";
import { Search, X, SlidersHorizontal, RotateCcw, Loader2, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiGet } from "@/lib/api-client";
import { normalizeCampaign } from "@/lib/utils";

interface ApiResponse {
  success: boolean;
  data: any[];
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

const PAGE_SIZE = 6;

export default function CampaignsDirectoryPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters & Sorting state
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "highest_rate" | "ending_soon">("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Ref for infinite-scroll observer
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Fetch a page of campaigns from the backend
  const fetchCampaignsPage = useCallback(
    async (targetPage: number, isInitial: boolean = false) => {
      if (isInitial) {
        setInitialLoading(true);
        setFetchError(null);
      } else {
        setLoadingMore(true);
      }

      try {
        const queryParams = new URLSearchParams();
        queryParams.set("page", String(targetPage));
        queryParams.set("limit", String(PAGE_SIZE));
        queryParams.set("sortBy", sortBy);

        if (search.trim()) {
          queryParams.set("search", search.trim());
        }
        if (selectedPlatform !== "all") {
          queryParams.set("platform", selectedPlatform);
        }
        if (selectedType !== "all") {
          queryParams.set("category", selectedType);
        }

        const res = await apiGet<ApiResponse>(`/api/v1/campaigns?${queryParams.toString()}`);

        if (res?.data && Array.isArray(res.data)) {
          const mapped: Campaign[] = res.data.map(normalizeCampaign);

          setCampaigns((prev) => {
            if (isInitial || targetPage === 1) {
              return mapped;
            }
            // Strict duplicate prevention using a Set of IDs
            const existingIds = new Set(prev.map((c) => c.id));
            const freshItems = mapped.filter((c) => !existingIds.has(c.id));
            return [...prev, ...freshItems];
          });

          if (res.pagination) {
            setTotalCount(res.pagination.totalCount);
            setHasMore(res.pagination.hasMore);
          } else {
            setTotalCount(mapped.length);
            setHasMore(false);
          }
          setPage(targetPage);
        } else {
          if (isInitial) setCampaigns([]);
          setHasMore(false);
        }
      } catch (err: any) {
        console.error("Failed to fetch campaigns from backend:", err);
        setFetchError(err.message || "Unable to reach campaign catalogue. Please check connection.");
      } finally {
        if (isInitial) {
          setInitialLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [search, selectedPlatform, selectedType, sortBy]
  );

  // Re-fetch on filter or sort change
  useEffect(() => {
    setPage(1);
    fetchCampaignsPage(1, true);
  }, [fetchCampaignsPage]);

  // Load more trigger
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchCampaignsPage(page + 1, false);
    }
  };

  // IntersectionObserver for natural bottom scrolling
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !initialLoading) {
          handleLoadMore();
        }
      },
      { rootMargin: "250px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, initialLoading, page]);

  // Client-side status filtering if non-active statuses are simulated
  const displayedCampaigns = useMemo(() => {
    if (selectedStatus === "all") return campaigns;
    return campaigns.filter((c) => c.status === selectedStatus);
  }, [campaigns, selectedStatus]);

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedStatus !== "all" ||
    selectedPlatform !== "all" ||
    selectedType !== "all";

  const clearAllFilters = () => {
    setSearch("");
    setSelectedStatus("all");
    setSelectedPlatform("all");
    setSelectedType("all");
    setSortBy("newest");
  };

  return (
    <div className="py-10">
      <div className="container-fluid">
        {/* Page Header */}
        <div className="mb-8">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            Performance Marketplace
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-text">
            Campaign Catalogue
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Explore verified short-form video sponsorships with guaranteed escrow pools and fixed upfront CPM rates.
          </p>
        </div>

        {/* Top Controls Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
            <input
              type="text"
              placeholder="Search by title, brand, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-1 py-2 pl-10 pr-4 text-sm text-text placeholder:text-text-subtle focus:border-border-strong focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Sort & Mobile Drawer Trigger */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-text-subtle hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-md border border-border bg-surface-1 px-3 py-2 text-xs font-mono text-text focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="highest_rate">Highest CPM Rate</option>
                <option value="ending_soon">Ending Soonest</option>
              </select>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="sm:hidden flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-medium text-text"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2 pt-1 pb-2 border-b border-border/60">
            <span className="text-xs font-mono text-text-subtle">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-surface-2 border border-border px-2 py-0.5 text-xs font-mono text-text">
                Query: "{search}"
                <button onClick={() => setSearch("")}>
                  <X className="w-3 h-3 hover:text-accent" />
                </button>
              </span>
            )}
            {selectedStatus !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-surface-2 border border-border px-2 py-0.5 text-xs font-mono text-text">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus("all")}>
                  <X className="w-3 h-3 hover:text-accent" />
                </button>
              </span>
            )}
            {selectedPlatform !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-surface-2 border border-border px-2 py-0.5 text-xs font-mono text-text">
                Platform: {selectedPlatform}
                <button onClick={() => setSelectedPlatform("all")}>
                  <X className="w-3 h-3 hover:text-accent" />
                </button>
              </span>
            )}
            {selectedType !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-surface-2 border border-border px-2 py-0.5 text-xs font-mono text-text">
                Type: {selectedType.replace("_", " ")}
                <button onClick={() => setSelectedType("all")}>
                  <X className="w-3 h-3 hover:text-accent" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs font-mono text-accent hover:underline ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all</span>
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className={`lg:block ${mobileFiltersOpen ? "block" : "hidden"}`}>
            <div className="rounded-lg border border-border bg-surface-1 p-5 space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-text">
                  Refine Results
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-mono text-text-subtle hover:text-accent transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-subtle uppercase tracking-wider block">
                  Campaign Status
                </label>
                <div className="space-y-1">
                  {[
                    { label: "All Statuses", value: "all" },
                    { label: "Active", value: "active" },
                    { label: "Upcoming", value: "upcoming" },
                    { label: "Completed", value: "completed" },
                  ].map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedStatus(s.value)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                        selectedStatus === s.value
                          ? "bg-surface-3 text-accent font-semibold"
                          : "text-text-muted hover:text-text hover:bg-surface-2"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Filter */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-subtle uppercase tracking-wider block">
                  Publishing Platform
                </label>
                <div className="space-y-1">
                  {[
                    { label: "All Platforms", value: "all" },
                    { label: "TikTok", value: "TikTok" },
                    { label: "YouTube Shorts", value: "YouTube Shorts" },
                    { label: "Instagram Reels", value: "Instagram Reels" },
                    { label: "X (Twitter)", value: "X (Twitter)" },
                  ].map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setSelectedPlatform(p.value)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                        selectedPlatform === p.value
                          ? "bg-surface-3 text-accent font-semibold"
                          : "text-text-muted hover:text-text hover:bg-surface-2"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campaign Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-subtle uppercase tracking-wider block">
                  Campaign Category
                </label>
                <div className="space-y-1">
                  {[
                    { label: "All Categories", value: "all" },
                    { label: "Developer Tools & Cloud", value: "Developer Tools" },
                    { label: "AI & Machine Learning", value: "AI" },
                    { label: "Productivity & SaaS", value: "Productivity" },
                    { label: "Gaming & Esports", value: "Gaming" },
                    { label: "Music & Entertainment", value: "Music" },
                    { label: "FinTech & Crypto", value: "FinTech" },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setSelectedType(t.value)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                        selectedType === t.value
                          ? "bg-surface-3 text-accent font-semibold"
                          : "text-text-muted hover:text-text hover:bg-surface-2"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid & Load More Container */}
          <main className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-text-subtle">
              <span>
                Showing {displayedCampaigns.length} of {totalCount || displayedCampaigns.length} campaigns
              </span>
              <button
                onClick={() => fetchCampaignsPage(1, true)}
                className="hover:text-text flex items-center gap-1 transition-colors"
                title="Refresh campaigns"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${initialLoading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Error State */}
            {fetchError && (
              <div className="rounded-lg border border-danger/40 bg-danger/10 p-4 text-xs text-danger flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fetchError}</span>
                </div>
                <button
                  onClick={() => fetchCampaignsPage(1, true)}
                  className="rounded border border-danger/40 px-3 py-1 font-mono hover:bg-danger/20 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Skeleton Loading State */}
            {initialLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-surface-1 p-5 space-y-4 animate-pulse shadow-sm"
                  >
                    <div className="aspect-[16/9] w-full rounded-lg bg-surface-2" />
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 rounded bg-surface-2" />
                      <div className="h-3 w-1/2 rounded bg-surface-2" />
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border/40">
                      <div className="h-4 w-20 rounded bg-surface-2" />
                      <div className="h-4 w-24 rounded bg-surface-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedCampaigns.length === 0 ? (
              /* Empty State */
              <div className="rounded-lg border border-dashed border-border bg-surface-1/40 p-12 text-center">
                <div className="mx-auto w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-subtle mb-3">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-text">No campaigns match your filters</h3>
                <p className="mt-1 text-xs text-text-muted max-w-sm mx-auto">
                  Try broadening your search keyword or clearing the selected status and category filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 rounded-md bg-surface-2 border border-border px-4 py-2 text-xs font-medium text-text hover:bg-surface-3 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              /* Populated Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedCampaigns.map((camp) => (
                  <CampaignCard key={camp.id} campaign={camp} />
                ))}
              </div>
            )}

            {/* Load More & Infinite Scroll Section */}
            {!initialLoading && displayedCampaigns.length > 0 && (
              <div className="pt-6 pb-4 flex flex-col items-center justify-center space-y-3">
                {hasMore ? (
                  <>
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 hover:bg-surface-3 px-6 py-3 text-xs font-mono font-semibold text-text hover:border-accent/40 shadow-sm transition-all active:scale-98 disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-accent" />
                          <span>Loading more campaigns...</span>
                        </>
                      ) : (
                        <>
                          <span>Load More Campaigns</span>
                          <span className="text-text-subtle">
                            ({displayedCampaigns.length} of {totalCount})
                          </span>
                        </>
                      )}
                    </button>
                    {/* Natural scroll intersection trigger */}
                    <div ref={observerTarget} className="h-4 w-full" />
                  </>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-4 py-1.5 text-xs font-mono text-text-muted">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    <span>All {displayedCampaigns.length} active campaigns loaded</span>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
