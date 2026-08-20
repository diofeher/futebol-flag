#!/usr/bin/env node
/**
 * Read football-logos-manifest.json and:
 * 1. Add new league entries to leagues.ts
 * 2. Add new team entries to teams.ts
 * 3. Remove from PLACEHOLDER_IDS any teams that now have PNGs
 *
 * Only adds teams marked isNew in the manifest.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MANIFEST_PATH = join(__dirname, "football-logos-manifest.json");
const TEAMS_PATH = join(ROOT, "src", "data", "teams.ts");
const LEAGUES_PATH = join(ROOT, "src", "data", "leagues.ts");
const BADGES_DIR = join(ROOT, "public", "badges");

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

const EXISTING_LEAGUES = new Set([
  "brasileirao", "brasileirao-b", "brasileirao-c", "brasileirao-d", "paraibano",
  "liga-profesional", "liga-betplay", "primera-division-uy", "primera-division-cl",
  "premier-league", "la-liga", "serie-a-it", "bundesliga", "ligue-1",
  "liga-portugal", "eredivisie", "liga-mx", "mls",
]);

function main() {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  console.log(`Total clubs in manifest: ${manifest.length}`);

  // Only new clubs that actually have a downloaded PNG
  const newClubs = manifest.filter(c => {
    if (!c.isNew) return false;
    const pngPath = join(BADGES_DIR, c.leagueId, `${c.slug}.png`);
    return existsSync(pngPath);
  });
  console.log(`New clubs with PNGs: ${newClubs.length}`);

  // Deduplicate by slug (in case manifest has dupes)
  const seen = new Set();
  const uniqueClubs = newClubs.filter(c => {
    if (seen.has(c.slug)) return false;
    seen.add(c.slug);
    return true;
  });
  console.log(`Unique new clubs: ${uniqueClubs.length}`);

  // Group by leagueId
  const byLeague = {};
  for (const club of uniqueClubs) {
    if (!byLeague[club.leagueId]) byLeague[club.leagueId] = [];
    byLeague[club.leagueId].push(club);
  }

  // ---- Update leagues.ts ----
  const newLeagueIds = Object.keys(byLeague).filter(l => !EXISTING_LEAGUES.has(l)).sort();
  if (newLeagueIds.length > 0) {
    let leaguesContent = readFileSync(LEAGUES_PATH, "utf8");
    const newLeagueLines = newLeagueIds.map(leagueId => {
      const info = COUNTRY_INFO[leagueId];
      const leagueName = LEAGUE_NAMES[leagueId] || `${info?.name || leagueId} League`;
      const country = info?.name || leagueId;
      const continent = info?.continent || "Unknown";
      return `  { id: "${leagueId}", name: "${leagueName}", country: "${country}", continent: "${continent}" },`;
    });

    // Insert before the closing ];
    leaguesContent = leaguesContent.replace(
      /\n];\s*$/,
      "\n\n  // International (auto-imported)\n" + newLeagueLines.join("\n") + "\n];\n"
    );
    writeFileSync(LEAGUES_PATH, leaguesContent);
    console.log(`Added ${newLeagueIds.length} new leagues to leagues.ts`);
  }

  // ---- Update teams.ts ----
  let teamsContent = readFileSync(TEAMS_PATH, "utf8");

  // Build team entries grouped by league
  const teamLines = [];
  for (const [leagueId, clubs] of Object.entries(byLeague).sort((a, b) => a[0].localeCompare(b[0]))) {
    const info = COUNTRY_INFO[clubs[0].country];
    const countryName = info?.name || clubs[0].country;
    teamLines.push("");
    teamLines.push(`  // ===== ${countryName.toUpperCase()} (${leagueId}) =====`);

    for (const club of clubs.sort((a, b) => a.name.localeCompare(b.name))) {
      // Generate shortName: uppercase letters from name, or first 3 chars of slug
      let shortName = club.name.replace(/[^A-Z]/g, "").slice(0, 3);
      if (shortName.length < 2) shortName = club.slug.replace(/-/g, "").slice(0, 3).toUpperCase();
      const escapedName = club.name.replace(/"/g, '\\"');
      teamLines.push(`  { id: "${club.slug}", name: "${escapedName}", shortName: "${shortName}", city: "", state: "", country: "${countryName}", leagueId: "${leagueId}", foundedYear: 0, badgeUrl: badge("${leagueId}", "${club.slug}", "png"), colors: ["#333333", "#FFFFFF"] },`);
    }
  }

  // Insert before the closing ];
  teamsContent = teamsContent.replace(
    /\n];\n\n\/\/ Teams without/,
    teamLines.join("\n") + "\n];\n\n// Teams without"
  );
  writeFileSync(TEAMS_PATH, teamsContent);
  console.log(`Added ${uniqueClubs.length} new team entries to teams.ts`);

  // ---- Check which PLACEHOLDER_IDS now have real PNGs ----
  const placeholderMatch = teamsContent.match(/const PLACEHOLDER_IDS = new Set\(\[\n([\s\S]*?)\n\]\)/);
  if (placeholderMatch) {
    const idRegex = /"([^"]+)"/g;
    let m;
    const resolved = [];
    while ((m = idRegex.exec(placeholderMatch[1])) !== null) {
      const id = m[1];
      // Find this team's leagueId
      const teamMatch = teamsContent.match(new RegExp(`id:\\s*"${id}"[^}]*leagueId:\\s*"([^"]+)"`));
      if (teamMatch) {
        const lid = teamMatch[1];
        if (existsSync(join(BADGES_DIR, lid, `${id}.png`))) {
          resolved.push(id);
        }
      }
    }
    if (resolved.length > 0) {
      console.log(`\nPlaceholder IDs that now have PNGs (remove from PLACEHOLDER_IDS):`);
      resolved.forEach(id => console.log(`  - ${id}`));
    }
  }

  // Summary
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Done!`);
  console.log(`  New leagues: ${newLeagueIds.length}`);
  console.log(`  New teams: ${uniqueClubs.length}`);

  // Count per league
  for (const [leagueId, clubs] of Object.entries(byLeague).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`    ${leagueId}: ${clubs.length}`);
  }
}

main();
