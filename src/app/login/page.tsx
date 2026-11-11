"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { ArrowRight, Lock } from "lucide-react";
import { PlatformIcon } from "@/components/PlatformIcons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      window.location.href = "/profile";
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-accent text-accent-ink font-mono font-bold text-base">
              C
            </div>
            <span className="font-semibold text-lg text-text">{siteConfig.name}</span>
          </Link>
          <h1 className="text-xl font-semibold tracking-tight text-text">
            Sign in to your account
          </h1>
          <p className="text-xs text-text-muted">
            Manage your creator profile and linked social channels
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
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
                placeholder="creator@example.com"
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-border-strong focus:outline-none"
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
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity"
            >
              <span>{isSuccess ? "Signing In..." : "Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-text-subtle">
            Don't have an account?{" "}
            <Link href="/register" className="text-text hover:text-accent font-medium">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

