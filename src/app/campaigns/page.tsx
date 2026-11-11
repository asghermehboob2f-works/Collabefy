"use client";

import React, { useState, useMemo } from "react";
import { initialCampaigns } from "@/lib/data";
import { Campaign, CampaignStatus, PlatformType, CampaignType } from "@/types";
import { CampaignCard } from "@/components/CampaignCard";
import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function CampaignsDirectoryPage() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "highest_rate" | "ending_soon">("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter & sort logic
  const filteredCampaigns = useMemo(() => {
    let list = [...initialCampaigns];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.brandName.toLowerCase().includes(q) ||
          c.brandCategory.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q)
      );
    }

    if (selectedStatus !== "all") {
      list = list.filter((c) => c.status === selectedStatus);
    }

    if (selectedPlatform !== "all") {
      list = list.filter((c) => c.platforms.includes(selectedPlatform as PlatformType));
    }

    if (selectedType !== "all") {
      list = list.filter((c) => c.campaignType === selectedType);
    }

    if (sortBy === "highest_rate") {
      list.sort((a, b) => b.rewardRate - a.rewardRate);
    } else if (sortBy === "ending_soon") {
      list.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [search, selectedStatus, selectedPlatform, selectedType, sortBy]);

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
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            Marketplace
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-text">
            Campaign Catalogue
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Explore verified sponsorships with guaranteed escrow and transparent performance rates.
          </p>
        </div>

        {/* Top Controls Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
            <input
              type="text"
              placeholder="Search by campaign title, brand, or category..."
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
                <option value="highest_rate">Highest Rate</option>
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
                    { label: "TikTok", value: "tiktok" },
                    { label: "YouTube Shorts", value: "youtube_shorts" },
                    { label: "Instagram Reels", value: "instagram_reels" },
                    { label: "X / Twitter", value: "x" },
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

              {/* Campaign Type Filter */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-subtle uppercase tracking-wider block">
                  Campaign Format
                </label>
                <div className="space-y-1">
                  {[
                    { label: "All Formats", value: "all" },
                    { label: "Developer Tools", value: "developer_tools" },
                    { label: "Product Demos", value: "product_demo" },
                    { label: "UGC & Tutorials", value: "ugc" },
                    { label: "Short Form Clipping", value: "short_form_clipping" },
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

          {/* Results Grid */}
          <main className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between text-xs font-mono text-text-subtle">
              <span>Showing {filteredCampaigns.length} campaigns</span>
            </div>

            {filteredCampaigns.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-surface-1/40 p-12 text-center">
                <div className="mx-auto w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-subtle mb-3">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-text">No campaigns match your filters</h3>
                <p className="mt-1 text-xs text-text-muted max-w-sm mx-auto">
                  Try broadening your search keyword or clearing the selected status and platform filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 rounded-md bg-surface-2 border border-border px-4 py-2 text-xs font-medium text-text hover:bg-surface-3 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCampaigns.map((camp) => (
                  <CampaignCard key={camp.id} campaign={camp} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

