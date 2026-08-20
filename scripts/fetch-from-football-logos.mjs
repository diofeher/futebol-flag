#!/usr/bin/env node
/**
 * Download all Brazilian team badges from football-logos.cc
 * Strategy:
 * 1. Scrape the Brazil listing page for all club slugs + PNG hashes
 * 2. For each club, fetch the detail page to get SVG hash
 * 3. Download SVG if available, fallback to 1500x1500 PNG
 * 4. Map football-logos.cc slugs to our team IDs
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BADGES_DIR = join(__dirname, "..", "public", "badges");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";
const REFERER = "https://football-logos.cc/brazil/";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Map football-logos.cc slug → our team ID
const SLUG_TO_TEAM = {
  // Série A
  "flamengo": "flamengo",
  "palmeiras": "palmeiras",
  "corinthians": "corinthians",
  "sao-paulo": "sao-paulo",
  "santos": "santos",
  "fluminense": "fluminense",
  "vasco-da-gama": "vasco",
  "botafogo": "botafogo",
  "gremio": "gremio",
  "internacional": "internacional",
  "atletico-mineiro": "atletico-mg",
  "cruzeiro": "cruzeiro",
  "bahia": "bahia",
  "fortaleza": "fortaleza",
  "athletico-paranaense": "athletico-pr",
  "coritiba": "coritiba",
  "sport-recife": "sport",
  "vitoria": "vitoria",
  "ceara": "ceara",
  "goias": "goias",
  "juventude": "juventude",
  "mirassol": "mirassol",
  "rb-bragantino": "rb-bragantino",

  // Série B
  "amazonas": "amazonas",
  "america-mineiro": "america-mg",
  "athletic": "athletic-mg",
  "atletico-goianiense": "atletico-go",
  "avai": "avai",
  "botafogo-sp": "botafogo-sp",
  "chapecoense": "chapecoense",
  "crb": "crb",
  "criciuma": "criciuma",
  "cuiaba": "cuiaba",
  "ferroviaria": "ferroviaria",
  "novorizontino": "novorizontino",
  "operario-ferroviario": "operario-pr",
  "paysandu": "paysandu",
  "clube-do-remo": "remo",
  "ponte-preta": "ponte-preta",
  "nautico": "nautico",
  "vila-nova": "vila-nova",
  "volta-redonda": "volta-redonda",
  "londrina": "londrina",
  "sao-bernardo": "sao-bernardo",

  // Série C
  "abc": "abc",
  "anapolis": "anapolis",
  "botafogo-pb": "botafogo-pb",
  "brusque": "brusque",
  "caxias": "caxias-rs",
  "confianca": "confianca",
  "csa": "csa",
  "figueirense": "figueirense",
  "floresta": "floresta",
  "guarani": "guarani",
  "itabaiana": "itabaiana",
  "ituano": "ituano",
  "maringa": "maringa",
  "tombense": "tombense",
  "ypiranga": "ypiranga-rs",
  "santa-cruz": "santa-cruz",
  "maranhao": "maranhao-ac",
  "inter-de-limeira": "inter-limeira",

  // Série D
  "tuna-luso": "tuna-luso",
  "manauara": "manauara",
  "manaus": "manaus-fc",
  "independencia-ac": "independencia-ac",
  "aguia-de-maraba": "aguia-maraba",
  "trem": "trem",
  "gremio-atletico-sampaio": "gas",
  "humaita-ac": "humaita-ac",
  "altos": "altos",
  "imperatriz": "imperatriz",
  "sampaio-correa": "sampaio-correa",
  "iguatu": "iguatu",
  "tocantinopolis": "tocantinopolis",
  "parnahyba": "parnahyba",
  "maracana": "maracana-ce",
  "america-rn": "america-natal",
  "central-pe": "central",
  "ferroviario-ce": "ferroviario-ce",
  "treze": "treze",
  "sousa": "sousa",
  "serra-branca": "serra-branca",
  "asa": "asa",
  "lagarto": "lagarto",
  "sergipe": "sergipe",
  "juazeirense": "juazeirense",
  "araguaina": "uniao-araguaina",
  "retro": "retro",
  "aparecidense": "aparecidense",
  "ceilandia": "ceilandia",
  "luverdense": "luverdense",
  "mixto": "mixto",
  "capital-cf": "capital-df",
  "porto-velho": "porto-velho",
  "portuguesa": "portuguesa-sp",
  "agua-santa": "agua-santa",
  "nova-iguacu": "nova-iguacu",
  "cianorte": "cianorte",
  "fc-cascavel": "fc-cascavel",
  "azuriz": "azuriz",
  "guarany-de-bage": "guarany-bage",
  "brasil-de-pelotas": "brasil-pelotas",
  "sao-luiz": "sao-luiz-rs",
  "sao-jose-rs": "sao-jose-rs",
  "marcilio-dias": "marcilio-dias",
  "joinville": "joinville",
  "uberlandia": "uberlandia",
  "operario-ms": "operario-ms",
  "marica": "marica",
  "barra": "barra-sc",
  "pouso-alegre": "pouso-alegre",

  // Paraibano
  "campinense": "campinense",

  // Also try these international teams if they have pages
};

function getTeamBadgePaths() {
  const teamsFile = readFileSync(join(__dirname, "..", "src", "data", "teams.ts"), "utf8");
  const regex = /id:\s*"([^"]+)".*?leagueId:\s*"([^"]+)"/gs;
  const paths = {};
  let match;
  while ((match = regex.exec(teamsFile)) !== null) {
    paths[match[1]] = { league: match[2], svgPath: join(BADGES_DIR, match[2], `${match[1]}.svg`), pngPath: join(BADGES_DIR, match[2], `${match[1]}.png`) };
  }
  return paths;
}

function isBadgePlaceholder(filePath) {
  if (!existsSync(filePath)) return true;
  const content = readFileSync(filePath, "utf8");
  return content.includes('text-anchor="middle"') && content.includes('font-weight="bold"');
}

async function scrapeListingPage() {
  console.log("📡 Fetching Brazil listing page...\n");
  const res = await fetch("https://football-logos.cc/brazil/", {
    headers: { "User-Agent": UA }
  });
  const html = await res.text();

  // Extract all 1500x1500 PNG URLs with hashes
  const pngRegex = /logos\/brazil\/1500x1500\/([^.]+)\.([a-f0-9]+)\.png/g;
  const clubs = {};
  let match;
  while ((match = pngRegex.exec(html)) !== null) {
    clubs[match[1]] = { slug: match[1], pngHash: match[2] };
  }
  console.log(`  Found ${Object.keys(clubs).length} clubs with PNG hashes\n`);
  return clubs;
}

async function getSvgHash(slug) {
  const url = `https://football-logos.cc/brazil/${slug}/`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const html = await res.text();
  const match = html.match(/data-svg-hash="([a-f0-9]+)"/);
  return match ? match[1] : null;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, "Referer": REFERER },
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
  const clubs = await scrapeListingPage();

  // Build download list: only teams that still have placeholder badges
  const downloads = [];
  for (const [slug, club] of Object.entries(clubs)) {
    const teamId = SLUG_TO_TEAM[slug];
    if (!teamId) continue;
    const paths = teamPaths[teamId];
    if (!paths) continue;
    // Only download if current SVG badge is a placeholder
    if (!isBadgePlaceholder(paths.svgPath)) continue;
    downloads.push({ slug, teamId, club, paths });
  }

  console.log(`📥 Downloading badges for ${downloads.length} teams...\n`);

  let svgSuccess = 0, pngSuccess = 0, failed = 0;
  const failures = [];

  for (const { slug, teamId, club, paths } of downloads) {
    try {
      // Try SVG first — fetch the detail page for SVG hash
      const svgHash = await getSvgHash(slug);
      await sleep(400);

      if (svgHash) {
        const svgUrl = `https://images.football-logos.cc/${slug}.${svgHash}.svg`;
        try {
          const size = await downloadFile(svgUrl, paths.svgPath);
          // Verify it's actually SVG
          const content = readFileSync(paths.svgPath, "utf8").slice(0, 200);
          if (content.includes("<svg") || content.includes("<?xml")) {
            console.log(`✅ ${teamId}: SVG (${Math.round(size/1024)}KB)`);
            svgSuccess++;
            await sleep(300);
            continue;
          }
        } catch (err) {
          // SVG failed, try PNG
        }
      }

      // Fallback: download PNG
      const pngUrl = `https://assets.football-logos.cc/logos/brazil/1500x1500/${slug}.${club.pngHash}.png`;
      const size = await downloadFile(pngUrl, paths.pngPath);
      console.log(`✅ ${teamId}: PNG (${Math.round(size/1024)}KB)`);
      pngSuccess++;
    } catch (err) {
      console.log(`❌ ${teamId} (${slug}): ${err.message}`);
      failures.push(teamId);
      failed++;
    }

    await sleep(300);
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Done! SVG: ${svgSuccess} | PNG: ${pngSuccess} | Failed: ${failed}`);
  if (failures.length > 0) {
    console.log(`Failed: ${failures.join(", ")}`);
  }

  // List teams that got PNG (need badgeUrl update in teams.ts)
  const pngTeams = downloads.filter(d => {
    return existsSync(d.paths.pngPath) && !existsSync(d.paths.svgPath.replace(/placeholder/, ''));
  });

  // Count overall
  let realSvg = 0, realPng = 0, placeholder = 0;
  for (const [id, p] of Object.entries(teamPaths)) {
    if (existsSync(p.svgPath) && !isBadgePlaceholder(p.svgPath)) realSvg++;
    else if (existsSync(p.pngPath)) realPng++;
    else placeholder++;
  }
  console.log(`\nOverall: ${realSvg} SVG + ${realPng} PNG real badges | ${placeholder} placeholders remaining`);
}

main().catch(console.error);
