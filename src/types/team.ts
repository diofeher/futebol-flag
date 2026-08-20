export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  country: string;
  leagueId: string;
  foundedYear: number;
  badgeUrl: string;
  colors: [string, string];
}
