"use client";

import { HeroProductConsole } from "./HeroProductConsole";
import { Campaign } from "@/types";

export function HeroPreviewStack({ campaigns }: { campaigns: Campaign[] }) {
  return <HeroProductConsole campaigns={campaigns} />;
}

export { HeroProductConsole };
