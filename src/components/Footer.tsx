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
} from "lucide-react";

export function Footer() {
  // Mobile accordion state (defaulting with LEGAL open to match reference)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    PRODUCT: false,
    COMPANY: false,
    LEGAL: true,
    NEWSLETTER: false,
  });

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [desktopEmail, setDesktopEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [desktopSubscribed, setDesktopSubscribed] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleMobileSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail("");
        setSubscribed(false);
      }, 4000);
    }
  };

  const handleDesktopSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (desktopEmail.trim()) {
      setDesktopSubscribed(true);
      setTimeout(() => {
        setDesktopEmail("");
        setDesktopSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="border-t border-white/5 bg-[#090A0C] text-text-muted pt-16 pb-12 font-sans selection:bg-accent selection:text-black">
      {/* ======================================================== */}
      {/* 1. DESKTOP / PC MODE VIEW (Full screen width edge-to-edge)*/}
      {/* ======================================================== */}
      <div className="hidden md:block w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-16 xl:gap-20 pb-16 w-full">
          {/* Brand Info & Socials (Far Left) */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-5">
            <Link href="/" className="group flex items-center gap-2.5">
              <img
                src="/media/logo.png"
                alt={siteConfig.name}
                className="h-8 w-8 rounded-md object-contain transition-transform group-hover:scale-105"
              />
              <span className="font-semibold text-lg tracking-tight text-text">
                {siteConfig.name}
              </span>
            </Link>

            <p className="text-sm text-text-muted leading-relaxed font-normal max-w-sm">
              Where creators and top-tier brands connect — instantly. Your performance engine for next-generation campaigns.
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-2 pt-1">
              {/* Instagram */}
              <a
                href={siteConfig.links.instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg border border-white/10 bg-[#131417] hover:bg-[#1C1E22] hover:border-white/25 hover:text-white flex items-center justify-center text-text-muted transition-all duration-200 shadow-sm"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* Discord */}
              <a
                href={siteConfig.links.discord}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord Community"
                className="w-9 h-9 rounded-lg border border-white/10 bg-[#131417] hover:bg-[#1C1E22] hover:border-white/25 hover:text-white flex items-center justify-center text-text-muted transition-all duration-200 shadow-sm"
              >
                <PlatformIcon platform="discord" className="w-4 h-4" />
              </a>

              {/* X */}
              <a
                href={siteConfig.links.twitter || "https://x.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-lg border border-white/10 bg-[#131417] hover:bg-[#1C1E22] hover:border-white/25 hover:text-white flex items-center justify-center text-text-muted transition-all duration-200 shadow-sm"
              >
                <PlatformIcon platform="x" className="w-4 h-4" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg border border-white/10 bg-[#131417] hover:bg-[#1C1E22] hover:border-white/25 hover:text-white flex items-center justify-center text-text-muted transition-all duration-200 shadow-sm"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              {/* YouTube */}
              <a
                href={siteConfig.links.youtube || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg border border-white/10 bg-[#131417] hover:bg-[#1C1E22] hover:border-white/25 hover:text-white flex items-center justify-center text-text-muted transition-all duration-200 shadow-sm"
              >
                <Youtube className="w-4 h-4" />
              </a>

              {/* GitHub */}
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg border border-white/10 bg-[#131417] hover:bg-[#1C1E22] hover:border-white/25 hover:text-white flex items-center justify-center text-text-muted transition-all duration-200 shadow-sm"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Columns (PRODUCT, COMPANY, LEGAL - Spread out across center) */}
          <div className="flex-1 grid grid-cols-3 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 w-full">
            {/* PRODUCT */}
            <div className="space-y-3.5">
              <div className="text-xs font-mono font-semibold tracking-wider text-text-subtle uppercase">
                PRODUCT
              </div>
              <ul className="space-y-2.5 text-xs font-normal">
                <li>
                  <Link href="/campaigns" className="text-text-muted hover:text-white transition-colors">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="text-text-muted hover:text-white transition-colors">
                    Spotlight
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-text-muted hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="text-text-muted hover:text-white transition-colors">
                    Platform
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-text-muted hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works#workflow" className="text-text-muted hover:text-white transition-colors">
                    Workflow
                  </Link>
                </li>
                <li>
                  <Link href="/campaigns#pricing" className="text-text-muted hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-text-muted hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/about#stories" className="text-text-muted hover:text-white transition-colors">
                    Stories
                  </Link>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div className="space-y-3.5">
              <div className="text-xs font-mono font-semibold tracking-wider text-text-subtle uppercase">
                COMPANY
              </div>
              <ul className="space-y-2.5 text-xs font-normal">
                <li>
                  <Link href="/about" className="text-text-muted hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-text-muted hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/about#engineering" className="text-text-muted hover:text-white transition-colors">
                    Engineering
                  </Link>
                </li>
                <li>
                  <Link href="/contact#careers" className="text-text-muted hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/faq#brands" className="text-text-muted hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* LEGAL */}
            <div className="space-y-3.5">
              <div className="text-xs font-mono font-semibold tracking-wider text-text-subtle uppercase">
                LEGAL
              </div>
              <ul className="space-y-2.5 text-xs font-normal">
                <li>
                  <Link href="/privacy" className="text-text-muted hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-text-muted hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy#cookies" className="text-text-muted hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms#licenses" className="text-text-muted hover:text-white transition-colors">
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* NEWSLETTER Column */}
          <div className="w-full lg:w-80 shrink-0 space-y-3">
            <div className="text-xs font-mono font-semibold tracking-wider text-text-subtle uppercase">
              NEWSLETTER
            </div>
            <p className="text-xs text-text-muted leading-relaxed font-normal">
              Product drops and creative tips — no spam.
            </p>

            {desktopSubscribed ? (
              <div className="flex items-center gap-2 text-accent py-2 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>You're subscribed! Keep an eye on your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleDesktopSubscribe} className="flex items-center gap-2 pt-1">
                <input
                  type="email"
                  required
                  value={desktopEmail}
                  onChange={(e) => setDesktopEmail(e.target.value)}
                  placeholder="you@studio.com"
                  className="flex-1 rounded-lg border border-white/10 bg-[#131417] px-3.5 py-2 text-xs text-white placeholder:text-text-subtle/60 focus:border-cyan-400 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 text-xs font-semibold text-white hover:opacity-95 transition-all shadow-[0_0_18px_rgba(59,130,246,0.35)] shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Desktop Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex items-center justify-between text-xs text-text-subtle font-normal">
          <p>© {new Date().getFullYear()} {siteConfig.name.toUpperCase()}. All rights reserved.</p>
          <p className="text-text-subtle/80">Engineered for motion, stills, and imagination.</p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MOBILE MODE VIEW (Preserved exactly as requested)     */}
      {/* ======================================================== */}
      <div className="md:hidden max-w-xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Brand Header */}
        <div className="space-y-4">
          <Link href="/" className="group flex items-center gap-2.5">
            <img
              src="/media/logo.png"
              alt={siteConfig.name}
              className="h-8 w-8 rounded-md object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-semibold text-lg tracking-tight text-text">
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
            href={siteConfig.links.youtube || "https://youtube.com"}
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
                    Demo
                  </Link>
                </div>
                <div>
                  <Link
                    href="/leaderboard"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Spotlight
                  </Link>
                </div>
                <div>
                  <Link
                    href="/how-it-works"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Features
                  </Link>
                </div>
                <div>
                  <Link
                    href="/profile"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Platform
                  </Link>
                </div>
                <div>
                  <Link
                    href="/community"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Community
                  </Link>
                </div>
                <div>
                  <Link
                    href="/how-it-works#workflow"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Workflow
                  </Link>
                </div>
                <div>
                  <Link
                    href="/campaigns#pricing"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Pricing
                  </Link>
                </div>
                <div>
                  <Link
                    href="/faq"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    FAQ
                  </Link>
                </div>
                <div>
                  <Link
                    href="/about#stories"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Stories
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
                    About
                  </Link>
                </div>
                <div>
                  <Link
                    href="/contact"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Contact
                  </Link>
                </div>
                <div>
                  <Link
                    href="/about#engineering"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Engineering
                  </Link>
                </div>
                <div>
                  <Link
                    href="/contact#careers"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    Careers
                  </Link>
                </div>
                <div>
                  <Link
                    href="/faq#brands"
                    className="text-text hover:text-accent transition-colors block"
                  >
                    FAQ
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
                  Product drops and creative tips — no spam.
                </p>
                {subscribed ? (
                  <div className="flex items-center gap-2 text-accent py-2 font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>You're subscribed! Keep an eye on your inbox.</span>
                  </div>
                ) : (
                  <form onSubmit={handleMobileSubscribe} className="flex gap-2 pt-1">
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

        {/* Mobile Bottom Copyright & Engineering note */}
        <div className="space-y-1.5 pt-2 text-xs text-text-subtle font-normal">
          <p>© {new Date().getFullYear()} {siteConfig.name.toUpperCase()}. All rights reserved.</p>
          <p className="text-text-subtle/80">Engineered for motion, stills, and imagination.</p>
        </div>
      </div>
    </footer>
  );
}
