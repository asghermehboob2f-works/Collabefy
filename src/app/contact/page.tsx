"use client";

import React, { useState } from "react";
import { siteConfig } from "@/site.config";
import { CheckCircle2, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    type: "brand",
    budget: "$10,000 - $25,000",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            Inquiries
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-text">
            Launch a Campaign with {siteConfig.name}
          </h1>
          <p className="mt-4 text-base text-text-muted leading-relaxed">
            Interested in launching a performance-driven creator sprint for your software or developer product? Let us know your goals and our team will get back to you within 24 hours.
          </p>
        </div>

        <div className="mt-12 max-w-xl rounded-lg border border-border bg-surface-1 p-6 sm:p-8">
          {submitted ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-accent mx-auto" />
              <h3 className="text-lg font-semibold text-text">Inquiry Received</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                Thank you for reaching out. A member of the {siteConfig.name} partnerships team will contact you shortly via email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Henderson"
                  className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-border-strong focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@company.com"
                  className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-border-strong focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Linear, Supabase, Cursor"
                  className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-border-strong focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                  Expected Campaign Budget
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text focus:outline-none"
                >
                  <option>$5,000 - $10,000</option>
                  <option>$10,000 - $25,000</option>
                  <option>$25,000 - $50,000</option>
                  <option>$50,000+</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1.5">
                  Campaign Goals & Notes
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Briefly describe what you are launching and your target audience..."
                  className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-border-strong focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity"
              >
                <Send className="w-4 h-4" />
                <span>Submit Brand Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

