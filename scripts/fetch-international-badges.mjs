#!/usr/bin/env node
/**
 * Download international team badges from football-logos.cc
 * for teams that still have placeholder badges.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BADGES_DIR = join(__dirname, "..", "public", "badges");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Country page on football-logos.cc → our teams mapping
const COUNTRY_PAGES = {
  "england": {
    "tottenham": "tottenham-hotspur",
    "aston-villa": "aston-villa",
  },
  "spain": {
    "atletico-madrid": "atletico-madrid",
    "sevilla": "sevilla",
    "valencia": "valencia",
    "villarreal": "villarreal",
    "real-sociedad": "real-sociedad",
  },
  "italy": {
    "atalanta": "atalanta",
    "torino": "torino",
  },
  "france": {
    "olympique-lyon": "olympique-lyonnais",
    "lille": "losc-lille",
    "lens": "lens",
  },
  "portugal": {
    "porto": "fc-porto",
    "vitoria-guimaraes": "vitoria-de-guimaraes",
  },
  "netherlands": {
    "psv": "psv",
  },
  "mexico": {
    "chivas": "chivas",
  },
};

function getTeamBadgePaths() {
  const teamsFile = readFileSync(join(__dirname, "..", "src", "data", "teams.ts"), "utf8");
  const regex = /id:\s*"([^"]+)".*?leagueId:\s*"([^"]+)"/gs;
  const paths = {};
  let match;
  while ((match = regex.exec(teamsFile)) !== null) {
    paths[match[1]] = {
      league: match[2],
      svgPath: join(BADGES_DIR, match[2], `${match[1]}.svg`),
      pngPath: join(BADGES_DIR, match[2], `${match[1]}.png`),
    };
  }
  return paths;
}

function isBadgePlaceholder(filePath) {
  if (!existsSync(filePath)) return true;
  const content = readFileSync(filePath, "utf8");
  return content.includes('text-anchor="middle"') && content.includes('font-weight="bold"');
}

async function scrapePage(country) {
  const res = await fetch(`https://football-logos.cc/${country}/`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) return {};
  const html = await res.text();

  const pngRegex = new RegExp(`logos/${country}/1500x1500/([^.]+)\\.([a-f0-9]+)\\.png`, "g");
  const clubs = {};
  let match;
  while ((match = pngRegex.exec(html)) !== null) {
    clubs[match[1]] = match[2];
  }
  return clubs;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      "Referer": "https://football-logos.cc/",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 100) throw new Error("File too small");
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, buffer);
  return buffer.length;
}

async function main() {
  const teamPaths = getTeamBadgePaths();
  let success = 0, failed = 0;

  for (const [country, teams] of Object.entries(COUNTRY_PAGES)) {
    console.log(`\n🌍 Scraping ${country}...`);
    const clubs = await scrapePage(country);
    console.log(`  Found ${Object.keys(clubs).length} clubs`);
    await sleep(500);

    for (const [ourId, siteSlug] of Object.entries(teams)) {
      const paths = teamPaths[ourId];
      if (!paths) { console.log(`  ⚠️  ${ourId}: Not in teams.ts`); continue; }
      if (!isBadgePlaceholder(paths.svgPath)) { console.log(`  ⏭️  ${ourId}: Already has real SVG`); continue; }
      if (existsSync(paths.pngPath)) { console.log(`  ⏭️  ${ourId}: Already has PNG`); continue; }

      const hash = clubs[siteSlug];
      if (!hash) {
        console.log(`  ❌ ${ourId}: Slug "${siteSlug}" not found on ${country} page`);
        failed++;
        continue;
      }

      try {
        const url = `https://assets.football-logos.cc/logos/${country}/1500x1500/${siteSlug}.${hash}.png`;
        const size = await downloadFile(url, paths.pngPath);
        console.log(`  ✅ ${ourId}: PNG (${Math.round(size / 1024)}KB)`);
        success++;
      } catch (err) {
        console.log(`  ❌ ${ourId}: ${err.message}`);
        failed++;
      }
      await sleep(400);
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Done! ✅ ${success} | ❌ ${failed}`);
}

main().catch(console.error);
