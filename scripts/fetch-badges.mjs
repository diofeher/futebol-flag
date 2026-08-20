#!/usr/bin/env node
/**
 * Fetch real club badge SVGs from Wikimedia Commons via Wikidata SPARQL.
 *
 * Strategy:
 * 1. Query Wikidata for all football clubs with logo (P154)
 * 2. Match against our team list by name
 * 3. Download SVGs from Commons
 *
 * Usage: node scripts/fetch-badges.mjs
 */

import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BADGES_DIR = join(__dirname, "..", "public", "badges");
const USER_AGENT = "FutebolFlagBot/1.0 (https://github.com/diofeher/futebol-flag; diogenes@gdsfactory.com)";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Direct mapping: teamId -> Wikimedia Commons filename (most reliable)
// Found by checking each club's Wikipedia page manually for the logo file
const DIRECT_MAP = {
  // Brasileirão
  flamengo: "Flamengo_braz_logo.svg",
  palmeiras: "Palmeiras_logo.svg",
  corinthians: "Sport_Club_Corinthians_Paulista_crest.svg",
  "sao-paulo": "Sao_Paulo_FC.svg",
  santos: "Santos_Logo.svg",
  fluminense: "Fluminense_fc_logo.svg",
  vasco: "CR_Vasco_da_Gama_logo.svg",
  botafogo: "Botafogo_de_Futebol_e_Regatas_logo.svg",
  gremio: "Gremio_logo.svg",
  internacional: "Sport_Club_Internacional_Logo_(2024).svg",
  "atletico-mg": "Atletico_mineiro_galo.svg",
  cruzeiro: "Cruzeiro_Esporte_Clube_(logo).svg",
  bahia: "Esporte_Clube_Bahia_logo.svg",
  fortaleza: "Fortaleza_Esporte_Clube_logo.svg",
  "athletico-pr": "Club_Athletico_Paranaense_2019.svg",
  coritiba: "Coritiba_FBC_logo.svg",
  sport: "Sport_Club_do_Recife.svg",
  vitoria: "EC_Vitoria.svg",
  ceara: "Ceara_Sporting_Club_logo.svg",
  goias: "Goias_Esporte_Clube_logo.svg",

  // Argentina
  "boca-juniors": "Boca_Juniors_logo18.svg",
  "river-plate": "River_plate_logo_2022.svg",
  "racing-club": "Racing_Club_2014.svg",
  independiente: "Escudo_de_Independiente.svg",
  "san-lorenzo": "San_lorenzo_almagro_logo.svg",
  "velez-sarsfield": "Velez_Sarsfield_logo.svg",
  estudiantes: "Estudiantes_de_La_Plata_logo.svg",
  "newells-old-boys": "Newells_old_boys_logo.svg",
  "rosario-central": "Rosario_Central_logo.svg",
  talleres: "Talleres_de_Cordoba_logo.svg",

  // Premier League
  arsenal: "Arsenal_FC.svg",
  "manchester-united": "Manchester_United_FC_crest.svg",
  "manchester-city": "Manchester_City_FC_badge.svg",
  liverpool: "Liverpool_FC.svg",
  chelsea: "Chelsea_FC.svg",
  tottenham: "Tottenham_Hotspur.svg",
  "aston-villa": "Aston_Villa.svg",
  newcastle: "Newcastle_United_Logo.svg",
  "west-ham": "West_Ham_United_FC_logo.svg",
  everton: "Everton_FC_logo.svg",

  // La Liga
  "real-madrid": "Real_Madrid_CF.svg",
  barcelona: "FC_Barcelona_crest.svg",
  "atletico-madrid": "Atletico_Madrid_logo.svg",
  sevilla: "Sevilla_FC_logo.svg",
  "real-betis": "Real_Betis_logo.svg",
  valencia: "Valenciacf.svg",
  villarreal: "Villarreal_CF_logo.svg",
  "real-sociedad": "Real_Sociedad_logo.svg",
  "athletic-bilbao": "Athletic_Club_crest.svg",
  "celta-vigo": "RC_Celta_de_Vigo_logo.svg",

  // Serie A Italy
  juventus: "Juventus_FC_2017_logo.svg",
  "ac-milan": "Logo_of_AC_Milan.svg",
  "inter-milan": "Inter_Milan.svg",
  napoli: "SSC_Napoli.svg",
  roma: "AS_Roma_Logo_2017.svg",
  lazio: "SS_Lazio.svg",
  fiorentina: "ACF_Fiorentina_2022.svg",
  atalanta: "Atalanta_BC.svg",
  torino: "Torino_FC_Logo.svg",
  bologna: "Bologna_FC_logo.svg",

  // Bundesliga
  "bayern-munich": "FC_Bayern_München_logo_(2017).svg",
  "borussia-dortmund": "Borussia_Dortmund_logo.svg",
  "rb-leipzig": "RB_Leipzig_2014_logo.svg",
  "bayer-leverkusen": "Bayer_04_Leverkusen_logo.svg",
  "eintracht-frankfurt": "Eintracht_Frankfurt_Logo.svg",
  wolfsburg: "VfL_Wolfsburg_Logo.svg",
  schalke: "FC_Schalke_04_Logo.svg",
  "borussia-monchengladbach": "Borussia_Mönchengladbach_logo.svg",
  stuttgart: "VfB_Stuttgart_Logo.svg",
  "werder-bremen": "SV-Werder-Bremen-Logo.svg",

  // Ligue 1
  psg: "Paris_Saint-Germain_F.C..svg",
  "olympique-marseille": "Logo_Olympique_de_Marseille.svg",
  "olympique-lyon": "Olympique_Lyonnais_(logo).svg",
  monaco: "AS_Monaco_FC.svg",
  lille: "Logo_LOSC_Lille_2018.svg",
  nice: "Logo_OGC_Nice_2013.svg",
  lens: "Racing_Club_de_Lens_logo.svg",
  rennes: "Stade_Rennais_FC.svg",

  // Portugal
  benfica: "SL_Benfica_logo.svg",
  porto: "Portal_do_FC_Porto.svg",
  "sporting-cp": "Sporting_Clube_de_Portugal_(Logo).svg",
  braga: "SC_Braga_logo.svg",
  "vitoria-guimaraes": "Vitoria_Sport_Clube.svg",

  // Eredivisie
  ajax: "AFC_Ajax.svg",
  psv: "PSV_Eindhoven.svg",
  feyenoord: "Feyenoord_logo.svg",
  "az-alkmaar": "AZ_Alkmaar.svg",

  // Liga MX
  "club-america": "Club_America_2024.svg",
  chivas: "CD_Guadalajara_logo.svg",
  "cruz-azul": "Cruz_Azul_logo.svg",
  "pumas-unam": "Pumas_UNAM_logo.svg",
  monterrey: "CF_Monterrey_logo.svg",
  "tigres-uanl": "Tigres_logo.svg",

  // Colombia
  "atletico-nacional": "Atletico_Nacional_Logo.svg",
  millonarios: "Millonarios_FC_logo.svg",
  "america-de-cali": "America_de_Cali_logo.svg",
  "deportivo-cali": "Deportivo_Cali_logo.svg",
  "junior-barranquilla": "Junior_de_Barranquilla.svg",

  // Uruguay
  penarol: "Escudo_de_Penarol.svg",
  "nacional-uy": "Nacional_Escudo.svg",

  // Chile
  "colo-colo": "Colo-Colo.svg",
  "universidad-chile": "Universidad_de_Chile_logo.svg",
  "universidad-catolica": "CD_Universidad_Catolica_logo.svg",

  // MLS
  lafc: "Los_Angeles_FC.svg",
  "la-galaxy": "Los_Angeles_Galaxy_logo.svg",
  "inter-miami": "Inter_Miami_CF_logo.svg",
  "atlanta-united": "Atlanta_MLS.svg",
  "seattle-sounders": "Seattle_Sounders_logo.svg",
};

function commonsUrl(filename) {
  // Wikimedia Commons URL pattern
  return `https://upload.wikimedia.org/wikipedia/commons/${encodeURIComponent(filename.replace(/ /g, "_"))}`;
}

async function getCommonsFileUrl(filename) {
  // Use the MediaWiki API to get the actual file URL
  const encodedTitle = encodeURIComponent(`File:${filename}`);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodedTitle}&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  if (page?.imageinfo?.[0]?.url) {
    return page.imageinfo[0].url;
  }
  return null;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, buffer);
  return buffer.length;
}

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

async function main() {
  const badgePaths = getTeamBadgePaths();
  const entries = Object.entries(DIRECT_MAP);
  let success = 0, failed = 0;

  console.log(`Fetching ${entries.length} badges from Wikimedia Commons...\n`);

  for (const [teamId, filename] of entries) {
    const destPath = badgePaths[teamId];
    if (!destPath) {
      console.log(`⚠️  ${teamId}: No badge path in teams.ts`);
      failed++;
      continue;
    }

    try {
      const fileUrl = await getCommonsFileUrl(filename);
      if (!fileUrl) {
        console.log(`❌ ${teamId}: "${filename}" not found on Commons`);
        failed++;
        await sleep(500);
        continue;
      }

      const size = await downloadFile(fileUrl, destPath);
      const sizeKb = Math.round(size / 1024);
      console.log(`✅ ${teamId}: ${filename} (${sizeKb}KB)`);
      success++;
    } catch (err) {
      console.log(`❌ ${teamId}: ${err.message}`);
      failed++;
    }

    await sleep(500);
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Done! ✅ ${success} | ❌ ${failed} | Total: ${entries.length}`);
}

main().catch(console.error);
