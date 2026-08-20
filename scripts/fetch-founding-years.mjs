#!/usr/bin/env node
/**
 * Fetch founding years for teams with foundedYear: 0
 * Uses Wikidata SPARQL to batch-query football clubs by country.
 * Then fuzzy-matches team names to update teams.ts.
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEAMS_PATH = join(__dirname, "..", "src", "data", "teams.ts");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Country names in teams.ts → Wikidata country entity IDs
const COUNTRY_TO_QID = {
  "Argentina": "Q414",
  "Austria": "Q40",
  "Belgium": "Q31",
  "Brazil": "Q155",
  "Bulgaria": "Q219",
  "Chile": "Q298",
  "Colombia": "Q739",
  "Cyprus": "Q229",
  "Czech Republic": "Q213",
  "Denmark": "Q35",
  "Egypt": "Q79",
  "England": "Q21",
  "Finland": "Q33",
  "France": "Q142",
  "Germany": "Q183",
  "Greece": "Q41",
  "Hungary": "Q28",
  "India": "Q668",
  "Indonesia": "Q252",
  "Iraq": "Q796",
  "Israel": "Q801",
  "Italy": "Q38",
  "Japan": "Q17",
  "Mexico": "Q96",
  "Netherlands": "Q55",
  "Norway": "Q20",
  "Poland": "Q36",
  "Portugal": "Q45",
  "Republic of Ireland": "Q27",
  "Romania": "Q218",
  "Russia": "Q159",
  "Saudi Arabia": "Q851",
  "Scotland": "Q22",
  "South Korea": "Q884",
  "Spain": "Q29",
  "Sweden": "Q34",
  "Switzerland": "Q39",
  "Turkey": "Q43",
  "Ukraine": "Q212",
  "Uruguay": "Q77",
  "USA": "Q30",
  "Wales": "Q25",
};

function normalize(name) {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Extract teams with foundedYear: 0, grouped by country
function getTeamsToUpdate() {
  const content = readFileSync(TEAMS_PATH, "utf8");
  const regex = /\{ id: "([^"]+)", name: "([^"]+)",[^}]*country: "([^"]+)",[^}]*foundedYear: 0/g;
  const teams = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    teams.push({ id: m[1], name: m[2], country: m[3] });
  }
  return teams;
}

async function queryWikidata(countryQid) {
  const sparql = `
SELECT ?club ?clubLabel ?inception WHERE {
  ?club wdt:P31/wdt:P279* wd:Q476028 .
  ?club wdt:P17 wd:${countryQid} .
  ?club wdt:P571 ?inception .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,pt,es,fr,de,it,nl,ja,ko,ar". }
}
  `.trim();

  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "FutebolQuiz/1.0 (diogenes@gdsfactory.com)",
      "Accept": "application/sparql-results+json",
    },
  });

  if (!res.ok) {
    console.error(`  Wikidata HTTP ${res.status} for ${countryQid}`);
    return [];
  }

  const data = await res.json();
  return data.results.bindings.map(b => ({
    name: b.clubLabel?.value || "",
    year: new Date(b.inception?.value).getFullYear(),
  })).filter(c => c.year > 1800 && c.year < 2030);
}

function findBestMatch(teamName, wikidataClubs) {
  const normTeam = normalize(teamName);

  // Exact match first
  for (const club of wikidataClubs) {
    if (normalize(club.name) === normTeam) return club.year;
  }

  // Contains match (team name in wikidata name or vice versa)
  for (const club of wikidataClubs) {
    const normClub = normalize(club.name);
    if (normClub.includes(normTeam) || normTeam.includes(normClub)) {
      if (normClub.length > 2 && normTeam.length > 2) return club.year;
    }
  }

  // Word overlap match — at least 2 significant words match
  const teamWords = normTeam.split(" ").filter(w => w.length > 2);
  for (const club of wikidataClubs) {
    const clubWords = normalize(club.name).split(" ").filter(w => w.length > 2);
    const overlap = teamWords.filter(w => clubWords.includes(w));
    if (overlap.length >= 2 || (overlap.length === 1 && teamWords.length === 1 && clubWords.length <= 2)) {
      return club.year;
    }
  }

  return null;
}

async function main() {
  const teams = getTeamsToUpdate();
  console.log(`Teams needing founding year: ${teams.length}`);

  // Group by country
  const byCountry = {};
  for (const t of teams) {
    if (!byCountry[t.country]) byCountry[t.country] = [];
    byCountry[t.country].push(t);
  }

  const countries = Object.keys(byCountry).sort();
  console.log(`Countries: ${countries.length}\n`);

  const results = {}; // id -> year
  let totalFound = 0;
  let totalMissing = 0;

  for (const country of countries) {
    const qid = COUNTRY_TO_QID[country];
    if (!qid) {
      console.log(`⚠️  No Wikidata QID for "${country}" — skipping ${byCountry[country].length} teams`);
      totalMissing += byCountry[country].length;
      continue;
    }

    process.stdout.write(`🌍 ${country} (${byCountry[country].length} teams)...`);

    try {
      const wikidataClubs = await queryWikidata(qid);
      process.stdout.write(` ${wikidataClubs.length} clubs from Wikidata\n`);

      let found = 0;
      for (const team of byCountry[country]) {
        const year = findBestMatch(team.name, wikidataClubs);
        if (year) {
          results[team.id] = year;
          found++;
        }
      }
      console.log(`  ✅ Matched: ${found}/${byCountry[country].length}`);
      totalFound += found;
      totalMissing += byCountry[country].length - found;
    } catch (err) {
      console.log(` ❌ ${err.message}`);
      totalMissing += byCountry[country].length;
    }

    await sleep(1000); // Rate limit Wikidata
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Found: ${totalFound} | Missing: ${totalMissing}`);

  // Apply updates to teams.ts
  if (totalFound > 0) {
    let content = readFileSync(TEAMS_PATH, "utf8");
    let updated = 0;

    for (const [id, year] of Object.entries(results)) {
      // Replace foundedYear: 0 for this specific team
      const pattern = new RegExp(
        `(\\{ id: "${id}",[^}]*foundedYear: )0(,)`,
      );
      const newContent = content.replace(pattern, `$1${year}$2`);
      if (newContent !== content) {
        content = newContent;
        updated++;
      }
    }

    writeFileSync(TEAMS_PATH, content);
    console.log(`\nUpdated ${updated} teams in teams.ts`);
  }
}

main().catch(console.error);
