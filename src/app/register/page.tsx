"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [registered, setRegistered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistered(true);
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
            Create creator account
          </h1>
          <p className="text-xs text-text-muted">
            Track performance, save campaigns, and build your portfolio
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
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
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Handle / Username
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="mayacodes"
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-border-strong focus:outline-none"
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
                placeholder="maya@example.com"
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 8 characters"
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-border-strong focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity"
            >
              <span>{registered ? "Creating Account..." : "Join Collabefy"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-text-subtle">
            Already have an account?{" "}
            <Link href="/login" className="text-text hover:text-accent font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

