"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/site.config";
import { ArrowRight, AlertTriangle, ShieldAlert } from "lucide-react";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "CAMPAIGN_MANAGER", "FINANCE_MANAGER", "SUPPORT_MANAGER"];

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><span className="text-xs font-mono text-text-subtle">Loading login portal...</span></div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/profile";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Authenticate with the real backend database
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: email.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error?.message || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      const user = data?.data?.user;
      const accessToken = data?.data?.accessToken;

      if (!user) {
        setError("Invalid server response. Please try again.");
        setIsLoading(false);
        return;
      }

      const userRole = user.role?.toUpperCase();
      const isAdmin = ADMIN_ROLES.includes(userRole);

      if (typeof window !== "undefined") {
        if (isAdmin) {
          // Administrator Account: establish admin cookies & local session
          localStorage.setItem("collabefy_role", user.role.toLowerCase());
          localStorage.setItem("collabefy_admin_token", accessToken);
          localStorage.setItem("collabefy_email", user.email);
          localStorage.setItem("collabefy_user", JSON.stringify(user));

          // Set Next.js middleware cookies
          await fetch("/api/auth/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), password }),
          }).catch(() => null);

          window.location.href = "/admin";
          return;
        } else {
          // Standard Creator / Brand Account
          localStorage.setItem("collabefy_role", user.role.toLowerCase());
          localStorage.setItem("collabefy_token", accessToken);
          localStorage.setItem("collabefy_email", user.email);
          localStorage.setItem("collabefy_user", JSON.stringify(user));
          // Clean up any stale admin token
          localStorage.removeItem("collabefy_admin_token");

          window.location.href = redirectTo;
          return;
        }
      }
    } catch {
      setError("Unable to connect to authentication server. Please ensure the backend is running.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <img
              src="/media/logo.png"
              alt={siteConfig.name}
              className="h-8 w-8 rounded-md object-contain"
            />
            <span className="font-semibold text-lg text-text">{siteConfig.name}</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            Sign in to your account
          </h1>
          <p className="text-xs text-text-muted">
            Access your creator dashboard, track performance, and view payouts
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-danger/40 bg-danger/10 p-3.5 flex items-start gap-2.5 text-xs text-danger">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        <div className="rounded-xl border border-border bg-surface-1 p-6 sm:p-8 space-y-4 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Username or Email Address
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator username or email"
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              <span>{isLoading ? "Authenticating..." : "Continue to Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-text-subtle">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-accent hover:underline font-medium">
              Join as Creator
            </Link>
          </div>
        </div>

        {/* Administrator Portal Notice */}
        <div className="rounded-lg border border-border/60 bg-surface-2/40 p-3.5 text-center text-xs font-mono text-text-subtle">
          <span>Are you platform staff? </span>
          <Link href="/admin/login" className="text-accent hover:underline inline-flex items-center gap-1 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
