#!/usr/bin/env node
/**
 * Read football-logos-manifest.json and generate:
 * 1. New league entries for leagues.ts
 * 2. New team entries for teams.ts
 *
 * Only adds teams NOT already in teams.ts (isNew === true in manifest).
 * Outputs generated code to stdout for manual review before pasting.
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = join(__dirname, "football-logos-manifest.json");

// Country slug → display name + continent
const COUNTRY_INFO = {
  "argentina": { name: "Argentina", continent: "South America" },
  "austria": { name: "Austria", continent: "Europe" },
  "belgium": { name: "Belgium", continent: "Europe" },
  "bulgaria": { name: "Bulgaria", continent: "Europe" },
  "colombia": { name: "Colombia", continent: "South America" },
  "cyprus": { name: "Cyprus", continent: "Europe" },
  "czech-republic": { name: "Czech Republic", continent: "Europe" },
  "denmark": { name: "Denmark", continent: "Europe" },
  "egypt": { name: "Egypt", continent: "Africa" },
  "england": { name: "England", continent: "Europe" },
  "finland": { name: "Finland", continent: "Europe" },
  "france": { name: "France", continent: "Europe" },
  "germany": { name: "Germany", continent: "Europe" },
  "greece": { name: "Greece", continent: "Europe" },
  "hungary": { name: "Hungary", continent: "Europe" },
  "india": { name: "India", continent: "Asia" },
  "indonesia": { name: "Indonesia", continent: "Asia" },
  "iraq": { name: "Iraq", continent: "Asia" },
  "israel": { name: "Israel", continent: "Asia" },
  "italy": { name: "Italy", continent: "Europe" },
  "japan": { name: "Japan", continent: "Asia" },
  "mexico": { name: "Mexico", continent: "North America" },
  "netherlands": { name: "Netherlands", continent: "Europe" },
  "norway": { name: "Norway", continent: "Europe" },
  "poland": { name: "Poland", continent: "Europe" },
  "portugal": { name: "Portugal", continent: "Europe" },
  "republic-of-ireland": { name: "Republic of Ireland", continent: "Europe" },
  "romania": { name: "Romania", continent: "Europe" },
  "russia": { name: "Russia", continent: "Europe" },
  "saudi-arabia": { name: "Saudi Arabia", continent: "Asia" },
  "scotland": { name: "Scotland", continent: "Europe" },
  "south-korea": { name: "South Korea", continent: "Asia" },
  "spain": { name: "Spain", continent: "Europe" },
  "sweden": { name: "Sweden", continent: "Europe" },
  "switzerland": { name: "Switzerland", continent: "Europe" },
  "turkey": { name: "Turkey", continent: "Europe" },
  "ukraine": { name: "Ukraine", continent: "Europe" },
  "usa": { name: "USA", continent: "North America" },
  "wales": { name: "Wales", continent: "Europe" },
};

// League display names for countries using country slug as leagueId
const LEAGUE_NAMES = {
  "austria": "Austrian Bundesliga",
  "belgium": "Belgian Pro League",
  "bulgaria": "Bulgarian First League",
  "cyprus": "Cypriot First Division",
  "czech-republic": "Czech First League",
  "denmark": "Danish Superliga",
  "egypt": "Egyptian Premier League",
  "finland": "Veikkausliiga",
  "greece": "Super League Greece",
  "hungary": "NB I",
  "india": "Indian Super League",
  "indonesia": "Liga 1",
  "iraq": "Iraqi Premier League",
  "israel": "Israeli Premier League",
  "japan": "J1 League",
  "norway": "Eliteserien",
  "poland": "Ekstraklasa",
  "republic-of-ireland": "League of Ireland",
  "romania": "Liga I",
  "russia": "Russian Premier League",
  "saudi-arabia": "Saudi Pro League",
  "scotland": "Scottish Premiership",
  "south-korea": "K League 1",
  "sweden": "Allsvenskan",
  "switzerland": "Swiss Super League",
  "turkey": "Süper Lig",
  "ukraine": "Ukrainian Premier League",
  "wales": "Cymru Premier",
};

// Existing leagues (don't regenerate these)
const EXISTING_LEAGUES = new Set([
  "brasileirao", "brasileirao-b", "brasileirao-c", "brasileirao-d", "paraibano",
  "liga-profesional", "liga-betplay", "primera-division-uy", "primera-division-cl",
  "premier-league", "la-liga", "serie-a-it", "bundesliga", "ligue-1",
  "liga-portugal", "eredivisie", "liga-mx", "mls",
]);

function main() {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));

  console.log(`Total clubs in manifest: ${manifest.length}`);

  const newClubs = manifest.filter(c => c.isNew);
  console.log(`New clubs (not in teams.ts): ${newClubs.length}`);

  // Group by leagueId
  const byLeague = {};
  for (const club of newClubs) {
    if (!byLeague[club.leagueId]) byLeague[club.leagueId] = [];
    byLeague[club.leagueId].push(club);
  }

  // Find new leagues needed
  const newLeagues = Object.keys(byLeague).filter(l => !EXISTING_LEAGUES.has(l));

  console.log(`\nNew leagues needed: ${newLeagues.length}`);
  console.log(newLeagues.join(", "));

  // Generate league entries
  console.log("\n\n// ===== NEW LEAGUE ENTRIES FOR leagues.ts =====\n");
  for (const leagueId of newLeagues.sort()) {
    const info = COUNTRY_INFO[leagueId];
    const leagueName = LEAGUE_NAMES[leagueId] || `${info?.name || leagueId} League`;
    const country = info?.name || leagueId;
    const continent = info?.continent || "Unknown";
    console.log(`  { id: "${leagueId}", name: "${leagueName}", country: "${country}", continent: "${continent}" },`);
  }

  // Generate team entries
  console.log("\n\n// ===== NEW TEAM ENTRIES FOR teams.ts =====\n");

  for (const [leagueId, clubs] of Object.entries(byLeague).sort((a, b) => a[0].localeCompare(b[0]))) {
    const info = COUNTRY_INFO[clubs[0].country];
    const countryName = info?.name || clubs[0].country;
    console.log(`  // ===== ${countryName.toUpperCase()} (${leagueId}) =====`);

    for (const club of clubs.sort((a, b) => a.name.localeCompare(b.name))) {
      const shortName = club.name.replace(/[^A-Z]/g, "").slice(0, 3) || club.slug.slice(0, 3).toUpperCase();
      const escapedName = club.name.replace(/"/g, '\\"');
      console.log(`  { id: "${club.slug}", name: "${escapedName}", shortName: "${shortName}", city: "", state: "", country: "${countryName}", leagueId: "${leagueId}", foundedYear: 0, badgeUrl: badge("${leagueId}", "${club.slug}", "png"), colors: ["#333333", "#FFFFFF"] },`);
    }
    console.log("");
  }

  // Summary stats
  console.log("\n// ===== SUMMARY =====");
  console.log(`// Total new teams: ${newClubs.length}`);
  console.log(`// New leagues: ${newLeagues.length}`);
  for (const [leagueId, clubs] of Object.entries(byLeague).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`//   ${leagueId}: ${clubs.length} clubs`);
  }
}

main();
