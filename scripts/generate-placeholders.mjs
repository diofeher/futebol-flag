#!/usr/bin/env node
/**
 * Generate placeholder SVG badges for all teams that don't have one yet.
 * Reads team data from teams.ts and creates shield-shaped SVGs with
 * team colors and short name abbreviation.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BADGES_DIR = join(__dirname, "..", "public", "badges");
const TEAMS_FILE = join(__dirname, "..", "src", "data", "teams.ts");

function generatePlaceholderSvg(shortName, color1, color2) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </linearGradient>
  </defs>
  <path d="M50 5 L95 20 L95 60 Q95 100 50 115 Q5 100 5 60 L5 20 Z" fill="url(#g)" stroke="#000000" stroke-width="2"/>
  <text x="50" y="68" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="bold" fill="white" stroke="none" stroke-width="0.5">${shortName}</text>
</svg>`;
}

function parseTeams() {
  const content = readFileSync(TEAMS_FILE, "utf8");
  const teams = [];
  // Match each team object
  const regex = /\{\s*id:\s*"([^"]+)".*?shortName:\s*"([^"]+)".*?leagueId:\s*"([^"]+)".*?colors:\s*\["([^"]+)",\s*"([^"]+)"\]\s*\}/gs;
  let match;
  while ((match = regex.exec(content)) !== null) {
    teams.push({
      id: match[1],
      shortName: match[2],
      leagueId: match[3],
      color1: match[4],
      color2: match[5],
    });
  }
  return teams;
}

function main() {
  const teams = parseTeams();
  let created = 0;
  let skipped = 0;

  console.log(`Found ${teams.length} teams in teams.ts\n`);

  for (const team of teams) {
    const dir = join(BADGES_DIR, team.leagueId);
    const filePath = join(dir, `${team.id}.svg`);

    if (existsSync(filePath)) {
      skipped++;
      continue;
    }

    mkdirSync(dir, { recursive: true });
    const svg = generatePlaceholderSvg(team.shortName, team.color1, team.color2);
    writeFileSync(filePath, svg);
    console.log(`✅ Created: ${team.leagueId}/${team.id}.svg`);
    created++;
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Done! ✅ ${created} created | ⏭️  ${skipped} already existed | Total: ${teams.length}`);
}

main();
