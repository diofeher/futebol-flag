#!/usr/bin/env node
/**
 * Fetch real badges for all Brazilian teams from Wikimedia Commons.
 *
 * Strategy:
 * 1. Query Wikidata SPARQL for Brazilian football clubs with logo (P154)
 * 2. Match against our team list by name similarity
 * 3. Fall back to direct filename mapping for known teams
 * 4. Fall back to Commons search API for remaining teams
 * 5. Download SVGs
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BADGES_DIR = join(__dirname, "..", "public", "badges");
const USER_AGENT = "FutebolQuizBot/1.0 (https://github.com/diofeher/futebol-flag; diogenes@gdsfactory.com)";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Direct filename mapping for teams we know (most reliable)
const DIRECT_MAP = {
  // Série A
  "sport": "Sport_Club_do_Recife_logo.svg",
  "juventude": "EC_Juventude_logo.svg",
  "mirassol": "Mirassol_Futebol_Clube_logo.svg",
  "rb-bragantino": "Red_Bull_Bragantino_logo.svg",

  // Série B
  "amazonas": "Amazonas_Futebol_Clube.svg",
  "america-mg": "America_Futebol_Clube_(MG).svg",
  "atletico-go": "Atletico_Clube_Goianiense_logo.svg",
  "avai": "Avai_FC_(2002).svg",
  "botafogo-sp": "Botafogo_Futebol_Clube_(SP)_logo.svg",
  "chapecoense": "Chapecoense_club_logo.svg",
  "crb": "CRB_club_logo.svg",
  "criciuma": "Criciuma_Esporte_Clube.svg",
  "cuiaba": "Cuiaba_Esporte_Clube.svg",
  "novorizontino": "Gremio_Novorizontino_logo.svg",
  "operario-pr": "Operario_Ferroviario_Esporte_Clube_logo.svg",
  "paysandu": "Paysandu_Sport_Club_(logo).svg",
  "remo": "Clube_do_Remo_logo.svg",
  "vila-nova": "Vila_Nova_Futebol_Clube_(logo).svg",
  "volta-redonda": "Volta_Redonda_Futebol_Clube_logo.svg",

  // Série C
  "abc": "ABC_Futebol_Clube_(logo).svg",
  "botafogo-pb": "Botafogo_Futebol_Clube_(Joao_Pessoa).svg",
  "brusque": "Brusque_Futebol_Clube_logo.svg",
  "csa": "Centro_Sportivo_Alagoano.svg",
  "figueirense": "Figueirense_FC.svg",
  "guarani": "Guarani_FC_logo.svg",
  "ituano": "Ituano_Futebol_Clube_logo.svg",
  "londrina": "Londrina_Esporte_Clube_logo.svg",
  "nautico": "Clube_Nautico_Capibaribe_logo.svg",
  "ponte-preta": "AA_Ponte_Preta.svg",
  "tombense": "Tombense_Futebol_Clube.svg",

  // Série D
  "tuna-luso": "Tuna_Luso_Brasileira.svg",
  "sampaio-correa": "Sampaio_Correa_Futebol_Clube.svg",
  "america-natal": "America_Futebol_Clube_(RN).svg",
  "santa-cruz": "Santa_Cruz_Futebol_Clube_logo.svg",
  "ferroviario-ce": "Ferroviario_Atletico_Clube_(CE)_logo.svg",
  "treze": "Treze_Futebol_Clube_logo.svg",
  "sergipe": "Club_Sportivo_Sergipe.svg",
  "joinville": "Joinville_Esporte_Clube_logo.svg",
  "portuguesa-sp": "Associacao_Portuguesa_de_Desportos_logo.svg",
  "nova-iguacu": "Nova_Iguacu_Futebol_Clube.svg",
  "brasil-pelotas": "Gremio_Esportivo_Brasil_logo.svg",
  "aparecidense": "Aparecidense.svg",
  "juazeirense": "Juazeirense_logo.svg",

  // Paraibano
  "campinense": "Campinense_Clube_logo.svg",
  "treze": "Treze_Futebol_Clube_logo.svg",
  "auto-esporte": "Auto_Esporte_Clube_logo.svg",
};

// Search terms for Commons search (fallback)
const SEARCH_TERMS = {
  // Série A
  "sport": "Sport Club do Recife escudo",
  "juventude": "Esporte Clube Juventude logo",
  "mirassol": "Mirassol Futebol Clube logo",
  "rb-bragantino": "Red Bull Bragantino logo",

  // Série B
  "amazonas": "Amazonas Futebol Clube logo",
  "america-mg": "América Futebol Clube Minas Gerais logo",
  "athletic-mg": "Athletic Club Minas Gerais logo",
  "atletico-go": "Atlético Clube Goianiense logo",
  "avai": "Avaí Futebol Clube logo",
  "botafogo-sp": "Botafogo Futebol Clube Ribeirão Preto logo",
  "chapecoense": "Associação Chapecoense Futebol logo",
  "crb": "Clube de Regatas Brasil logo",
  "criciuma": "Criciúma Esporte Clube logo",
  "cuiaba": "Cuiabá Esporte Clube logo",
  "ferroviaria": "Ferroviária Araraquara logo",
  "novorizontino": "Grêmio Novorizontino logo",
  "operario-pr": "Operário Ferroviário Esporte Clube logo",
  "paysandu": "Paysandu Sport Club logo",
  "remo": "Clube do Remo logo",
  "vila-nova": "Vila Nova Futebol Clube logo",
  "volta-redonda": "Volta Redonda Futebol Clube logo",

  // Série C
  "abc": "ABC Futebol Clube Natal logo",
  "anapolis": "Anápolis Futebol Clube logo",
  "botafogo-pb": "Botafogo Futebol Clube João Pessoa logo",
  "brusque": "Brusque Futebol Clube logo",
  "caxias-rs": "Sociedade Esportiva Recreativa Caxias logo",
  "confianca": "Associação Desportiva Confiança logo",
  "csa": "Centro Sportivo Alagoano logo",
  "figueirense": "Figueirense Futebol Clube logo",
  "floresta": "Floresta Esporte Clube logo",
  "guarani": "Guarani Futebol Clube logo",
  "itabaiana": "Associação Olímpica Itabaiana logo",
  "ituano": "Ituano Futebol Clube logo",
  "londrina": "Londrina Esporte Clube logo",
  "maringa": "Maringá Futebol Clube logo",
  "nautico": "Clube Náutico Capibaribe logo",
  "ponte-preta": "Associação Atlética Ponte Preta logo",
  "retro": "Retrô Futebol Clube Brasil logo",
  "sao-bernardo": "São Bernardo Futebol Clube logo",
  "tombense": "Tombense Futebol Clube logo",
  "ypiranga-rs": "Ypiranga Futebol Clube Erechim logo",

  // Série D
  "tuna-luso": "Tuna Luso Brasileira logo",
  "manauara": "Manauara Esporte Clube logo",
  "manaus-fc": "Manaus Futebol Clube logo",
  "independencia-ac": "Independência Futebol Clube logo",
  "aguia-maraba": "Águia de Marabá Futebol Clube logo",
  "trem": "Trem Desportivo Clube logo",
  "gas": "Grêmio Atlético Sampaio logo",
  "humaita-ac": "Humaitá Esporte Clube logo",
  "altos": "Altos Futebol Clube logo",
  "imperatriz": "Imperatriz Esporte Clube logo",
  "sampaio-correa": "Sampaio Corrêa Futebol Clube logo",
  "maranhao-ac": "Maranhão Atlético Clube logo",
  "iguatu": "Iguatu Futebol Clube logo",
  "tocantinopolis": "Tocantinópolis Esporte Clube logo",
  "parnahyba": "Parnahyba Sport Club logo",
  "maracana-ce": "Maracanã Futebol Clube logo",
  "america-natal": "América Futebol Clube Natal logo",
  "santa-cruz": "Santa Cruz Futebol Clube logo",
  "central": "Central Sport Club logo",
  "ferroviario-ce": "Ferroviário Atlético Clube Fortaleza logo",
  "horizonte": "Horizonte Futebol Clube logo",
  "santa-cruz-natal": "Santa Cruz de Natal Futebol Clube logo",
  "treze": "Treze Futebol Clube Campina Grande logo",
  "sousa": "Sousa Esporte Clube logo",
  "asa": "Agremiação Sportiva Arapiraquense logo",
  "lagarto": "Associação Olímpica Lagarto logo",
  "sergipe": "Club Sportivo Sergipe logo",
  "juazeirense": "Juazeirense Esporte Clube logo",
  "uniao-araguaina": "União Esporte Clube Araguaína logo",
  "jequie": "Jequié Esporte Clube logo",
  "barcelona-ilheus": "Barcelona Esporte Clube Ilhéus logo",
  "penedense": "Penedense Atlético Clube logo",
  "aparecidense": "Associação Atlética Aparecidense logo",
  "ceilandia": "Ceilândia Esporte Clube logo",
  "luverdense": "Luverdense Esporte Clube logo",
  "mixto": "Mixto Esporte Clube logo",
  "capital-df": "Capital Futebol Clube logo",
  "goiania": "Goiânia Esporte Clube logo",
  "goianesia": "Goianésia Esporte Clube logo",
  "porto-velho": "Porto Velho Esporte Clube logo",
  "portuguesa-sp": "Associação Portuguesa de Desportos logo",
  "rio-branco-es": "Rio Branco Atlético Clube Espírito Santo logo",
  "agua-santa": "Esporte Clube Água Santa logo",
  "marica": "Maricá Futebol Clube logo",
  "pouso-alegre": "Pouso Alegre Futebol Clube logo",
  "porto-vitoria": "Porto Vitória Futebol Clube logo",
  "nova-iguacu": "Nova Iguaçu Futebol Clube logo",
  "boavista-rj": "Boavista Sport Club logo",
  "fc-cascavel": "FC Cascavel logo",
  "azuriz": "Azuriz Futebol Clube logo",
  "cianorte": "Cianorte Futebol Clube logo",
  "guarany-bage": "Guarany Futebol Clube Bagé logo",
  "brasil-pelotas": "Grêmio Esportivo Brasil Pelotas logo",
  "sao-luiz-rs": "São Luiz Futebol Clube Ijuí logo",
  "sao-jose-rs": "São José Futebol Clube Porto Alegre logo",
  "marcilio-dias": "Clube Náutico Marcílio Dias logo",
  "barra-sc": "Barra Futebol Clube logo",
  "joinville": "Joinville Esporte Clube logo",
  "inter-limeira": "Associação Atlética Internacional Limeira logo",
  "uberlandia": "Uberlândia Esporte Clube logo",
  "itabirito": "Itabirito Futebol Clube logo",
  "monte-azul": "Monte Azul Futebol Clube logo",
  "operario-ms": "Operário Futebol Clube Campo Grande logo",

  // Paraibano
  "auto-esporte": "Auto Esporte Clube João Pessoa logo",
  "campinense": "Campinense Clube logo",
  "nacional-patos": "Nacional Atlético Clube Patos logo",
  "esporte-patos": "Esporte de Patos logo",
  "picuiense": "Picuiense Futebol Clube logo",
  "pombal": "Pombal Esporte Clube logo",
  "serra-branca": "Serra Branca Esporte Clube logo",
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

async function getCommonsFileUrl(filename) {
  const encodedTitle = encodeURIComponent(`File:${filename}`);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodedTitle}&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0]?.url || null;
}

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=15&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.query.search || [];
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  // Validate it's actually SVG
  const text = buffer.toString("utf8", 0, 500);
  if (!text.includes("<svg") && !text.includes("<?xml")) {
    throw new Error("Not a valid SVG file");
  }

  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, buffer);
  return buffer.length;
}

function scoreSvgResult(title, teamName) {
  const t = title.toLowerCase();
  // Reject non-SVG
  if (!t.endsWith(".svg")) return -1;
  // Reject obviously wrong files
  const rejects = ["kit", "jersey", "stadium", "map", "flag_of", "location",
    "wikinews", "brewery", "constituency", "velodrome", "district",
    "season", "table", "2023", "2024", "2025", "uniform", "away", "home",
    "transfer", "formation", "squad", "roster"];
  if (rejects.some(r => t.includes(r))) return -1;

  let score = 0;
  // Bonus for containing "logo", "escudo", "crest", "emblem"
  if (t.includes("logo")) score += 3;
  if (t.includes("escudo")) score += 3;
  if (t.includes("crest")) score += 2;
  if (t.includes("emblem")) score += 2;
  // Bonus for containing team name words
  const nameWords = teamName.toLowerCase().split(/\s+/);
  for (const w of nameWords) {
    if (w.length > 2 && t.includes(w.replace(/[áàã]/g, "a").replace(/[éê]/g, "e").replace(/[íî]/g, "i").replace(/[óô]/g, "o").replace(/[úû]/g, "u"))) {
      score += 2;
    }
  }
  return score;
}

async function fetchViaWikidata() {
  console.log("📡 Querying Wikidata for Brazilian club logos...\n");
  const sparql = `
    SELECT ?club ?clubLabel ?logo WHERE {
      ?club wdt:P31/wdt:P279* wd:Q476028.
      ?club wdt:P17 wd:Q155.
      ?club wdt:P154 ?logo.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,en". }
    }
  `;
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, "Accept": "application/json" } });
  if (!res.ok) {
    console.log(`⚠️  Wikidata query failed: HTTP ${res.status}`);
    return {};
  }
  const data = await res.json();
  const results = {};
  for (const row of data.results.bindings) {
    const name = row.clubLabel.value;
    const logoUrl = row.logo.value;
    // Extract filename from Commons URL
    const filename = decodeURIComponent(logoUrl.split("/").pop());
    if (filename.toLowerCase().endsWith(".svg")) {
      results[name.toLowerCase()] = { name, filename, logoUrl };
    }
  }
  console.log(`  Found ${Object.keys(results).length} Brazilian clubs with SVG logos on Wikidata\n`);
  return results;
}

// Name variations for matching Wikidata results to our team IDs
const NAME_ALIASES = {
  "sport": ["sport club do recife", "sport recife"],
  "juventude": ["esporte clube juventude", "juventude"],
  "mirassol": ["mirassol futebol clube", "mirassol"],
  "rb-bragantino": ["red bull bragantino", "rb bragantino", "bragantino"],
  "amazonas": ["amazonas futebol clube", "amazonas"],
  "america-mg": ["américa futebol clube", "américa mineiro", "america mineiro"],
  "athletic-mg": ["athletic club"],
  "atletico-go": ["atlético clube goianiense", "atlético goianiense"],
  "avai": ["avaí futebol clube", "avaí"],
  "botafogo-sp": ["botafogo futebol clube (sp)", "botafogo de ribeirão preto"],
  "chapecoense": ["associação chapecoense de futebol", "chapecoense"],
  "crb": ["clube de regatas brasil"],
  "criciuma": ["criciúma esporte clube", "criciúma"],
  "cuiaba": ["cuiabá esporte clube", "cuiabá"],
  "ferroviaria": ["associação ferroviária de esportes", "ferroviária"],
  "novorizontino": ["grêmio novorizontino", "novorizontino"],
  "operario-pr": ["operário ferroviário esporte clube", "operário-pr"],
  "paysandu": ["paysandu sport club", "paysandu"],
  "remo": ["clube do remo", "remo"],
  "vila-nova": ["vila nova futebol clube", "vila nova"],
  "volta-redonda": ["volta redonda futebol clube"],
  "abc": ["abc futebol clube"],
  "anapolis": ["anápolis futebol clube"],
  "botafogo-pb": ["botafogo futebol clube (paraíba)", "botafogo da paraíba"],
  "brusque": ["brusque futebol clube"],
  "caxias-rs": ["sociedade esportiva e recreativa caxias do sul", "ser caxias"],
  "confianca": ["associação desportiva confiança", "confiança"],
  "csa": ["centro sportivo alagoano"],
  "figueirense": ["figueirense futebol clube", "figueirense"],
  "floresta": ["floresta esporte clube"],
  "guarani": ["guarani futebol clube", "guarani"],
  "itabaiana": ["associação olímpica de itabaiana"],
  "ituano": ["ituano futebol clube", "ituano"],
  "londrina": ["londrina esporte clube", "londrina"],
  "maringa": ["maringá futebol clube"],
  "nautico": ["clube náutico capibaribe", "náutico"],
  "ponte-preta": ["associação atlética ponte preta", "ponte preta"],
  "retro": ["retrô futebol clube brasil"],
  "sao-bernardo": ["são bernardo futebol clube"],
  "tombense": ["tombense futebol clube"],
  "ypiranga-rs": ["ypiranga futebol clube", "ypiranga de erechim"],
  "tuna-luso": ["tuna luso brasileira"],
  "manauara": ["manauara esporte clube"],
  "manaus-fc": ["manaus futebol clube"],
  "sampaio-correa": ["sampaio corrêa futebol clube", "sampaio corrêa"],
  "america-natal": ["américa futebol clube (natal)", "américa de natal"],
  "santa-cruz": ["santa cruz futebol clube", "santa cruz"],
  "central": ["central sport club"],
  "ferroviario-ce": ["ferroviário atlético clube"],
  "treze": ["treze futebol clube"],
  "sergipe": ["club sportivo sergipe"],
  "joinville": ["joinville esporte clube", "joinville"],
  "portuguesa-sp": ["associação portuguesa de desportos", "portuguesa"],
  "nova-iguacu": ["nova iguaçu futebol clube"],
  "brasil-pelotas": ["grêmio esportivo brasil", "brasil de pelotas"],
  "aparecidense": ["associação atlética aparecidense"],
  "juazeirense": ["juazeirense esporte clube"],
  "campinense": ["campinense clube"],
  "auto-esporte": ["auto esporte clube"],
  "luverdense": ["luverdense esporte clube"],
  "altos": ["altos futebol clube", "altos"],
  "imperatriz": ["imperatriz esporte clube"],
};

async function main() {
  const badgePaths = getTeamBadgePaths();

  // Get list of Brazilian teams needing badges
  const teamsFile = readFileSync(join(__dirname, "..", "src", "data", "teams.ts"), "utf8");
  const regex = /id:\s*"([^"]+)".*?name:\s*"([^"]+)".*?leagueId:\s*"([^"]+)"/gs;
  const brTeams = [];
  let m;
  while ((m = regex.exec(teamsFile)) !== null) {
    const [, id, name, league] = m;
    if (["brasileirao", "brasileirao-b", "brasileirao-c", "brasileirao-d", "paraibano"].includes(league)) {
      const path = badgePaths[id];
      if (path && isBadgePlaceholder(path)) {
        brTeams.push({ id, name, league, path });
      }
    }
  }

  console.log(`🇧🇷 ${brTeams.length} Brazilian teams need real badges\n`);

  // Phase 1: Wikidata SPARQL
  const wikidataResults = await fetchViaWikidata();
  await sleep(1000);

  // Match Wikidata results to our teams
  const wikidataMatches = {};
  for (const team of brTeams) {
    const aliases = NAME_ALIASES[team.id] || [team.name.toLowerCase()];
    for (const alias of aliases) {
      if (wikidataResults[alias]) {
        wikidataMatches[team.id] = wikidataResults[alias].filename;
        break;
      }
    }
  }
  console.log(`📊 Wikidata matched ${Object.keys(wikidataMatches).length} teams\n`);

  // Phase 2: Try direct map, then Wikidata match, then search
  let success = 0, failed = 0, skipped = 0;
  const failures = [];

  for (const team of brTeams) {
    const destPath = team.path;

    // Strategy priority: direct map > wikidata > search
    let filename = DIRECT_MAP[team.id] || wikidataMatches[team.id];

    if (filename) {
      // Try direct download
      try {
        const fileUrl = await getCommonsFileUrl(filename);
        await sleep(500);
        if (fileUrl) {
          const size = await downloadFile(fileUrl, destPath);
          console.log(`✅ ${team.id}: ${filename} (${Math.round(size/1024)}KB) [direct]`);
          success++;
          continue;
        }
      } catch (err) {
        // Fall through to search
      }
    }

    // Fallback: Commons search
    const query = SEARCH_TERMS[team.id] || `${team.name} futebol clube logo escudo`;
    try {
      const results = await searchCommons(query);
      await sleep(800);

      // Score and rank results
      const scored = results
        .map(r => ({ ...r, score: scoreSvgResult(r.title, team.name) }))
        .filter(r => r.score >= 0)
        .sort((a, b) => b.score - a.score);

      if (scored.length === 0) {
        // Try alternative search
        const altQuery = `${team.name} escudo svg`;
        const altResults = await searchCommons(altQuery);
        await sleep(800);

        const altScored = altResults
          .map(r => ({ ...r, score: scoreSvgResult(r.title, team.name) }))
          .filter(r => r.score >= 0)
          .sort((a, b) => b.score - a.score);

        if (altScored.length === 0) {
          console.log(`❌ ${team.id} (${team.name}): No SVG found`);
          failures.push(team.id);
          failed++;
          continue;
        }

        const best = altScored[0];
        const fileUrl = await getFileUrl(best.title);
        await sleep(500);
        if (fileUrl) {
          const size = await downloadFile(fileUrl, destPath);
          console.log(`✅ ${team.id}: ${best.title.replace("File:", "")} (${Math.round(size/1024)}KB) [search-alt]`);
          success++;
        } else {
          console.log(`❌ ${team.id}: URL fetch failed for ${best.title}`);
          failures.push(team.id);
          failed++;
        }
        continue;
      }

      const best = scored[0];
      const fileUrl = await getFileUrl(best.title);
      await sleep(500);

      if (fileUrl) {
        const size = await downloadFile(fileUrl, destPath);
        console.log(`✅ ${team.id}: ${best.title.replace("File:", "")} (${Math.round(size/1024)}KB) [search, score=${best.score}]`);
        success++;
      } else {
        console.log(`❌ ${team.id}: URL fetch failed`);
        failures.push(team.id);
        failed++;
      }
    } catch (err) {
      console.log(`❌ ${team.id}: ${err.message}`);
      failures.push(team.id);
      failed++;
      await sleep(1000);
    }

    await sleep(300);
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Done! ✅ ${success} | ❌ ${failed} | Total: ${brTeams.length}`);
  if (failures.length > 0) {
    console.log(`\nFailed teams: ${failures.join(", ")}`);
  }

  // Overall count
  let totalReal = 0, totalPlaceholder = 0;
  for (const [, path] of Object.entries(badgePaths)) {
    if (existsSync(path) && !isBadgePlaceholder(path)) totalReal++;
    else totalPlaceholder++;
  }
  console.log(`\nOverall: ${totalReal} real badges | ${totalPlaceholder} placeholders remaining`);
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

main().catch(console.error);
