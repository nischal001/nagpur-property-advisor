// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://nagpurpropertyadvisor.com";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://wzgkszbcthviiwaqzmiv.supabase.co";
const SUPABASE_ANON = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z2tzemJjdGh2aWl3YXF6bWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MDE3NjUsImV4cCI6MjA5MTQ3Nzc2NX0.dEvRSwWhK8WWPm6mvhiIGmgyiN2xVHfvfwH9Cd1QRsE";

interface Entry { path: string; lastmod?: string; changefreq?: string; priority?: string; }

const staticEntries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/properties", changefreq: "daily", priority: "0.9" },
  { path: "/seller", changefreq: "monthly", priority: "0.7" },
];

async function fetchProperties(): Promise<Entry[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?select=id,updated_at&status=eq.approved&visible=is.true`,
      { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } }
    );
    if (!res.ok) return [];
    const rows = await res.json();
    return rows.map((r: any) => ({
      path: `/property/${r.id}`,
      lastmod: r.updated_at ? new Date(r.updated_at).toISOString().split("T")[0] : undefined,
      changefreq: "weekly",
      priority: "0.8",
    }));
  } catch {
    return [];
  }
}

function render(entries: Entry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ].filter(Boolean).join("\n")
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

(async () => {
  const dynamic = await fetchProperties();
  const all = [...staticEntries, ...dynamic];
  writeFileSync(resolve("public/sitemap.xml"), render(all));
  console.log(`sitemap.xml written (${all.length} entries)`);
})();
