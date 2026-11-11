"use client";

import React, { useState } from "react";
import { siteConfig } from "@/site.config";
import { ChevronDown } from "lucide-react";

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does payment work?",
      a: "Campaign reward pools are pre-funded into escrow by the sponsoring brand. Once you post content meeting the campaign rules, views are audited over 48 hours for organic authenticity. Verified earnings are paid out weekly every Friday via Stripe Connect or USDC.",
    },
    {
      q: "Do I need to sign up to join a campaign?",
      a: "You can browse all campaigns, rules, and rates openly on Collabefy without an account. To participate, follow the Discord link on the campaign page to join the dedicated channel, review assets, and submit your content.",
    },
    {
      q: "How are views verified and audited?",
      a: "Collabefy's verification service integrates with platform APIs and automated audits to evaluate view duration, geographic distribution, and engagement authenticity. Views from bot rings, click farms, or non-organic promotional spikes are filtered out.",
    },
    {
      q: "Can I participate from anywhere in the world?",
      a: "Most campaigns are open globally as long as you meet the language and audience requirements in the brief. Specific geographic restrictions (e.g. US/EU only) are always displayed explicitly in the campaign's Rules section.",
    },
    {
      q: "What happens when a campaign's budget is exhausted?",
      a: "When a campaign reaches its total allocated pool, the status automatically shifts to 'Budget Claimed' and no new submissions are accepted for payout. Any previously approved and verified clips within the pool limit are guaranteed full payment.",
    },
    {
      q: "How do brands create campaigns on Collabefy?",
      a: "Brands can get in touch through our Brand Inquiries page or reach out directly in Discord. Our operations team works with you to establish target talking points, configure escrow, and launch your campaign sprint to top creators.",
    },
  ];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            Knowledge Base
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-text">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-base text-text-muted leading-relaxed">
            Everything you need to know about joining campaigns, tracking performance, and receiving verified payouts on {siteConfig.name}.
          </p>
        </div>

        <div className="mt-12 max-w-3xl divide-y divide-border border-y border-border">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="py-5">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between text-left text-base font-semibold text-text hover:text-accent transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-text-muted transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm text-text-muted leading-relaxed pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

