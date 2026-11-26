"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { PlatformIcon } from "./PlatformIcons";
import {
  ChevronDown,
  ChevronUp,
  Instagram,
  Youtube,
  Linkedin,
  Github,
  Send,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function Footer() {
  // State for collapsible accordion sections (defaulting with LEGAL open to match reference)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    PRODUCT: false,
    COMPANY: false,
    LEGAL: true,
    NEWSLETTER: false,
  });

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail("");
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="border-t border-white/5 bg-[#090A0C] text-text-muted pt-16 pb-12 font-sans selection:bg-accent selection:text-black">
      <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Brand Header */}
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center p-1.5 shadow-sm group-hover:border-accent/50 transition-colors">
              <img
                src="/media/logo.png"
                alt={siteConfig.name}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-extrabold text-xl tracking-wider text-white uppercase font-mono">
              {siteConfig.name}
            </span>
          </Link>

          <p className="text-sm text-text-muted leading-relaxed max-w-md font-normal">
            Where creators and top-tier brands connect — instantly. Your performance engine for next-generation campaigns.
          </p>
        </div>

        {/* Social Icons Row */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Instagram */}
          <a
            href={siteConfig.links.instagram || "https://instagram.com"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-11 h-11 rounded-xl border border-white/10 bg-[#131417] hover:bg-[#1C1E22] hover:border-white/25 hover:text-white flex items-center justify-center text-text-muted transition-all duration-200 shadow-sm"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* Discord */}
          <a
            href={siteConfig.links.discord}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord Community"
            className="w-11 h-11 rounded-xl border border-white/10 bg-[#131417] hover:bg-[#1C1E22] hover:border-white/25 hover:text-white flex items-center justify-center text-text-muted transition-all duration-200 shadow-sm"
          >
            <PlatformIcon platform="discord" className="w-4 h-4" />
          </a>

          {/* X (Twitter) */}
          <a
            href={siteConfig.links.twitter || "https://x.com"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="w-11 h-11 rounded-xl border border-white/10 bg-[#131417] hover:bg-[#1C1E22] hover:border-white/25 hover:text-white flex items-center justify-center text-text-muted transition-all duration-200 shadow-sm"
          >
            <PlatformIcon platform="x" className="w-4 h-4" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-11 h-11 rounded-xl border border-white/10 bg-[#131417] hover:bg-[#1C1E22] hover:border-white/25 hover:text-white flex items-center justify-center text-text-muted transition-all duration-200 shadow-sm"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="w-11 h-11 rounded-xl border border-white/10 bg-[#131417] hover:bg-[#1C1E22] hover:border-white/25 hover:text-white flex items-center justify-center text-text-muted transition-all duration-200 shadow-sm"
          >
            <Youtube className="w-4 h-4" />
          </a>

          {/* GitHub */}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-11 h-11 rounded-xl border border-white/10 bg-[#131417] hover:bg-[#1C1E22] hover:border-white/25 hover:text-white flex items-center justify-center text-text-muted transition-all duration-200 shadow-sm"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>

        {/* Accordion Navigation Card */}
        <div className="rounded-2xl border border-white/10 bg-[#111215]/90 backdrop-blur-md p-3 sm:p-4 divide-y divide-white/5 shadow-xl">
          {/* PRODUCT */}
          <div className="py-2.5 first:pt-1 last:pb-1">
            <button
              type="button"
              onClick={() => toggleSection("PRODUCT")}
              className="w-full flex items-center justify-between py-1.5 text-xs font-mono font-semibold tracking-wider text-text-subtle hover:text-white transition-colors"
            >
              <span>PRODUCT</span>
              {openSections.PRODUCT ? (
                <ChevronUp className="w-4 h-4 text-text-subtle" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-subtle" />
              )}
            </button>
            {openSections.PRODUCT && (
              <div className="pt-3 pb-2 space-y-3.5 pl-0.5 animate-fade-in text-sm font-medium">
                <div>
                  <Link
                    href="/campaigns"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Browse Campaigns
                  </Link>
                </div>
                <div>
                  <Link
                    href="/profile"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Creator Portal & Earnings
                  </Link>
                </div>
                <div>
                  <Link
                    href="/leaderboard"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Performance Leaderboard
                  </Link>
                </div>
                <div>
                  <Link
                    href="/how-it-works"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    How It Works & CPM Rates
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* COMPANY */}
          <div className="py-2.5 first:pt-1 last:pb-1">
            <button
              type="button"
              onClick={() => toggleSection("COMPANY")}
              className="w-full flex items-center justify-between py-1.5 text-xs font-mono font-semibold tracking-wider text-text-subtle hover:text-white transition-colors"
            >
              <span>COMPANY</span>
              {openSections.COMPANY ? (
                <ChevronUp className="w-4 h-4 text-text-subtle" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-subtle" />
              )}
            </button>
            {openSections.COMPANY && (
              <div className="pt-3 pb-2 space-y-3.5 pl-0.5 animate-fade-in text-sm font-medium">
                <div>
                  <Link
                    href="/about"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    About Us
                  </Link>
                </div>
                <div>
                  <Link
                    href="/community"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Creator Community
                  </Link>
                </div>
                <div>
                  <Link
                    href="/contact"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Brand Partnerships & Support
                  </Link>
                </div>
                <div>
                  <Link
                    href="/faq"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    FAQ & Payout Rules
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* LEGAL (Expanded by default to match screenshot) */}
          <div className="py-2.5 first:pt-1 last:pb-1">
            <button
              type="button"
              onClick={() => toggleSection("LEGAL")}
              className="w-full flex items-center justify-between py-1.5 text-xs font-mono font-semibold tracking-wider text-text-subtle hover:text-white transition-colors"
            >
              <span>LEGAL</span>
              {openSections.LEGAL ? (
                <ChevronUp className="w-4 h-4 text-text-subtle" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-subtle" />
              )}
            </button>
            {openSections.LEGAL && (
              <div className="pt-3 pb-2 space-y-3.5 pl-0.5 animate-fade-in text-sm font-medium">
                <div>
                  <Link
                    href="/privacy"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Privacy Policy
                  </Link>
                </div>
                <div>
                  <Link
                    href="/terms"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Terms of Service
                  </Link>
                </div>
                <div>
                  <Link
                    href="/privacy#cookies"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Cookie Policy
                  </Link>
                </div>
                <div>
                  <Link
                    href="/terms#licenses"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Licenses
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* NEWSLETTER */}
          <div className="py-2.5 first:pt-1 last:pb-1">
            <button
              type="button"
              onClick={() => toggleSection("NEWSLETTER")}
              className="w-full flex items-center justify-between py-1.5 text-xs font-mono font-semibold tracking-wider text-text-subtle hover:text-white transition-colors"
            >
              <span>NEWSLETTER</span>
              {openSections.NEWSLETTER ? (
                <ChevronUp className="w-4 h-4 text-text-subtle" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-subtle" />
              )}
            </button>
            {openSections.NEWSLETTER && (
              <div className="pt-3 pb-2 space-y-3 pl-0.5 animate-fade-in text-xs">
                <p className="text-text-muted leading-relaxed">
                  Receive curated campaign drops, bonus CPM spikes, and platform alerts directly in your inbox.
                </p>
                {subscribed ? (
                  <div className="flex items-center gap-2 text-accent py-2 font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>You're subscribed! Keep an eye on your inbox.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2 pt-1">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 rounded-lg border border-white/10 bg-[#16171B] px-3 py-2 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none font-mono"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-accent px-4 py-2 font-semibold text-accent-ink hover:opacity-95 transition-opacity flex items-center gap-1.5 shrink-0"
                    >
                      <span>Join</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Engineering note */}
        <div className="space-y-1.5 pt-2 text-xs text-text-subtle font-normal">
          <p>© {new Date().getFullYear()} {siteConfig.name.toUpperCase()}. All rights reserved.</p>
          <p className="text-text-subtle/80">Engineered for creators, brands, and performance.</p>
        </div>
      </div>
    </footer>
  );
}
