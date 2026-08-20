#!/usr/bin/env node
/**
 * Find correct Wikimedia Commons filenames for missing badges
 * by searching Commons for each team.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BADGES_DIR = join(__dirname, "..", "public", "badges");
const USER_AGENT = "FutebolFlagBot/1.0 (https://github.com/diofeher/futebol-flag; diogenes@gdsfactory.com)";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Search terms for each team (trying various name forms)
const SEARCH_TERMS = {
  corinthians: "Corinthians Paulista logo",
  "sao-paulo": "São Paulo FC logo",
  santos: "Santos FC logo",
  fluminense: "Fluminense FC logo",
  vasco: "Vasco da Gama logo",
  internacional: "Sport Club Internacional logo",
  "atletico-mg": "Atlético Mineiro logo",
  "athletico-pr": "Athletico Paranaense logo",
  coritiba: "Coritiba logo",
  sport: "Sport Recife logo",
  vitoria: "Esporte Clube Vitória logo",
  ceara: "Ceará Sporting Club logo",
  "racing-club": "Racing Club Avellaneda logo",
  independiente: "Club Atlético Independiente logo",
  "velez-sarsfield": "Vélez Sársfield logo",
  estudiantes: "Estudiantes de La Plata logo",
  "newells-old-boys": "Newell's Old Boys logo",
  "rosario-central": "Rosario Central logo",
  talleres: "Talleres Córdoba logo",
  arsenal: "Arsenal FC logo crest",
  "manchester-united": "Manchester United logo crest",
  "manchester-city": "Manchester City logo",
  liverpool: "Liverpool FC logo",
  chelsea: "Chelsea FC logo",
  tottenham: "Tottenham Hotspur logo",
  "aston-villa": "Aston Villa logo",
  newcastle: "Newcastle United logo",
  "west-ham": "West Ham United logo",
  everton: "Everton FC logo",
  "real-madrid": "Real Madrid logo",
  barcelona: "FC Barcelona logo crest",
  "atletico-madrid": "Atlético Madrid logo",
  sevilla: "Sevilla FC logo",
  "real-betis": "Real Betis logo",
  valencia: "Valencia CF logo",
  villarreal: "Villarreal CF logo",
  "real-sociedad": "Real Sociedad logo",
  "athletic-bilbao": "Athletic Club Bilbao logo",
  "celta-vigo": "Celta de Vigo logo",
  "inter-milan": "Inter Milan logo",
  roma: "AS Roma logo",
  lazio: "SS Lazio logo",
  fiorentina: "ACF Fiorentina logo",
  atalanta: "Atalanta BC logo",
  torino: "Torino FC logo",
  bologna: "Bologna FC logo",
  "rb-leipzig": "RB Leipzig logo",
  "bayer-leverkusen": "Bayer 04 Leverkusen logo",
  "eintracht-frankfurt": "Eintracht Frankfurt logo",
  psg: "Paris Saint-Germain logo",
  "olympique-marseille": "Olympique Marseille logo",
  "olympique-lyon": "Olympique Lyonnais logo",
  monaco: "AS Monaco logo",
  lille: "Lille OSC logo",
  nice: "OGC Nice logo",
  lens: "RC Lens logo",
  rennes: "Stade Rennais logo",
  benfica: "SL Benfica logo",
  porto: "FC Porto logo",
  "sporting-cp": "Sporting CP logo",
  braga: "SC Braga logo",
  "vitoria-guimaraes": "Vitória Guimarães logo",
  ajax: "AFC Ajax logo",
  psv: "PSV Eindhoven logo",
  feyenoord: "Feyenoord logo",
  "club-america": "Club América logo",
  chivas: "CD Guadalajara Chivas logo",
  "pumas-unam": "Pumas UNAM logo",
  monterrey: "CF Monterrey logo",
  "tigres-uanl": "Tigres UANL logo",
  millonarios: "Millonarios FC logo",
  "america-de-cali": "América de Cali logo",
  "deportivo-cali": "Deportivo Cali logo",
  "junior-barranquilla": "Junior Barranquilla logo",
  penarol: "Club Atlético Peñarol logo escudo",
  "nacional-uy": "Club Nacional de Football logo",
  "colo-colo": "Colo-Colo logo escudo",
  "universidad-chile": "Universidad de Chile logo",
  "universidad-catolica": "Universidad Católica logo",
  lafc: "Los Angeles FC logo",
  "inter-miami": "Inter Miami CF logo",
  "atlanta-united": "Atlanta United logo",
  "seattle-sounders": "Seattle Sounders FC logo",
};

function getTeamBadgePaths() {
  const teamsFile = readFileSync(join(__dirname, "..", "src", "data", "teams.ts"), "utf8");
  const regex = /id:\s*"([^"]+)".*?leagueId:\s*"([^"]+)"/gs;
  const paths = {};
  let match;
  while ((match = regex.exec(teamsFile)) !== null) {
    paths[match[1]] = join(BADGES_DIR, match[2], `${match[1]}.svg`);
  }
  return paths;
}

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=10&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.query.search || [];
}

async function getFileUrl(fileTitle) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0]?.url || null;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, buffer);
  return buffer.length;
}

function isBadgePlaceholder(filePath) {
  if (!existsSync(filePath)) return true;
  const content = readFileSync(filePath, "utf8");
  // Our placeholders have this pattern
  return content.includes('text-anchor="middle"') && content.includes('font-weight="bold"');
}

async function main() {
  const badgePaths = getTeamBadgePaths();
  const entries = Object.entries(SEARCH_TERMS);
  let success = 0, failed = 0;

  // Filter to only teams that still have placeholder badges
  const missing = entries.filter(([teamId]) => {
    const path = badgePaths[teamId];
    return path && isBadgePlaceholder(path);
  });

  console.log(`Searching Commons for ${missing.length} missing badges...\n`);

  for (const [teamId, query] of missing) {
    const destPath = badgePaths[teamId];

    try {
      const results = await searchCommons(query);
      await sleep(800);

      // Find best SVG match
      const svgResults = results.filter((r) =>
        r.title.toLowerCase().endsWith(".svg") &&
        !r.title.toLowerCase().includes("kit") &&
        !r.title.toLowerCase().includes("jersey") &&
        !r.title.toLowerCase().includes("stadium") &&
        !r.title.toLowerCase().includes("map") &&
        !r.title.toLowerCase().includes("flag_of") &&
        !r.title.toLowerCase().includes("location")
      );

      if (svgResults.length === 0) {
        console.log(`❌ ${teamId}: No SVG found for "${query}"`);
        failed++;
        continue;
      }

      const best = svgResults[0];
      const fileUrl = await getFileUrl(best.title);
      await sleep(500);

      if (fileUrl) {
        const size = await downloadFile(fileUrl, destPath);
        const sizeKb = Math.round(size / 1024);
        console.log(`✅ ${teamId}: ${best.title.replace("File:", "")} (${sizeKb}KB)`);
        success++;
      } else {
        console.log(`❌ ${teamId}: Could not get URL for ${best.title}`);
        failed++;
      }
      await sleep(300);
    } catch (err) {
      console.log(`❌ ${teamId}: ${err.message}`);
      failed++;
      await sleep(1000);
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Done! ✅ ${success} | ❌ ${failed} | Searched: ${missing.length}`);

  // Count total real badges
  let totalReal = 0, totalPlaceholder = 0;
  for (const [, path] of Object.entries(badgePaths)) {
    if (existsSync(path) && !isBadgePlaceholder(path)) totalReal++;
    else totalPlaceholder++;
  }
  console.log(`\nOverall: ${totalReal} real badges | ${totalPlaceholder} placeholders remaining`);
}

main().catch(console.error);
