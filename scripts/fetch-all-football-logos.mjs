#!/usr/bin/env node
/**
 * Download ALL team badges from football-logos.cc across all countries.
 * Saves PNGs to public/badges/_football-logos/{country}/{slug}.png
 * Outputs a JSON manifest of all clubs for importing into teams.ts
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", "public", "badges");
const MANIFEST_PATH = join(__dirname, "football-logos-manifest.json");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const COUNTRIES = [
  "argentina", "austria", "belgium", "bulgaria", "colombia", "cyprus",
  "czech-republic", "denmark", "egypt", "england", "finland", "france",
  "germany", "greece", "hungary", "india", "indonesia", "iraq", "israel",
  "italy", "japan", "mexico", "netherlands", "norway", "poland", "portugal",
  "republic-of-ireland", "romania", "russia", "saudi-arabia", "scotland",
  "south-korea", "spain", "sweden", "switzerland", "turkey", "ukraine",
  "usa", "wales"
];

// Map football-logos.cc country to our league IDs (for existing leagues)
const COUNTRY_TO_LEAGUE = {
  "argentina": "liga-profesional",
  "england": "premier-league",
  "spain": "la-liga",
  "italy": "serie-a-it",
  "germany": "bundesliga",
  "france": "ligue-1",
  "portugal": "liga-portugal",
  "netherlands": "eredivisie",
  "mexico": "liga-mx",
  "usa": "mls",
  "colombia": "liga-betplay",
};

async function scrapeCountryPage(country) {
  const res = await fetch(`https://football-logos.cc/${country}/`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) return [];

  const html = await res.text();

  // Extract club names from alt tags or links
  const clubs = [];
  const pngRegex = new RegExp(
    `logos/${country}/1500x1500/([^.]+)\\.([a-f0-9]+)\\.png`,
    "g"
  );
  const nameRegex = new RegExp(
    `/${country}/([^/"]+)/"[^>]*>\\s*(?:<[^>]+>)*\\s*([^<]+)`,
    "g"
  );

  // Get slugs + hashes from image URLs
  const slugHashes = {};
  let m;
  while ((m = pngRegex.exec(html)) !== null) {
    slugHashes[m[1]] = m[2];
  }

  // Get slug -> name mappings from links
  const slugNames = {};
  // Try alt tags first
  const altRegex = new RegExp(
    `/${country}/([^/"]+)/[^>]*?(?:alt|title)="([^"]+)"`,
    "gi"
  );
  while ((m = altRegex.exec(html)) !== null) {
    if (!slugNames[m[1]]) slugNames[m[1]] = m[2].replace(/ logo$/i, "").trim();
  }

  // Build club list
  for (const [slug, hash] of Object.entries(slugHashes)) {
    // Skip size variants that got matched
    if (["64x64", "128x128", "256x256", "512x512", "700x700", "1500x1500", "3000x3000"].includes(slug)) continue;

    const name = slugNames[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    clubs.push({ slug, hash, name, country });
  }

  return clubs;
}

async function downloadBadge(country, slug, hash, destPath) {
  const url = `https://assets.football-logos.cc/logos/${country}/1500x1500/${slug}.${hash}.png`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, "Referer": `https://football-logos.cc/${country}/` },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 100) throw new Error("Too small");
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, buffer);
  return buffer.length;
}

async function main() {
  const allClubs = [];
  let totalDownloaded = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  // Also read existing teams to know which we already have
  const teamsFile = readFileSync(join(__dirname, "..", "src", "data", "teams.ts"), "utf8");
  const existingIds = new Set();
  const idRegex = /id:\s*"([^"]+)"/g;
  let em;
  while ((em = idRegex.exec(teamsFile)) !== null) existingIds.add(em[1]);

  for (const country of COUNTRIES) {
    process.stdout.write(`🌍 ${country}...`);

    try {
      const clubs = await scrapeCountryPage(country);
      process.stdout.write(` ${clubs.length} clubs\n`);

      for (const club of clubs) {
        const leagueId = COUNTRY_TO_LEAGUE[country] || country;
        const destDir = join(OUTPUT_DIR, leagueId);
        const destPath = join(destDir, `${club.slug}.png`);

        club.leagueId = leagueId;
        club.isNew = !existingIds.has(club.slug);
        allClubs.push(club);

        // Skip if already downloaded
        if (existsSync(destPath)) {
          totalSkipped++;
          continue;
        }

        try {
          const size = await downloadBadge(country, club.slug, club.hash, destPath);
          totalDownloaded++;
          if (totalDownloaded % 50 === 0) {
            console.log(`  📥 ${totalDownloaded} downloaded so far...`);
          }
        } catch (err) {
          totalFailed++;
        }

        // Rate limiting
        await sleep(150);
      }
    } catch (err) {
      console.log(` ❌ ${err.message}`);
    }

    await sleep(500);
  }

  // Save manifest
  writeFileSync(MANIFEST_PATH, JSON.stringify(allClubs, null, 2));

  const existingCount = allClubs.filter(c => !c.isNew).length;
  const newCount = allClubs.filter(c => c.isNew).length;

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Total clubs scraped: ${allClubs.length}`);
  console.log(`Downloaded: ${totalDownloaded} | Skipped (exists): ${totalSkipped} | Failed: ${totalFailed}`);
  console.log(`Existing teams matched: ${existingCount} | New teams: ${newCount}`);
  console.log(`\nManifest saved to: ${MANIFEST_PATH}`);
}

main().catch(console.error);
