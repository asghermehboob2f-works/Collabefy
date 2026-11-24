"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, AlertTriangle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { siteConfig } from "@/site.config";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center"><span className="text-xs font-mono text-text-subtle animate-pulse">Loading secure portal...</span></div>}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (attempts >= 5) {
      setError("Too many failed attempts. Please wait before trying again.");
      return;
    }

    setIsAuthenticating(true);

    try {
      // POST to the secure admin API route — checks against backend DB and environment credentials
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.ok) {
        const authData = await res.json().catch(() => ({}));
        if (typeof window !== "undefined") {
          localStorage.setItem("collabefy_role", authData.user?.role?.toLowerCase() || "admin");
          localStorage.setItem("collabefy_admin_token", authData.token || `adm_${Date.now()}`);
          localStorage.setItem("collabefy_email", authData.user?.email || email);
          localStorage.setItem("collabefy_user", JSON.stringify(authData.user || {}));
        }
        // Strict admin redirect: always open the genuine /admin dashboard
        const target = redirectTo && redirectTo.startsWith("/admin") && redirectTo !== "/admin/login" ? redirectTo : "/admin";
        window.location.href = target;
      } else {
        const data = await res.json().catch(() => ({}));
        setAttempts((prev) => prev + 1);
        if (res.status === 429) {
          setError("Too many login attempts. Please wait 15 minutes before trying again.");
        } else {
          setError(data.error || "Invalid credentials. Access denied.");
        }
      }
    } catch {
      setError("Authentication service unavailable. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Vignette */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/5 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[300px] bg-accent/3 rounded-full blur-[120px]" />

      {/* Decorative grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#666 1px, transparent 1px), linear-gradient(90deg, #666 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <img
              src="/media/logo.png"
              alt={siteConfig.name}
              className="h-8 w-8 rounded-md object-contain"
            />
            <span className="font-semibold text-lg text-text">{siteConfig.name}</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Administrative Portal
          </h1>
          <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
            Authorized platform personnel only. Sign in with your administrator credentials.
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="rounded-xl border border-border bg-surface-1 p-6 sm:p-8 space-y-5 shadow-2xl">
          {error && (
            <div className="rounded-md border border-danger/40 bg-danger/10 p-3.5 flex items-start gap-2.5 text-xs text-danger">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {attempts >= 3 && attempts < 5 && (
            <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-500 font-mono">
              ⚠ Warning: {5 - attempts} attempt{5 - attempts !== 1 ? "s" : ""} remaining before lockout.
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4">
            {/* Admin ID / Email */}
            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                Administrator ID / Email
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@collabefy.com"
                className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-danger focus:outline-none font-mono"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 pr-10 text-sm text-text placeholder:text-text-subtle focus:border-danger focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating || attempts >= 5}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity disabled:opacity-50 shadow-md"
            >
              <span>{isAuthenticating ? "Verifying Credentials..." : "Sign In to Admin Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-text-subtle hover:text-text transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Marketplace</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
