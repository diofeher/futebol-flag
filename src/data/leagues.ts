import type { League } from "../types/league";

export function getLeagueName(id: string): string {
  return LEAGUES.find((l) => l.id === id)?.name ?? id;
}

export const LEAGUES: League[] = [
  // Brazil
  { id: "brasileirao", name: "Brasileirão Série A", country: "Brazil", continent: "South America" },
  { id: "brasileirao-b", name: "Brasileirão Série B", country: "Brazil", continent: "South America" },
  { id: "brasileirao-c", name: "Brasileirão Série C", country: "Brazil", continent: "South America" },
  { id: "brasileirao-d", name: "Brasileirão Série D", country: "Brazil", continent: "South America" },
  { id: "paraibano", name: "Campeonato Paraibano", country: "Brazil", continent: "South America" },

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

  // International (auto-imported)
  { id: "austria", name: "Austrian Bundesliga", country: "Austria", continent: "Europe" },
  { id: "belgium", name: "Belgian Pro League", country: "Belgium", continent: "Europe" },
  { id: "bulgaria", name: "Bulgarian First League", country: "Bulgaria", continent: "Europe" },
  { id: "cyprus", name: "Cypriot First Division", country: "Cyprus", continent: "Europe" },
  { id: "czech-republic", name: "Czech First League", country: "Czech Republic", continent: "Europe" },
  { id: "denmark", name: "Danish Superliga", country: "Denmark", continent: "Europe" },
  { id: "egypt", name: "Egyptian Premier League", country: "Egypt", continent: "Africa" },
  { id: "finland", name: "Veikkausliiga", country: "Finland", continent: "Europe" },
  { id: "greece", name: "Super League Greece", country: "Greece", continent: "Europe" },
  { id: "hungary", name: "NB I", country: "Hungary", continent: "Europe" },
  { id: "india", name: "Indian Super League", country: "India", continent: "Asia" },
  { id: "indonesia", name: "Liga 1", country: "Indonesia", continent: "Asia" },
  { id: "iraq", name: "Iraqi Premier League", country: "Iraq", continent: "Asia" },
  { id: "israel", name: "Israeli Premier League", country: "Israel", continent: "Asia" },
  { id: "japan", name: "J1 League", country: "Japan", continent: "Asia" },
  { id: "norway", name: "Eliteserien", country: "Norway", continent: "Europe" },
  { id: "poland", name: "Ekstraklasa", country: "Poland", continent: "Europe" },
  { id: "republic-of-ireland", name: "League of Ireland", country: "Republic of Ireland", continent: "Europe" },
  { id: "romania", name: "Liga I", country: "Romania", continent: "Europe" },
  { id: "russia", name: "Russian Premier League", country: "Russia", continent: "Europe" },
  { id: "saudi-arabia", name: "Saudi Pro League", country: "Saudi Arabia", continent: "Asia" },
  { id: "scotland", name: "Scottish Premiership", country: "Scotland", continent: "Europe" },
  { id: "south-korea", name: "K League 1", country: "South Korea", continent: "Asia" },
  { id: "sweden", name: "Allsvenskan", country: "Sweden", continent: "Europe" },
  { id: "switzerland", name: "Swiss Super League", country: "Switzerland", continent: "Europe" },
  { id: "turkey", name: "Süper Lig", country: "Turkey", continent: "Europe" },
  { id: "ukraine", name: "Ukrainian Premier League", country: "Ukraine", continent: "Europe" },
  { id: "wales", name: "Cymru Premier", country: "Wales", continent: "Europe" },
];
