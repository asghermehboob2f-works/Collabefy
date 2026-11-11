export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  domain: string;
  accentColor: string;
  supportEmail: string;
  legalEntity: string;
  links: {
    discord: string;
    twitter: string;
    github: string;
    documentation: string;
  };
  stats: {
    cacheSeconds: number;
    showCalculatedOnly: boolean;
  };
  footer: {
    copyright: string;
    statusText: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Collabefy",
  tagline: "Campaigns for creators who ship.",
  description:
    "Collabefy is where creators find paid performance campaigns worth their time. Clear rules, transparent rates, verified views, and weekly payouts.",
  domain: "collabefy.com",
  accentColor: "#C8F560",
  supportEmail: "support@collabefy.com",
  legalEntity: "Collabefy Technologies Inc.",
  links: {
    discord: "https://discord.gg/collabefy",
    twitter: "https://x.com/collabefy",
    github: "https://github.com/collabefy",
    documentation: "https://docs.collabefy.com",
  },
  stats: {
    cacheSeconds: 60,
    showCalculatedOnly: true,
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} Collabefy Technologies Inc. All rights reserved.`,
    statusText: "Operational",
  },
};

