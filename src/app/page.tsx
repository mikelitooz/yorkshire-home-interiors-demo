import type { Metadata } from "next";
import { HomeView } from "@/components/sections/HomeView";
import { businessSchema, canonicalFor, jsonLdScript, websiteSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Yorkshire Home Interiors Ltd | Premium Furniture Showroom Sheffield",
  description:
    "Explore sofas, beds, wardrobes, carpets, dining furniture and home styling from a polished demo website for Yorkshire Home Interiors Ltd.",
  alternates: canonicalFor("/")
};

export default function HomePage() {
  return (
    <>
      {/* WebSite plus the business entity. `businessSchema` emits a plain
          Organization (trading name + legal name) and upgrades itself to
          FurnitureStore only once the client confirms the showroom address and
          opening hours. See src/lib/seo.ts and src/config/brand.ts. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteSchema(), businessSchema()) }}
      />
      <HomeView />
    </>
  );
}
