#!/usr/bin/env node
/**
 * Fetch founding years for England/Scotland using batched Wikidata queries.
 * Splits into smaller queries to avoid timeouts.
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEAMS_PATH = join(__dirname, "..", "src", "data", "teams.ts");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function normalize(name) {
  return name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}

function getTeamsForCountry(country) {
  const content = readFileSync(TEAMS_PATH, "utf8");
  const regex = /\{ id: "([^"]+)", name: "([^"]+)",[^}]*country: "([^"]+)",[^}]*foundedYear: 0/g;
  const teams = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    if (m[3] === country) teams.push({ id: m[1], name: m[2] });
  }
  return teams;
}

// Query English/Scottish clubs using P118 (league) or P17 (country) with LIMIT
async function queryByLetter(countryQid, letter) {
  const sparql = `
SELECT ?club ?clubLabel ?inception WHERE {
  ?club wdt:P31/wdt:P279* wd:Q476028 .
  ?club wdt:P17 wd:${countryQid} .
  ?club wdt:P571 ?inception .
  ?club rdfs:label ?label .
  FILTER(LANG(?label) = "en")
  FILTER(STRSTARTS(LCASE(?label), "${letter}"))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 500
  `.trim();

  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "FutebolQuiz/1.0 (diogenes@gdsfactory.com)",
        "Accept": "application/sparql-results+json",
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      console.error(`    HTTP ${res.status} for letter "${letter}"`);
      return [];
    }

    const data = await res.json();
    return data.results.bindings.map(b => ({
      name: b.clubLabel?.value || "",
      year: new Date(b.inception?.value).getFullYear(),
    })).filter(c => c.year > 1800 && c.year < 2030);
  } catch (err) {
    console.error(`    Error for letter "${letter}": ${err.message}`);
    return [];
  }
}

function findMatch(teamName, wikidataClubs) {
  const normTeam = normalize(teamName);

  for (const club of wikidataClubs) {
    if (normalize(club.name) === normTeam) return club.year;
  }
  for (const club of wikidataClubs) {
    const normClub = normalize(club.name);
    if (normClub.includes(normTeam) || normTeam.includes(normClub)) {
      if (normClub.length > 2 && normTeam.length > 2) return club.year;
    }
  }
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
  const configs = [
    { country: "England", qid: "Q21" },
    { country: "Scotland", qid: "Q22" },
  ];

  const results = {};
  let totalFound = 0;

  for (const { country, qid } of configs) {
    const teams = getTeamsForCountry(country);
    if (teams.length === 0) { console.log(`${country}: no teams to look up`); continue; }
    console.log(`\n🌍 ${country}: ${teams.length} teams`);

    // Collect all wikidata clubs by querying letter by letter
    const allClubs = [];
    const letters = "abcdefghijklmnopqrstuvwxyz0123456789".split("");

    for (const letter of letters) {
      const clubs = await queryByLetter(qid, letter);
      if (clubs.length > 0) {
        allClubs.push(...clubs);
        process.stdout.write(`${letter}:${clubs.length} `);
      }
      await sleep(800);
    }
    console.log(`\n  Total Wikidata clubs: ${allClubs.length}`);

    // Match teams
    let found = 0;
    for (const team of teams) {
      const year = findMatch(team.name, allClubs);
      if (year) {
        results[team.id] = year;
        found++;
      }
    }
    console.log(`  ✅ Matched: ${found}/${teams.length}`);
    totalFound += found;
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Total found: ${totalFound}`);

  if (totalFound > 0) {
    let content = readFileSync(TEAMS_PATH, "utf8");
    let updated = 0;
    for (const [id, year] of Object.entries(results)) {
      const pattern = new RegExp(`(\\{ id: "${id}",[^}]*foundedYear: )0(,)`);
      const newContent = content.replace(pattern, `$1${year}$2`);
      if (newContent !== content) {
        content = newContent;
        updated++;
      }
    }
    writeFileSync(TEAMS_PATH, content);
    console.log(`Updated ${updated} teams in teams.ts`);
  }
}

main().catch(console.error);
