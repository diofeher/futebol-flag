import type { League } from "../types/league";

export function getLeagueName(id: string): string {
  return LEAGUES.find((l) => l.id === id)?.name ?? id;
}

export const LEAGUES: League[] = [
  // Brazil
  { id: "brasileirao", name: "Brasileirão Série A", country: "Brazil", continent: "South America", tier: "easy" },
  { id: "brasileirao-b", name: "Brasileirão Série B", country: "Brazil", continent: "South America", tier: "easy" },
  { id: "brasileirao-c", name: "Brasileirão Série C", country: "Brazil", continent: "South America", tier: "medium" },
  { id: "brasileirao-d", name: "Brasileirão Série D", country: "Brazil", continent: "South America", tier: "medium" },
  { id: "paraibano", name: "Campeonato Paraibano", country: "Brazil", continent: "South America", tier: "easy" },

  // Argentina
  { id: "liga-profesional", name: "Liga Profesional", country: "Argentina", continent: "South America", tier: "easy" },

  // Colombia
  { id: "liga-betplay", name: "Liga BetPlay", country: "Colombia", continent: "South America", tier: "medium" },

  // Uruguay
  { id: "primera-division-uy", name: "Primera División", country: "Uruguay", continent: "South America", tier: "medium" },

  // Chile
  { id: "primera-division-cl", name: "Primera División", country: "Chile", continent: "South America", tier: "medium" },

  // England
  { id: "premier-league", name: "Premier League", country: "England", continent: "Europe", tier: "easy" },

  // Spain
  { id: "la-liga", name: "La Liga", country: "Spain", continent: "Europe", tier: "easy" },

  // Italy
  { id: "serie-a-it", name: "Serie A", country: "Italy", continent: "Europe", tier: "easy" },

  // Germany
  { id: "bundesliga", name: "Bundesliga", country: "Germany", continent: "Europe", tier: "easy" },

  // France
  { id: "ligue-1", name: "Ligue 1", country: "France", continent: "Europe", tier: "easy" },

  // Portugal
  { id: "liga-portugal", name: "Liga Portugal", country: "Portugal", continent: "Europe", tier: "medium" },

  // Netherlands
  { id: "eredivisie", name: "Eredivisie", country: "Netherlands", continent: "Europe", tier: "medium" },

  // Mexico
  { id: "liga-mx", name: "Liga MX", country: "Mexico", continent: "North America", tier: "easy" },

  // USA
  { id: "mls", name: "Major League Soccer", country: "USA", continent: "North America", tier: "easy" },

  // International (auto-imported)
  { id: "austria", name: "Austrian Bundesliga", country: "Austria", continent: "Europe", tier: "medium" },
  { id: "belgium", name: "Belgian Pro League", country: "Belgium", continent: "Europe", tier: "medium" },
  { id: "bulgaria", name: "Bulgarian First League", country: "Bulgaria", continent: "Europe", tier: "hard" },
  { id: "cyprus", name: "Cypriot First Division", country: "Cyprus", continent: "Europe", tier: "hard" },
  { id: "czech-republic", name: "Czech First League", country: "Czech Republic", continent: "Europe", tier: "medium" },
  { id: "denmark", name: "Danish Superliga", country: "Denmark", continent: "Europe", tier: "medium" },
  { id: "egypt", name: "Egyptian Premier League", country: "Egypt", continent: "Africa", tier: "medium" },
  { id: "finland", name: "Veikkausliiga", country: "Finland", continent: "Europe", tier: "hard" },
  { id: "greece", name: "Super League Greece", country: "Greece", continent: "Europe", tier: "medium" },
  { id: "hungary", name: "NB I", country: "Hungary", continent: "Europe", tier: "hard" },
  { id: "india", name: "Indian Super League", country: "India", continent: "Asia", tier: "hard" },
  { id: "indonesia", name: "Liga 1", country: "Indonesia", continent: "Asia", tier: "hard" },
  { id: "iraq", name: "Iraqi Premier League", country: "Iraq", continent: "Asia", tier: "hard" },
  { id: "israel", name: "Israeli Premier League", country: "Israel", continent: "Asia", tier: "medium" },
  { id: "japan", name: "J1 League", country: "Japan", continent: "Asia", tier: "medium" },
  { id: "norway", name: "Eliteserien", country: "Norway", continent: "Europe", tier: "medium" },
  { id: "poland", name: "Ekstraklasa", country: "Poland", continent: "Europe", tier: "medium" },
  { id: "republic-of-ireland", name: "League of Ireland", country: "Republic of Ireland", continent: "Europe", tier: "hard" },
  { id: "romania", name: "Liga I", country: "Romania", continent: "Europe", tier: "hard" },
  { id: "russia", name: "Russian Premier League", country: "Russia", continent: "Europe", tier: "medium" },
  { id: "saudi-arabia", name: "Saudi Pro League", country: "Saudi Arabia", continent: "Asia", tier: "medium" },
  { id: "scotland", name: "Scottish Premiership", country: "Scotland", continent: "Europe", tier: "medium" },
  { id: "south-korea", name: "K League 1", country: "South Korea", continent: "Asia", tier: "medium" },
  { id: "sweden", name: "Allsvenskan", country: "Sweden", continent: "Europe", tier: "medium" },
  { id: "switzerland", name: "Swiss Super League", country: "Switzerland", continent: "Europe", tier: "medium" },
  { id: "turkey", name: "Süper Lig", country: "Turkey", continent: "Europe", tier: "medium" },
  { id: "ukraine", name: "Ukrainian Premier League", country: "Ukraine", continent: "Europe", tier: "hard" },
  { id: "wales", name: "Cymru Premier", country: "Wales", continent: "Europe", tier: "hard" },
];
