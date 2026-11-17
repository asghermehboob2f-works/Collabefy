"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldAlert, Lock, Key, ArrowRight, AlertTriangle, ArrowLeft, Eye, EyeOff } from "lucide-react";

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
  const [securityKey, setSecurityKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Block after 5 client-side attempts
    if (attempts >= 5) {
      setError("Too many failed attempts. Please wait before trying again.");
      return;
    }

    setIsAuthenticating(true);

    try {
      // POST to the secure backend API route — credentials checked server-side
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, securityKey }),
      });

      if (res.ok) {
        const authData = await res.json().catch(() => ({}));
        // Store session token and role
        if (typeof window !== "undefined") {
          localStorage.setItem("collabefy_role", authData.user?.role?.toLowerCase() || "admin");
          localStorage.setItem("collabefy_admin_token", authData.token || `adm_${Date.now()}`);
          localStorage.setItem("collabefy_email", authData.user?.email || email);
        }
        window.location.href = redirectTo;
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
      {/* Background Security Vignette */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-danger/5 rounded-full blur-[140px]" />
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
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 border border-danger/30 text-danger shadow-inner">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-border px-3 py-1 text-[11px] font-mono text-danger font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
            <span>Restricted Access</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Administrative Portal
          </h1>
          <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
            Authorized operations personnel only. All login attempts are monitored and recorded.
          </p>
        </div>

        {/* Security Info Bar */}
        <div className="rounded-lg border border-border bg-surface-2/60 px-4 py-3 flex items-center gap-3 text-xs font-mono">
          <Lock className="w-3.5 h-3.5 text-accent shrink-0" />
          <span className="text-text-subtle">Staff Security Clearance Required • 3-Factor Auth</span>
          <span className="ml-auto text-[10px] text-text-subtle bg-surface-3 px-1.5 py-0.5 rounded border border-border">
            TLS 1.3
          </span>
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
            {/* Email */}
            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                Staff Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@collabefy.com"
                className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-danger focus:outline-none font-mono"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                Master Password
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

            {/* Security Key */}
            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                Security Clearance Key
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showKey ? "text" : "password"}
                  required
                  autoComplete="off"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  placeholder="Enter your daily passkey"
                  className="w-full rounded-md border border-border bg-surface-2 py-2.5 pl-9 pr-10 text-sm text-text placeholder:text-text-subtle focus:border-danger focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text"
                  tabIndex={-1}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] font-mono text-text-subtle mt-1.5">
                Contact DevSecOps for your current daily staff passkey.
              </p>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating || attempts >= 5}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity disabled:opacity-50 shadow-md"
            >
              <span>{isAuthenticating ? "Verifying Credentials..." : "Authenticate & Enter Workspace"}</span>
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

        <p className="text-center text-[10px] font-mono text-text-subtle">
          Unauthorized access is a violation of platform policy and may be prosecuted.
        </p>
      </div>
    </div>
  );
}
