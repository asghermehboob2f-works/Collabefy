"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { ShieldAlert, Lock, Key, ArrowRight, AlertTriangle, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsAuthenticating(true);

    // Simulate verification or check against admin credentials
    setTimeout(() => {
      const validAdminEmails = ["admin@collabefy.com", "security@collabefy.com", "ops@collabefy.com"];
      const isEmailAuthorized = validAdminEmails.includes(email.toLowerCase()) || email.includes("admin");

      if (!isEmailAuthorized) {
        setError("Access Denied: Unrecognized administrator identity. Attempt logged.");
        setIsAuthenticating(false);
        return;
      }

      if (password.length < 8) {
        setError("Invalid security credentials provided.");
        setIsAuthenticating(false);
        return;
      }

      // Check security key (accepts demo key or any non-empty clearance)
      if (securityKey.trim() !== "admin2026" && securityKey.trim() !== "COLLABEFY-ADMIN" && securityKey.trim() !== "admin") {
        setError("Invalid Security Clearance Key. Contact DevSecOps for your daily staff passkey.");
        setIsAuthenticating(false);
        return;
      }

      // Set secure admin session token
      if (typeof window !== "undefined") {
        localStorage.setItem("collabefy_role", "admin");
        localStorage.setItem("collabefy_admin_token", `adm_${Date.now()}_auth_token`);
        localStorage.setItem("collabefy_email", email);
      }

      window.location.href = "/admin";
    }, 700);
  };

  const handleFillDemoAdmin = () => {
    setEmail("admin@collabefy.com");
    setPassword("MasterAdmin@2026!");
    setSecurityKey("admin2026");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Security Vignette */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-danger/5 rounded-full blur-[140px]" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10 border border-danger/30 text-danger shadow-inner">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-border px-3 py-1 text-[11px] font-mono text-danger font-semibold uppercase tracking-wider">
            <span>Restricted Workspace</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Administrative Portal
          </h1>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            Authorized operations personnel only. Unauthorized access attempts are monitored and recorded.
          </p>
        </div>

        {/* Security Alert Badge */}
        <div className="rounded-lg border border-border bg-surface-2/60 p-3.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-text-subtle">
            <Lock className="w-3.5 h-3.5 text-accent" />
            <span>Staff Security Clearance Required</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="text-[11px] font-mono text-accent hover:underline font-semibold"
          >
            Fill Demo Passkey
          </button>
        </div>

        {/* Auth Form Card */}
        <div className="rounded-xl border border-border bg-surface-1 p-6 sm:p-8 space-y-5 shadow-2xl">
          {error && (
            <div className="rounded-md border border-danger/40 bg-danger/10 p-3.5 flex items-start gap-2.5 text-xs text-danger">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                Staff Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@collabefy.com"
                className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-danger focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                Master Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-danger focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                Security Clearance Key (Daily Passkey)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  placeholder="admin2026"
                  className="w-full rounded-md border border-border bg-surface-2 py-2.5 pl-9 pr-3.5 text-sm text-text placeholder:text-text-subtle focus:border-danger focus:outline-none font-mono"
                />
              </div>
              <span className="text-[10px] font-mono text-text-subtle mt-1 block">
                Clearance: <code className="text-accent">admin2026</code>
              </span>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
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
      </div>
    </div>
  );
}
