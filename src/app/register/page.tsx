"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRegistered(true);

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          role: "CREATOR",
          displayName: formData.name.trim(),
          handle: formData.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ""),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error?.message || "Registration failed. Please check your details.");
        setRegistered(false);
        return;
      }

      const user = data?.data?.user;
      const accessToken = data?.data?.accessToken;

      if (typeof window !== "undefined") {
        localStorage.setItem("collabefy_role", "creator");
        localStorage.setItem("collabefy_email", user?.email || formData.email);
        localStorage.setItem("collabefy_token", accessToken);
        localStorage.setItem("collabefy_user", JSON.stringify(user || {}));
        localStorage.removeItem("collabefy_admin_token");
      }

      window.location.href = "/profile";
    } catch {
      setError("Unable to connect to registration server. Please try again.");
      setRegistered(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
            Join Collabefy as a Creator
          </h1>
          <p className="text-xs text-text-muted">
            Monetize your content with verified brand campaigns & transparent weekly payouts
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-danger/40 bg-danger/10 p-3.5 flex items-start gap-2.5 text-xs text-danger">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        <div className="rounded-xl border border-border bg-surface-1 p-6 sm:p-8 space-y-5 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Maya Lin"
                className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Creator Handle / Username
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="mayacodes"
                className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="maya@creator.dev"
                className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 8 characters"
                className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none font-mono"
              />
            </div>

            <div className="text-[11px] text-text-subtle leading-tight pt-1">
              By joining, you agree to our{" "}
              <Link href="/terms" className="text-text hover:text-accent underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-text hover:text-accent underline">
                Privacy Policy
              </Link>
              .
            </div>

            <button
              type="submit"
              disabled={registered}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity disabled:opacity-50 shadow-sm"
            >
              <span>{registered ? "Creating Account..." : "Create Creator Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-text-subtle">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
