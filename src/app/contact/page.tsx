"use client";

import React, { useState } from "react";
import { siteConfig } from "@/site.config";
import { CheckCircle2, Send, Mail, MessageSquare, ShieldCheck, HelpCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [inquiryType, setInquiryType] = useState<"creator_support" | "brand_campaign">("creator_support");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "payout_inquiry",
    budget: "$10,000 - $25,000",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          inquiryType,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to submit support ticket.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to submit your inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 md:py-24">
      <div className="container-fluid">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading & Quick Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
              Support & Inquiries
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-text">
              We're here to help you ship.
            </h1>
            <p className="text-base text-text-muted leading-relaxed">
              Have questions regarding a campaign, payout settlement, video view audit, or interested in sponsoring a
              creator sprint for your software product?
            </p>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-start gap-3 text-sm">
                <div className="rounded-md bg-surface-2 p-2 border border-border text-accent shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-text">Email Support Desk</div>
                  <div className="text-text-muted text-xs">{siteConfig.supportEmail}</div>
                  <div className="text-[11px] font-mono text-text-subtle mt-0.5">Average response under 4 hours</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <div className="rounded-md bg-surface-2 p-2 border border-border text-accent shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-text">Discord Community Channels</div>
                  <div className="text-text-muted text-xs">Direct support in #creator-support & #disputes</div>
                  <div className="text-[11px] font-mono text-text-subtle mt-0.5">Live moderation around the clock</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <div className="rounded-md bg-surface-2 p-2 border border-border text-accent shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-text">Escrow & Verification Security</div>
                  <div className="text-text-muted text-xs">Audited view settlements and guaranteed reward disbursement</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-border bg-surface-1 p-6 sm:p-8 shadow-xl">
              {/* Type Switcher Tabs */}
              <div className="flex rounded-md bg-surface-2 p-1 border border-border mb-8">
                <button
                  type="button"
                  onClick={() => setInquiryType("creator_support")}
                  className={`flex-1 rounded-sm py-2 text-xs font-semibold transition-all ${
                    inquiryType === "creator_support"
                      ? "bg-surface-3 text-accent shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  Creator Support & Disputes
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType("brand_campaign")}
                  className={`flex-1 rounded-sm py-2 text-xs font-semibold transition-all ${
                    inquiryType === "brand_campaign"
                      ? "bg-surface-3 text-accent shadow-sm"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  Brand Campaign Sponsorship
                </button>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-text">Request Submitted</h3>
                  <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. A ticket has been logged and a member of the {siteConfig.name} team will
                    respond to <span className="text-text font-mono">{formData.email || "your email"}</span> promptly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        category: "payout_inquiry",
                        budget: "$10,000 - $25,000",
                        message: "",
                      });
                    }}
                    className="mt-4 rounded-md border border-border bg-surface-2 px-5 py-2 text-xs font-semibold text-text hover:bg-surface-3"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alex Rivers"
                        className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@creator.dev"
                        className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  {inquiryType === "creator_support" ? (
                    <div>
                      <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                        Inquiry Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
                      >
                        <option value="payout_inquiry">Creator Payout / Bank Settlement</option>
                        <option value="view_verification">48-Hour View Verification Question</option>
                        <option value="submission_dispute">Submission Review Dispute</option>
                        <option value="account_verification">Creator Profile Verification</option>
                        <option value="other">General Question</option>
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                          Brand / Product Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="e.g. Cursor, Linear, Supabase"
                          className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                          Sprint Budget
                        </label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
                        >
                          <option>$5,000 - $10,000</option>
                          <option>$10,000 - $25,000</option>
                          <option>$25,000 - $50,000</option>
                          <option>$50,000+</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                      Message / Details
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={
                        inquiryType === "creator_support"
                          ? "Please provide the campaign name and submission link if applicable..."
                          : "Tell us about your product launch target audience, preferred platforms, and goals..."
                      }
                      className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Submitting Request..." : "Send Request"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
