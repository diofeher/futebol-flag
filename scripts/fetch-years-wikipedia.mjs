#!/usr/bin/env node
/**
 * Fetch founding years using Wikipedia API.
 * Searches for each club's Wikipedia page and extracts founding year from infobox.
 * Much faster than Wikidata SPARQL for individual lookups.
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEAMS_PATH = join(__dirname, "..", "src", "data", "teams.ts");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getTeamsWithoutYear() {
  const content = readFileSync(TEAMS_PATH, "utf8");
  const regex = /\{ id: "([^"]+)", name: "([^"]+)",[^}]*country: "([^"]+)",[^}]*foundedYear: 0/g;
  const teams = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    teams.push({ id: m[1], name: m[2], country: m[3] });
  }
  return teams;
}

async function searchWikipedia(teamName, country) {
  // Search for the team's Wikipedia page
  const searchTerms = [
    `${teamName} football club`,
    `${teamName} F.C.`,
    teamName,
  ];

  for (const term of searchTerms) {
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&srlimit=3&format=json`;
      const res = await fetch(url, {
        headers: { "User-Agent": "FutebolQuiz/1.0 (diogenes@gdsfactory.com)" },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) continue;

      const data = await res.json();
      const results = data.query?.search || [];

      for (const result of results) {
        // Check if title looks like a football club
        const title = result.title;
        const snippet = result.snippet.toLowerCase();

        // Extract year from snippet — look for "founded" or "established" patterns
        const foundedMatch = snippet.match(/(?:founded|established|formed)\s*(?:in\s*)?(\d{4})/);
        if (foundedMatch) {
          const year = parseInt(foundedMatch[1]);
          if (year > 1800 && year < 2030) return { year, source: "snippet" };
        }
      }

      // If snippet didn't have it, try fetching the actual page extract
      if (results.length > 0) {
        const pageTitle = results[0].title;
        const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=extracts&exintro=true&explaintext=true&format=json`;
        const extractRes = await fetch(extractUrl, {
          headers: { "User-Agent": "FutebolQuiz/1.0 (diogenes@gdsfactory.com)" },
          signal: AbortSignal.timeout(10000),
        });
        if (extractRes.ok) {
          const extractData = await extractRes.json();
          const pages = extractData.query?.pages || {};
          for (const page of Object.values(pages)) {
            const text = (page.extract || "").toLowerCase();
            // Look for "founded in YYYY" or "established in YYYY" or "formed in YYYY"
            const yearMatch = text.match(/(?:founded|established|formed|est\.|est )\s*(?:in\s*|on\s*(?:\d{1,2}\s+\w+\s+)?)(\d{4})/);
            if (yearMatch) {
              const year = parseInt(yearMatch[1]);
              if (year > 1800 && year < 2030) return { year, source: "extract" };
            }
            // Also try "YYYY" after "is a ... football club"
            const clubMatch = text.match(/football club.*?(\d{4})/);
            if (clubMatch) {
              const year = parseInt(clubMatch[1]);
              if (year > 1800 && year < 2030) return { year, source: "club-context" };
            }
          }
        }
      }

      // If first search term found results, don't try others
      if (results.length > 0) break;
    } catch {
      continue;
    }
  }

  return null;
}

async function main() {
  const teams = getTeamsWithoutYear();
  console.log(`Teams needing founding year: ${teams.length}\n`);

  const results = {};
  let found = 0;
  let failed = 0;

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    const result = await searchWikipedia(team.name, team.country);

    if (result) {
      results[team.id] = result.year;
      found++;
    } else {
      failed++;
    }

    if ((i + 1) % 25 === 0) {
      console.log(`  Progress: ${i + 1}/${teams.length} | Found: ${found} | Missing: ${failed}`);
    }

    await sleep(200); // Wikipedia rate limit
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Found: ${found} | Missing: ${failed}`);

  if (found > 0) {
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
