import React from "react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Discover a campaign",
      desc: "Browse vetted campaigns from fast-growing developer, AI, and consumer tech brands.",
      meta: "No paywalls or hidden listings",
    },
    {
      step: "02",
      title: "Review rules & rate",
      desc: "Check explicit CPM rates, target talking points, accepted platforms, and deadlines upfront.",
      meta: "Transparent terms before you join",
    },
    {
      step: "03",
      title: "Join through Discord",
      desc: "Hop into the dedicated Discord channel to grab official assets, ask questions, and claim your slot.",
      meta: "Direct community coordination",
    },
    {
      step: "04",
      title: "Publish your content",
      desc: "Record authentic clips on TikTok, YouTube Shorts, or Reels using required campaign tags.",
      meta: "Keep 100% creative control",
    },
    {
      step: "05",
      title: "Get paid on performance",
      desc: "The Collabefy team and bot verify organic views, and rewards are distributed weekly.",
      meta: "Automated payouts every Friday",
    },
  ];

  return (
    <section className="py-20 border-b border-border">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            Operating Model
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-text">
            Engineered for clarity. Zero guesswork.
          </h2>
          <p className="mt-2 text-sm text-text-muted leading-relaxed">
            Everything happens in public with documented rules. Discover on the web, coordinate in Discord, get paid for verified view velocity.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((s) => (
            <div
              key={s.step}
              className="flex flex-col justify-between rounded-lg border border-border bg-surface-1 p-5 transition-all hover:border-border-strong"
            >
              <div>
                <span className="font-mono text-xs font-bold text-accent">
                  {s.step}
                </span>
                <h3 className="mt-2 text-base font-semibold text-text">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs text-text-muted leading-relaxed">
                  {s.desc}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-border/60 text-[11px] font-mono text-text-subtle">
                {s.meta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

