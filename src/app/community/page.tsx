import React from "react";
import { siteConfig } from "@/site.config";
import { PlatformIcon } from "@/components/PlatformIcons";
import { ArrowUpRight, Users, MessageSquare, Bell, Award } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            Discord Workspace
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-text">
            The {siteConfig.name} Creator Community
          </h1>
          <p className="mt-4 text-base text-text-muted leading-relaxed">
            Our Discord server is the operational beating heart of {siteConfig.name}. Over 4,200 tech creators, video editors, and brand marketers collaborate daily.
          </p>

          <div className="mt-8">
            <a
              href={siteConfig.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity"
            >
              <PlatformIcon platform="discord" className="w-4 h-4" />
              <span>Join Discord Server</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-border">
          <div className="rounded-lg border border-border bg-surface-1 p-5 space-y-3">
            <Bell className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-text">Instant Launch Alerts</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Get notified the second a high-CPM developer or consumer tech campaign opens its reward pool.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface-1 p-5 space-y-3">
            <MessageSquare className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-text">Direct Brand Channels</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Every campaign gets a dedicated channel (#campaign-cursor-ai) where brand leads answer questions and review concepts.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface-1 p-5 space-y-3">
            <Users className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-text">Peer Feedback & Hooks</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Share video hooks, script outlines, and pacing ideas with experienced short-form editors.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface-1 p-5 space-y-3">
            <Award className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-text">Weekly Payout Feed</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Real-time feed showing automated weekly payout transactions dispatched to verified creators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

