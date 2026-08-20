#!/usr/bin/env node
/**
 * Fetch founding years specifically for England and Scotland
 * using a simpler Wikidata query that won't timeout.
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEAMS_PATH = join(__dirname, "..", "src", "data", "teams.ts");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function normalize(name) {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

// Query for a specific club by name — more reliable than batch
async function queryClubYear(clubName, countryQid) {
  const sparql = `
SELECT ?club ?clubLabel ?inception WHERE {
  ?club wdt:P31/wdt:P279* wd:Q476028 .
  ?club wdt:P17 wd:${countryQid} .
  ?club wdt:P571 ?inception .
  ?club rdfs:label ?label .
  FILTER(LANG(?label) = "en")
  FILTER(CONTAINS(LCASE(?label), "${normalize(clubName).replace(/'/g, "\\'")}"))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 5
  `.trim();

  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "FutebolQuiz/1.0 (diogenes@gdsfactory.com)",
        "Accept": "application/sparql-results+json",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const results = data.results.bindings
      .map(b => ({
        name: b.clubLabel?.value || "",
        year: new Date(b.inception?.value).getFullYear(),
      }))
      .filter(c => c.year > 1800 && c.year < 2030);

    if (results.length === 0) return null;

    // Find best match
    const normTeam = normalize(clubName);
    const exact = results.find(r => normalize(r.name) === normTeam);
    if (exact) return exact.year;

    // Return first result if name contains our search
    return results[0].year;
  } catch {
    return null;
  }
}

async function main() {
  const countries = [
    { name: "England", qid: "Q21" },
    { name: "Scotland", qid: "Q22" },
  ];

  let totalFound = 0;
  const results = {};

  for (const { name: country, qid } of countries) {
    const teams = getTeamsForCountry(country);
    console.log(`\n🌍 ${country}: ${teams.length} teams to look up`);

    let found = 0;
    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      // Use the key part of the name for searching
      let searchName = team.name
        .replace(/^(AFC|FC|CF|SC|AC|AS|SS|SV|SK|FK|IF|BK|IK)\s+/i, "")
        .replace(/\s+(FC|CF|SC|AC|AFC|United|City|Town|Rovers|Wanderers|Athletic|Albion)$/i, "")
        .trim();
      if (searchName.length < 3) searchName = team.name;

      const year = await queryClubYear(searchName, qid);
      if (year) {
        results[team.id] = year;
        found++;
        if (found % 10 === 0) console.log(`  ${found} found so far... (${i + 1}/${teams.length})`);
      }

      await sleep(500); // Rate limit
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
