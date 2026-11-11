"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-accent text-accent-ink font-mono font-bold text-base">
              C
            </div>
            <span className="font-semibold text-lg text-text">{siteConfig.name}</span>
          </Link>
          <h1 className="text-xl font-semibold tracking-tight text-text">
            Reset your password
          </h1>
          <p className="text-xs text-text-muted">
            Enter your email and we'll send a secure password reset link
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
          {sent ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-accent mx-auto" />
              <h3 className="text-sm font-semibold text-text">Reset Link Sent</h3>
              <p className="text-xs text-text-muted">
                If an account exists for {email}, a password reset link has been dispatched.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-mono pt-2"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to sign in</span>
              </Link>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4"
            >
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

              <button
                type="submit"
                className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity"
              >
                Send Reset Link
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text font-mono"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to sign in</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

