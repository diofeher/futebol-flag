#!/usr/bin/env node
/**
 * Fetch badges via Portuguese Wikipedia page images API.
 * Many Brazilian clubs have logos as their main article image on pt.wikipedia.org.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BADGES_DIR = join(__dirname, "..", "public", "badges");
const USER_AGENT = "FutebolQuizBot/1.0 (https://github.com/diofeher/futebol-flag; diogenes@gdsfactory.com)";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Map team ID -> Portuguese Wikipedia article title
const WIKI_TITLES = {
  // Série A
  "sport": "Sport_Club_do_Recife",
  "rb-bragantino": "Red_Bull_Bragantino",

  // Série B
  "amazonas": "Amazonas_Futebol_Clube",
  "ferroviaria": "Associação_Ferroviária_de_Esportes",
  "paysandu": "Paysandu_Sport_Club",

  // Série C
  "anapolis": "Anápolis_Futebol_Clube",
  "csa": "Centro_Sportivo_Alagoano",
  "floresta": "Floresta_Esporte_Clube",
  "londrina": "Londrina_Esporte_Clube",
  "maringa": "Maringá_Futebol_Clube",
  "retro": "Retrô_Futebol_Clube_Brasil",
  "sao-bernardo": "São_Bernardo_Futebol_Clube",
  "ypiranga-rs": "Ypiranga_Futebol_Clube_(Erechim)",

  // Série D
  "manauara": "Manauara_Esporte_Clube",
  "manaus-fc": "Manaus_Futebol_Clube",
  "independencia-ac": "Independência_Futebol_Clube",
  "aguia-maraba": "Águia_de_Marabá_Futebol_Clube",
  "trem": "Trem_Desportivo_Clube",
  "gas": "Grêmio_Atlético_Sampaio",
  "humaita-ac": "Humaitá_Esporte_Clube",
  "altos": "Altos_Futebol_Clube_(Piauí)",
  "imperatriz": "Imperatriz_Esporte_Clube",
  "maranhao-ac": "Maranhão_Atlético_Clube",
  "iguatu": "Iguatu_Futebol_Clube",
  "parnahyba": "Parnahyba_Sport_Club",
  "maracana-ce": "Maracanã_Futebol_Clube",
  "central": "Central_Sport_Club",
  "ferroviario-ce": "Ferroviário_Atlético_Clube_(Ceará)",
  "horizonte": "Horizonte_Futebol_Clube",
  "santa-cruz-natal": "Santa_Cruz_Futebol_Clube_(Natal)",
  "sousa": "Sousa_Esporte_Clube",
  "lagarto": "Clube_Esportivo_Lagarto",
  "sergipe": "Club_Sportivo_Sergipe",
  "juazeirense": "Juazeirense_Esporte_Clube",
  "uniao-araguaina": "União_Esporte_Clube",
  "jequie": "Jequié_Esporte_Clube",
  "barcelona-ilheus": "Barcelona_Esporte_Clube_(Ilhéus)",
  "penedense": "Penedense_Atlético_Clube",
  "aparecidense": "Associação_Atlética_Aparecidense",
  "ceilandia": "Ceilândia_Esporte_Clube",
  "luverdense": "Luverdense_Esporte_Clube",
  "capital-df": "Capital_Futebol_Clube",
  "goiania": "Goiânia_Esporte_Clube",
  "goianesia": "Goianésia_Esporte_Clube",
  "porto-velho": "Porto_Velho_Esporte_Clube",
  "agua-santa": "Esporte_Clube_Água_Santa",
  "marica": "Maricá_Futebol_Clube",
  "pouso-alegre": "Pouso_Alegre_Futebol_Clube",
  "porto-vitoria": "Porto_Vitória_Futebol_Clube",
  "nova-iguacu": "Nova_Iguaçu_Futebol_Clube",
  "boavista-rj": "Boavista_Sport_Club",
  "fc-cascavel": "Futebol_Clube_Cascavel",
  "azuriz": "Azuriz_Futebol_Clube",
  "cianorte": "Cianorte_Futebol_Clube",
  "guarany-bage": "Guarany_Futebol_Clube_(Bagé)",
  "brasil-pelotas": "Grêmio_Esportivo_Brasil",
  "sao-jose-rs": "São_José_Futebol_Clube_(Porto_Alegre)",
  "marcilio-dias": "Clube_Náutico_Marcílio_Dias",
  "barra-sc": "Barra_Futebol_Clube",
  "joinville": "Joinville_Esporte_Clube",
  "itabirito": "Itabirito_Futebol_Clube",
  "monte-azul": "Monte_Azul_Paulista_Futebol_Clube",

  // Paraibano
  "auto-esporte": "Auto_Esporte_Clube",
  "nacional-patos": "Nacional_Atlético_Clube_(Patos)",
  "esporte-patos": "Esporte_de_Patos",
  "picuiense": "Picuiense_Futebol_Clube",
  "pombal": "Pombal_Esporte_Clube",
  "serra-branca": "Serra_Branca_Esporte_Clube",

  // International teams still needing badges
  "tottenham": "Tottenham_Hotspur_F.C.",
  "aston-villa": "Aston_Villa_F.C.",
  "atletico-madrid": "Atlético_de_Madrid",
  "sevilla": "Sevilla_Fútbol_Club",
  "valencia": "Valencia_Club_de_Fútbol",
  "villarreal": "Villarreal_Club_de_Fútbol",
  "real-sociedad": "Real_Sociedad",
  "atalanta": "Atalanta_Bergamasca_Calcio",
  "torino": "Torino_Football_Club",
  "olympique-lyon": "Olympique_Lyonnais",
  "lille": "LOSC_Lille",
  "lens": "Racing_Club_de_Lens",
  "porto": "Futebol_Clube_do_Porto",
  "vitoria-guimaraes": "Vitória_Sport_Clube",
  "psv": "PSV_Eindhoven",
  "chivas": "Club_Deportivo_Guadalajara",
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

function isBadgePlaceholder(filePath) {
  if (!existsSync(filePath)) return true;
  const content = readFileSync(filePath, "utf8");
  return content.includes('text-anchor="middle"') && content.includes('font-weight="bold"');
}

async function getWikiPageImage(title, lang = "pt") {
  // Try pageimages first (main article image)
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&piprop=original&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  if (page?.original?.source) {
    const src = page.original.source;
    if (src.toLowerCase().endsWith(".svg")) return src;
  }
  return null;
}

async function getWikiInfoboxImages(title, lang = "pt") {
  // Get all images from the page and filter for likely logos
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=images&imlimit=20&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  if (!page?.images) return [];

  return page.images
    .map(i => i.title)
    .filter(t => {
      const l = t.toLowerCase();
      return l.endsWith(".svg") &&
        !l.includes("kit") && !l.includes("jersey") && !l.includes("stadium") &&
        !l.includes("map") && !l.includes("flag_of") && !l.includes("location") &&
        !l.includes("commons-logo") && !l.includes("wiki") && !l.includes("symbol") &&
        !l.includes("crystal") && !l.includes("nuvola") && !l.includes("gnome") &&
        !l.includes("edit-") && !l.includes("dialog-") && !l.includes("ambox") &&
        !l.includes("disambig") && !l.includes("question") && !l.includes("search") &&
        !l.includes("folder") && !l.includes("futbol_") && !l.includes("soccerball") &&
        !l.includes("cbjn") && !l.includes("cbf") &&
        (l.includes("logo") || l.includes("escudo") || l.includes("crest") ||
         l.includes("emblem") || l.includes("brasão") || l.includes("badge") ||
         // Club name might be in the filename
         true);
    });
}

async function getCommonsFileUrl(fileTitle) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0]?.url || null;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const text = buffer.toString("utf8", 0, 500);
  if (!text.includes("<svg") && !text.includes("<?xml")) {
    throw new Error("Not a valid SVG file");
  }
  // Reject suspiciously large files (likely not simple logos)
  if (buffer.length > 500 * 1024) {
    throw new Error(`File too large (${Math.round(buffer.length/1024)}KB) — likely not a logo`);
  }
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, buffer);
  return buffer.length;
}

async function main() {
  const badgePaths = getTeamBadgePaths();
  const entries = Object.entries(WIKI_TITLES);

  // Filter to only teams that still need badges
  const needed = entries.filter(([teamId]) => {
    const path = badgePaths[teamId];
    return path && isBadgePlaceholder(path);
  });

  console.log(`🔍 Searching Wikipedia for ${needed.length} team badges...\n`);

  let success = 0, failed = 0;
  const failures = [];

  for (const [teamId, wikiTitle] of needed) {
    const destPath = badgePaths[teamId];

    try {
      // Try pt.wikipedia.org first
      let imageUrl = await getWikiPageImage(wikiTitle, "pt");
      await sleep(500);

      if (!imageUrl) {
        // Try en.wikipedia.org
        imageUrl = await getWikiPageImage(wikiTitle, "en");
        await sleep(500);
      }

      if (imageUrl) {
        const size = await downloadFile(imageUrl, destPath);
        console.log(`✅ ${teamId}: pageimage (${Math.round(size/1024)}KB)`);
        success++;
        await sleep(300);
        continue;
      }

      // Fallback: get all images from the page and find the logo
      const images = await getWikiInfoboxImages(wikiTitle, "pt");
      await sleep(500);

      if (images.length === 0) {
        // Try English Wikipedia
        const enImages = await getWikiInfoboxImages(wikiTitle, "en");
        await sleep(500);
        images.push(...enImages);
      }

      if (images.length === 0) {
        console.log(`❌ ${teamId}: No images found on Wikipedia`);
        failures.push(teamId);
        failed++;
        continue;
      }

      // Score images — prefer ones with logo/escudo/team name
      const teamWords = wikiTitle.toLowerCase().replace(/_/g, " ").split(/[\s()]+/);
      const scored = images.map(title => {
        const l = title.toLowerCase();
        let score = 0;
        if (l.includes("logo")) score += 5;
        if (l.includes("escudo")) score += 5;
        if (l.includes("crest")) score += 4;
        if (l.includes("emblem")) score += 4;
        for (const w of teamWords) {
          if (w.length > 2 && l.includes(w)) score += 2;
        }
        return { title, score };
      }).sort((a, b) => b.score - a.score);

      // Try the best match
      let downloaded = false;
      for (const candidate of scored.slice(0, 3)) {
        try {
          const fileUrl = await getCommonsFileUrl(candidate.title);
          await sleep(300);
          if (fileUrl) {
            const size = await downloadFile(fileUrl, destPath);
            console.log(`✅ ${teamId}: ${candidate.title.replace("File:", "")} (${Math.round(size/1024)}KB) [score=${candidate.score}]`);
            success++;
            downloaded = true;
            break;
          }
        } catch (err) {
          // Try next candidate
        }
      }

      if (!downloaded) {
        console.log(`❌ ${teamId}: No suitable SVG in ${images.length} page images`);
        failures.push(teamId);
        failed++;
      }
    } catch (err) {
      console.log(`❌ ${teamId}: ${err.message}`);
      failures.push(teamId);
      failed++;
      await sleep(1000);
    }

    await sleep(300);
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Done! ✅ ${success} | ❌ ${failed} | Total: ${needed.length}`);
  if (failures.length > 0) {
    console.log(`\nFailed: ${failures.join(", ")}`);
  }

  // Overall count
  let totalReal = 0, totalPlaceholder = 0;
  for (const [, path] of Object.entries(badgePaths)) {
    if (existsSync(path) && !isBadgePlaceholder(path)) totalReal++;
    else totalPlaceholder++;
  }
  console.log(`\nOverall: ${totalReal} real badges | ${totalPlaceholder} placeholders remaining`);
}

main().catch(console.error);
