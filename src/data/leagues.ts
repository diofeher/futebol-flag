import type { League } from "../types/league";

export function getLeagueName(id: string): string {
  return LEAGUES.find((l) => l.id === id)?.name ?? id;
}

export const LEAGUES: League[] = [
  // Brazil
  { id: "brasileirao", name: "Brasileirão Série A", country: "Brazil", continent: "South America" },

  // Argentina
  { id: "liga-profesional", name: "Liga Profesional", country: "Argentina", continent: "South America" },

  // Colombia
  { id: "liga-betplay", name: "Liga BetPlay", country: "Colombia", continent: "South America" },

  // Uruguay
  { id: "primera-division-uy", name: "Primera División", country: "Uruguay", continent: "South America" },

  // Chile
  { id: "primera-division-cl", name: "Primera División", country: "Chile", continent: "South America" },

  // England
  { id: "premier-league", name: "Premier League", country: "England", continent: "Europe" },

  // Spain
  { id: "la-liga", name: "La Liga", country: "Spain", continent: "Europe" },

  // Italy
  { id: "serie-a-it", name: "Serie A", country: "Italy", continent: "Europe" },

  // Germany
  { id: "bundesliga", name: "Bundesliga", country: "Germany", continent: "Europe" },

  // France
  { id: "ligue-1", name: "Ligue 1", country: "France", continent: "Europe" },

  // Portugal
  { id: "liga-portugal", name: "Liga Portugal", country: "Portugal", continent: "Europe" },

  // Netherlands
  { id: "eredivisie", name: "Eredivisie", country: "Netherlands", continent: "Europe" },

  // Mexico
  { id: "liga-mx", name: "Liga MX", country: "Mexico", continent: "North America" },

  // USA
  { id: "mls", name: "Major League Soccer", country: "USA", continent: "North America" },
];
