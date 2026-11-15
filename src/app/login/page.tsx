"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { ArrowRight, ShieldCheck, User } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);

    const role = email.toLowerCase().includes("admin") ? "admin" : "creator";
    if (typeof window !== "undefined") {
      localStorage.setItem("collabefy_role", role);
      localStorage.setItem("collabefy_email", email);
    }

    setTimeout(() => {
      window.location.href = role === "admin" ? "/admin" : "/profile";
    }, 400);
  };

  const handleQuickLogin = (role: "creator" | "admin") => {
    const demoEmail = role === "admin" ? "admin@collabefy.com" : "alex@creator.dev";
    setEmail(demoEmail);
    setPassword("password123");
    setIsSuccess(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("collabefy_role", role);
      localStorage.setItem("collabefy_email", demoEmail);
    }

    setTimeout(() => {
      window.location.href = role === "admin" ? "/admin" : "/profile";
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-ink font-mono font-bold text-base">
              C
            </div>
            <span className="font-semibold text-lg text-text">{siteConfig.name}</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            Sign in to your account
          </h1>
          <p className="text-xs text-text-muted">
            Access your creator dashboard, track performance, and view payouts
          </p>
        </div>

        {/* Quick Demo Login */}
        <div className="rounded-lg border border-border/80 bg-surface-2/60 p-3.5 space-y-2">
          <div className="text-[11px] font-mono text-text-subtle text-center uppercase tracking-wider">
            Quick Creator Access
          </div>
          <button
            type="button"
            onClick={() => handleQuickLogin("creator")}
            className="w-full flex items-center justify-center gap-1.5 rounded-md border border-border bg-surface-1 py-2 px-3 text-xs font-semibold text-text hover:border-accent hover:text-accent transition-colors"
          >
            <User className="w-3.5 h-3.5 text-accent" />
            <span>Instant Demo Creator Login</span>
          </button>
        </div>

        <div className="rounded-xl border border-border bg-surface-1 p-6 sm:p-8 space-y-4 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@collabefy.com"
                className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-text-subtle uppercase block">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-accent hover:underline font-mono"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSuccess}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              <span>{isSuccess ? "Authenticating..." : "Continue to Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-text-subtle">
            Don't have an account?{" "}
            <Link href="/register" className="text-accent hover:underline font-medium">
              Join as Creator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
