import type { Team } from "../types/team";

const BASE = import.meta.env.BASE_URL;

function badge(leagueId: string, teamId: string): string {
  return `${BASE}badges/${leagueId}/${teamId}.svg`;
}

export const TEAMS: Team[] = [
  // ===== BRASILEIRÃO =====
  { id: "flamengo", name: "Flamengo", shortName: "FLA", city: "Rio de Janeiro", state: "Rio de Janeiro", country: "Brazil", leagueId: "brasileirao", foundedYear: 1895, badgeUrl: badge("brasileirao", "flamengo"), colors: ["#B71C1C", "#000000"] },
  { id: "palmeiras", name: "Palmeiras", shortName: "PAL", city: "São Paulo", state: "São Paulo", country: "Brazil", leagueId: "brasileirao", foundedYear: 1914, badgeUrl: badge("brasileirao", "palmeiras"), colors: ["#006400", "#FFFFFF"] },
  { id: "corinthians", name: "Corinthians", shortName: "COR", city: "São Paulo", state: "São Paulo", country: "Brazil", leagueId: "brasileirao", foundedYear: 1910, badgeUrl: badge("brasileirao", "corinthians"), colors: ["#000000", "#FFFFFF"] },
  { id: "sao-paulo", name: "São Paulo FC", shortName: "SAO", city: "São Paulo", state: "São Paulo", country: "Brazil", leagueId: "brasileirao", foundedYear: 1930, badgeUrl: badge("brasileirao", "sao-paulo"), colors: ["#FF0000", "#FFFFFF"] },
  { id: "santos", name: "Santos FC", shortName: "SAN", city: "Santos", state: "São Paulo", country: "Brazil", leagueId: "brasileirao", foundedYear: 1912, badgeUrl: badge("brasileirao", "santos"), colors: ["#FFFFFF", "#000000"] },
  { id: "fluminense", name: "Fluminense", shortName: "FLU", city: "Rio de Janeiro", state: "Rio de Janeiro", country: "Brazil", leagueId: "brasileirao", foundedYear: 1902, badgeUrl: badge("brasileirao", "fluminense"), colors: ["#7B1B3A", "#006400"] },
  { id: "vasco", name: "Vasco da Gama", shortName: "VAS", city: "Rio de Janeiro", state: "Rio de Janeiro", country: "Brazil", leagueId: "brasileirao", foundedYear: 1898, badgeUrl: badge("brasileirao", "vasco"), colors: ["#000000", "#FFFFFF"] },
  { id: "botafogo", name: "Botafogo", shortName: "BOT", city: "Rio de Janeiro", state: "Rio de Janeiro", country: "Brazil", leagueId: "brasileirao", foundedYear: 1904, badgeUrl: badge("brasileirao", "botafogo"), colors: ["#000000", "#FFFFFF"] },
  { id: "gremio", name: "Grêmio", shortName: "GRE", city: "Porto Alegre", state: "Rio Grande do Sul", country: "Brazil", leagueId: "brasileirao", foundedYear: 1903, badgeUrl: badge("brasileirao", "gremio"), colors: ["#0066CC", "#000000"] },
  { id: "internacional", name: "Internacional", shortName: "INT", city: "Porto Alegre", state: "Rio Grande do Sul", country: "Brazil", leagueId: "brasileirao", foundedYear: 1909, badgeUrl: badge("brasileirao", "internacional"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "atletico-mg", name: "Atlético Mineiro", shortName: "CAM", city: "Belo Horizonte", state: "Minas Gerais", country: "Brazil", leagueId: "brasileirao", foundedYear: 1908, badgeUrl: badge("brasileirao", "atletico-mg"), colors: ["#000000", "#FFFFFF"] },
  { id: "cruzeiro", name: "Cruzeiro", shortName: "CRU", city: "Belo Horizonte", state: "Minas Gerais", country: "Brazil", leagueId: "brasileirao", foundedYear: 1921, badgeUrl: badge("brasileirao", "cruzeiro"), colors: ["#003399", "#FFFFFF"] },
  { id: "bahia", name: "Bahia", shortName: "BAH", city: "Salvador", state: "Bahia", country: "Brazil", leagueId: "brasileirao", foundedYear: 1931, badgeUrl: badge("brasileirao", "bahia"), colors: ["#0047AB", "#CC0000"] },
  { id: "fortaleza", name: "Fortaleza", shortName: "FOR", city: "Fortaleza", state: "Ceará", country: "Brazil", leagueId: "brasileirao", foundedYear: 1918, badgeUrl: badge("brasileirao", "fortaleza"), colors: ["#0033A0", "#CC0000"] },
  { id: "athletico-pr", name: "Athletico Paranaense", shortName: "CAP", city: "Curitiba", state: "Paraná", country: "Brazil", leagueId: "brasileirao", foundedYear: 1924, badgeUrl: badge("brasileirao", "athletico-pr"), colors: ["#CC0000", "#000000"] },
  { id: "coritiba", name: "Coritiba", shortName: "CFC", city: "Curitiba", state: "Paraná", country: "Brazil", leagueId: "brasileirao", foundedYear: 1909, badgeUrl: badge("brasileirao", "coritiba"), colors: ["#006400", "#FFFFFF"] },
  { id: "sport", name: "Sport Recife", shortName: "SPT", city: "Recife", state: "Pernambuco", country: "Brazil", leagueId: "brasileirao", foundedYear: 1905, badgeUrl: badge("brasileirao", "sport"), colors: ["#CC0000", "#000000"] },
  { id: "vitoria", name: "Vitória", shortName: "VIT", city: "Salvador", state: "Bahia", country: "Brazil", leagueId: "brasileirao", foundedYear: 1899, badgeUrl: badge("brasileirao", "vitoria"), colors: ["#CC0000", "#000000"] },
  { id: "ceara", name: "Ceará SC", shortName: "CEA", city: "Fortaleza", state: "Ceará", country: "Brazil", leagueId: "brasileirao", foundedYear: 1914, badgeUrl: badge("brasileirao", "ceara"), colors: ["#000000", "#FFFFFF"] },
  { id: "goias", name: "Goiás", shortName: "GOI", city: "Goiânia", state: "Goiás", country: "Brazil", leagueId: "brasileirao", foundedYear: 1943, badgeUrl: badge("brasileirao", "goias"), colors: ["#006400", "#FFFFFF"] },

  // Série A extras (2025 promoted/returning)
  { id: "juventude", name: "Juventude", shortName: "JUV", city: "Caxias do Sul", state: "Rio Grande do Sul", country: "Brazil", leagueId: "brasileirao", foundedYear: 1913, badgeUrl: badge("brasileirao", "juventude"), colors: ["#006400", "#FFFFFF"] },
  { id: "mirassol", name: "Mirassol", shortName: "MIR", city: "Mirassol", state: "São Paulo", country: "Brazil", leagueId: "brasileirao", foundedYear: 1925, badgeUrl: badge("brasileirao", "mirassol"), colors: ["#FFD700", "#006400"] },
  { id: "rb-bragantino", name: "RB Bragantino", shortName: "RBB", city: "Bragança Paulista", state: "São Paulo", country: "Brazil", leagueId: "brasileirao", foundedYear: 1928, badgeUrl: badge("brasileirao", "rb-bragantino"), colors: ["#CC0000", "#FFFFFF"] },

  // ===== BRASILEIRÃO SÉRIE B =====
  { id: "amazonas", name: "Amazonas FC", shortName: "AMA", city: "Manaus", state: "Amazonas", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 2019, badgeUrl: badge("brasileirao-b", "amazonas"), colors: ["#FFD700", "#000000"] },
  { id: "america-mg", name: "América Mineiro", shortName: "AMG", city: "Belo Horizonte", state: "Minas Gerais", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 1912, badgeUrl: badge("brasileirao-b", "america-mg"), colors: ["#006400", "#FFFFFF"] },
  { id: "athletic-mg", name: "Athletic Club", shortName: "ATC", city: "São João del-Rei", state: "Minas Gerais", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 1909, badgeUrl: badge("brasileirao-b", "athletic-mg"), colors: ["#B71C1C", "#000000"] },
  { id: "atletico-go", name: "Atlético Goianiense", shortName: "ACG", city: "Goiânia", state: "Goiás", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 1937, badgeUrl: badge("brasileirao-b", "atletico-go"), colors: ["#CC0000", "#000000"] },
  { id: "avai", name: "Avaí", shortName: "AVA", city: "Florianópolis", state: "Santa Catarina", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 1923, badgeUrl: badge("brasileirao-b", "avai"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "botafogo-sp", name: "Botafogo-SP", shortName: "BSP", city: "Ribeirão Preto", state: "São Paulo", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 1918, badgeUrl: badge("brasileirao-b", "botafogo-sp"), colors: ["#CC0000", "#000000"] },
  { id: "chapecoense", name: "Chapecoense", shortName: "CHA", city: "Chapecó", state: "Santa Catarina", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 1973, badgeUrl: badge("brasileirao-b", "chapecoense"), colors: ["#006400", "#FFFFFF"] },
  { id: "crb", name: "CRB", shortName: "CRB", city: "Maceió", state: "Alagoas", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 1912, badgeUrl: badge("brasileirao-b", "crb"), colors: ["#CC0000", "#003DA5"] },
  { id: "criciuma", name: "Criciúma", shortName: "CRI", city: "Criciúma", state: "Santa Catarina", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 1947, badgeUrl: badge("brasileirao-b", "criciuma"), colors: ["#FFD700", "#000000"] },
  { id: "cuiaba", name: "Cuiabá EC", shortName: "CUI", city: "Cuiabá", state: "Mato Grosso", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 2001, badgeUrl: badge("brasileirao-b", "cuiaba"), colors: ["#006400", "#FFD700"] },
  { id: "ferroviaria", name: "Ferroviária", shortName: "FER", city: "Araraquara", state: "São Paulo", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 1950, badgeUrl: badge("brasileirao-b", "ferroviaria"), colors: ["#6A0DAD", "#FFFFFF"] },
  { id: "novorizontino", name: "Novorizontino", shortName: "NOV", city: "Novo Horizonte", state: "São Paulo", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 2010, badgeUrl: badge("brasileirao-b", "novorizontino"), colors: ["#FFD700", "#006400"] },
  { id: "operario-pr", name: "Operário Ferroviário", shortName: "OPR", city: "Ponta Grossa", state: "Paraná", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 1912, badgeUrl: badge("brasileirao-b", "operario-pr"), colors: ["#000000", "#FFFFFF"] },
  { id: "paysandu", name: "Paysandu", shortName: "PAY", city: "Belém", state: "Pará", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 1914, badgeUrl: badge("brasileirao-b", "paysandu"), colors: ["#87CEEB", "#FFFFFF"] },
  { id: "remo", name: "Clube do Remo", shortName: "REM", city: "Belém", state: "Pará", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 1905, badgeUrl: badge("brasileirao-b", "remo"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "vila-nova", name: "Vila Nova", shortName: "VNO", city: "Goiânia", state: "Goiás", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 1943, badgeUrl: badge("brasileirao-b", "vila-nova"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "volta-redonda", name: "Volta Redonda FC", shortName: "VRE", city: "Volta Redonda", state: "Rio de Janeiro", country: "Brazil", leagueId: "brasileirao-b", foundedYear: 1976, badgeUrl: badge("brasileirao-b", "volta-redonda"), colors: ["#000000", "#FFD700"] },

  // ===== BRASILEIRÃO SÉRIE C =====
  { id: "abc", name: "ABC", shortName: "ABC", city: "Natal", state: "Rio Grande do Norte", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1915, badgeUrl: badge("brasileirao-c", "abc"), colors: ["#FFFFFF", "#000000"] },
  { id: "anapolis", name: "Anápolis FC", shortName: "ANA", city: "Anápolis", state: "Goiás", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1946, badgeUrl: badge("brasileirao-c", "anapolis"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "botafogo-pb", name: "Botafogo-PB", shortName: "BPB", city: "João Pessoa", state: "Paraíba", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1931, badgeUrl: badge("brasileirao-c", "botafogo-pb"), colors: ["#000000", "#FFFFFF"] },
  { id: "brusque", name: "Brusque FC", shortName: "BRU", city: "Brusque", state: "Santa Catarina", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1987, badgeUrl: badge("brasileirao-c", "brusque"), colors: ["#FFD700", "#003DA5"] },
  { id: "caxias-rs", name: "SER Caxias", shortName: "CAX", city: "Caxias do Sul", state: "Rio Grande do Sul", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1935, badgeUrl: badge("brasileirao-c", "caxias-rs"), colors: ["#7B003C", "#FFFFFF"] },
  { id: "confianca", name: "Confiança", shortName: "CON", city: "Aracaju", state: "Sergipe", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1936, badgeUrl: badge("brasileirao-c", "confianca"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "csa", name: "CSA", shortName: "CSA", city: "Maceió", state: "Alagoas", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1913, badgeUrl: badge("brasileirao-c", "csa"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "figueirense", name: "Figueirense", shortName: "FIG", city: "Florianópolis", state: "Santa Catarina", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1921, badgeUrl: badge("brasileirao-c", "figueirense"), colors: ["#000000", "#FFFFFF"] },
  { id: "floresta", name: "Floresta EC", shortName: "FLO", city: "Fortaleza", state: "Ceará", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1954, badgeUrl: badge("brasileirao-c", "floresta"), colors: ["#006400", "#FFFFFF"] },
  { id: "guarani", name: "Guarani", shortName: "GUA", city: "Campinas", state: "São Paulo", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1911, badgeUrl: badge("brasileirao-c", "guarani"), colors: ["#006400", "#FFFFFF"] },
  { id: "itabaiana", name: "Itabaiana", shortName: "ITA", city: "Itabaiana", state: "Sergipe", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1938, badgeUrl: badge("brasileirao-c", "itabaiana"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "ituano", name: "Ituano", shortName: "ITU", city: "Itu", state: "São Paulo", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1947, badgeUrl: badge("brasileirao-c", "ituano"), colors: ["#CC0000", "#000000"] },
  { id: "londrina", name: "Londrina EC", shortName: "LON", city: "Londrina", state: "Paraná", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1956, badgeUrl: badge("brasileirao-c", "londrina"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "maringa", name: "Maringá FC", shortName: "MGA", city: "Maringá", state: "Paraná", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 2010, badgeUrl: badge("brasileirao-c", "maringa"), colors: ["#003DA5", "#CC0000"] },
  { id: "nautico", name: "Náutico", shortName: "NAU", city: "Recife", state: "Pernambuco", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1901, badgeUrl: badge("brasileirao-c", "nautico"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "ponte-preta", name: "Ponte Preta", shortName: "PON", city: "Campinas", state: "São Paulo", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1900, badgeUrl: badge("brasileirao-c", "ponte-preta"), colors: ["#000000", "#FFFFFF"] },
  { id: "retro", name: "Retrô FC", shortName: "RET", city: "Camaragibe", state: "Pernambuco", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 2016, badgeUrl: badge("brasileirao-c", "retro"), colors: ["#FFD700", "#000000"] },
  { id: "sao-bernardo", name: "São Bernardo FC", shortName: "SBC", city: "São Bernardo do Campo", state: "São Paulo", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 2004, badgeUrl: badge("brasileirao-c", "sao-bernardo"), colors: ["#FFD700", "#003DA5"] },
  { id: "tombense", name: "Tombense", shortName: "TOM", city: "Tombos", state: "Minas Gerais", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1914, badgeUrl: badge("brasileirao-c", "tombense"), colors: ["#CC0000", "#006400"] },
  { id: "ypiranga-rs", name: "Ypiranga", shortName: "YPI", city: "Erechim", state: "Rio Grande do Sul", country: "Brazil", leagueId: "brasileirao-c", foundedYear: 1924, badgeUrl: badge("brasileirao-c", "ypiranga-rs"), colors: ["#FFD700", "#006400"] },

  // ===== BRASILEIRÃO SÉRIE D =====
  // Group A1
  { id: "tuna-luso", name: "Tuna Luso", shortName: "TUN", city: "Belém", state: "Pará", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1903, badgeUrl: badge("brasileirao-d", "tuna-luso"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "manauara", name: "Manauara EC", shortName: "MNR", city: "Manaus", state: "Amazonas", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2020, badgeUrl: badge("brasileirao-d", "manauara"), colors: ["#CC0000", "#000000"] },
  { id: "manaus-fc", name: "Manaus FC", shortName: "MFC", city: "Manaus", state: "Amazonas", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2013, badgeUrl: badge("brasileirao-d", "manaus-fc"), colors: ["#006400", "#FFFFFF"] },
  { id: "independencia-ac", name: "Independência", shortName: "IDP", city: "Rio Branco", state: "Acre", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1946, badgeUrl: badge("brasileirao-d", "independencia-ac"), colors: ["#006400", "#FFFFFF"] },
  { id: "aguia-maraba", name: "Águia de Marabá", shortName: "AGM", city: "Marabá", state: "Pará", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1982, badgeUrl: badge("brasileirao-d", "aguia-maraba"), colors: ["#003DA5", "#FFD700"] },
  { id: "trem", name: "Trem", shortName: "TRM", city: "Macapá", state: "Amapá", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1947, badgeUrl: badge("brasileirao-d", "trem"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "gas", name: "GAS", shortName: "GAS", city: "Boa Vista", state: "Roraima", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1965, badgeUrl: badge("brasileirao-d", "gas"), colors: ["#006400", "#FFFFFF"] },
  { id: "humaita-ac", name: "Humaitá", shortName: "HUM", city: "Porto Acre", state: "Acre", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2003, badgeUrl: badge("brasileirao-d", "humaita-ac"), colors: ["#CC0000", "#000000"] },
  // Group A2
  { id: "altos", name: "Altos", shortName: "ALT", city: "Altos", state: "Piauí", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2013, badgeUrl: badge("brasileirao-d", "altos"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "imperatriz", name: "Imperatriz", shortName: "IMP", city: "Imperatriz", state: "Maranhão", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1962, badgeUrl: badge("brasileirao-d", "imperatriz"), colors: ["#CC0000", "#003DA5"] },
  { id: "sampaio-correa", name: "Sampaio Corrêa", shortName: "SAM", city: "São Luís", state: "Maranhão", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1923, badgeUrl: badge("brasileirao-d", "sampaio-correa"), colors: ["#FFD700", "#006400"] },
  { id: "maranhao-ac", name: "Maranhão AC", shortName: "MRN", city: "São Luís", state: "Maranhão", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1932, badgeUrl: badge("brasileirao-d", "maranhao-ac"), colors: ["#003DA5", "#CC0000"] },
  { id: "iguatu", name: "Iguatu", shortName: "IGU", city: "Iguatu", state: "Ceará", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1995, badgeUrl: badge("brasileirao-d", "iguatu"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "tocantinopolis", name: "Tocantinópolis", shortName: "TOC", city: "Tocantinópolis", state: "Tocantins", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1993, badgeUrl: badge("brasileirao-d", "tocantinopolis"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "parnahyba", name: "Parnahyba", shortName: "PNB", city: "Parnaíba", state: "Piauí", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1913, badgeUrl: badge("brasileirao-d", "parnahyba"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "maracana-ce", name: "Maracanã", shortName: "MCA", city: "Maracanaú", state: "Ceará", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2005, badgeUrl: badge("brasileirao-d", "maracana-ce"), colors: ["#CC0000", "#003DA5"] },
  // Group A3
  { id: "america-natal", name: "América de Natal", shortName: "ARN", city: "Natal", state: "Rio Grande do Norte", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1915, badgeUrl: badge("brasileirao-d", "america-natal"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "santa-cruz", name: "Santa Cruz", shortName: "STC", city: "Recife", state: "Pernambuco", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1914, badgeUrl: badge("brasileirao-d", "santa-cruz"), colors: ["#CC0000", "#000000"] },
  { id: "central", name: "Central", shortName: "CEN", city: "Caruaru", state: "Pernambuco", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1919, badgeUrl: badge("brasileirao-d", "central"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "ferroviario-ce", name: "Ferroviário", shortName: "FRV", city: "Fortaleza", state: "Ceará", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1933, badgeUrl: badge("brasileirao-d", "ferroviario-ce"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "horizonte", name: "Horizonte", shortName: "HOR", city: "Horizonte", state: "Ceará", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2004, badgeUrl: badge("brasileirao-d", "horizonte"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "santa-cruz-natal", name: "Santa Cruz de Natal", shortName: "SCN", city: "Natal", state: "Rio Grande do Norte", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1965, badgeUrl: badge("brasileirao-d", "santa-cruz-natal"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "treze", name: "Treze", shortName: "TRZ", city: "Campina Grande", state: "Paraíba", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1925, badgeUrl: badge("brasileirao-d", "treze"), colors: ["#000000", "#FFFFFF"] },
  { id: "sousa", name: "Sousa EC", shortName: "SOU", city: "Sousa", state: "Paraíba", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1991, badgeUrl: badge("brasileirao-d", "sousa"), colors: ["#003DA5", "#FFFFFF"] },
  // Group A4
  { id: "asa", name: "ASA", shortName: "ASA", city: "Arapiraca", state: "Alagoas", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1952, badgeUrl: badge("brasileirao-d", "asa"), colors: ["#FFFFFF", "#000000"] },
  { id: "lagarto", name: "Lagarto", shortName: "LGT", city: "Lagarto", state: "Sergipe", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1992, badgeUrl: badge("brasileirao-d", "lagarto"), colors: ["#003DA5", "#CC0000"] },
  { id: "sergipe", name: "Sergipe", shortName: "SER", city: "Aracaju", state: "Sergipe", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1909, badgeUrl: badge("brasileirao-d", "sergipe"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "juazeirense", name: "Juazeirense", shortName: "JUA", city: "Juazeiro", state: "Bahia", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2006, badgeUrl: badge("brasileirao-d", "juazeirense"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "uniao-araguaina", name: "União", shortName: "UNI", city: "Araguaína", state: "Tocantins", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1993, badgeUrl: badge("brasileirao-d", "uniao-araguaina"), colors: ["#003DA5", "#CC0000"] },
  { id: "jequie", name: "Jequié", shortName: "JEQ", city: "Jequié", state: "Bahia", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1969, badgeUrl: badge("brasileirao-d", "jequie"), colors: ["#CC0000", "#000000"] },
  { id: "barcelona-ilheus", name: "Barcelona de Ilhéus", shortName: "BAI", city: "Ilhéus", state: "Bahia", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2019, badgeUrl: badge("brasileirao-d", "barcelona-ilheus"), colors: ["#003DA5", "#CC0000"] },
  { id: "penedense", name: "Penedense", shortName: "PND", city: "Penedo", state: "Alagoas", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1909, badgeUrl: badge("brasileirao-d", "penedense"), colors: ["#CC0000", "#FFFFFF"] },
  // Group A5
  { id: "aparecidense", name: "Aparecidense", shortName: "APA", city: "Aparecida de Goiânia", state: "Goiás", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1985, badgeUrl: badge("brasileirao-d", "aparecidense"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "ceilandia", name: "Ceilândia", shortName: "CEI", city: "Ceilândia", state: "Distrito Federal", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1978, badgeUrl: badge("brasileirao-d", "ceilandia"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "luverdense", name: "Luverdense", shortName: "LUV", city: "Lucas do Rio Verde", state: "Mato Grosso", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2004, badgeUrl: badge("brasileirao-d", "luverdense"), colors: ["#006400", "#FFFFFF"] },
  { id: "mixto", name: "Mixto", shortName: "MIX", city: "Cuiabá", state: "Mato Grosso", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1934, badgeUrl: badge("brasileirao-d", "mixto"), colors: ["#FFD700", "#000000"] },
  { id: "capital-df", name: "Capital FC", shortName: "CPT", city: "Brasília", state: "Distrito Federal", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2005, badgeUrl: badge("brasileirao-d", "capital-df"), colors: ["#CC0000", "#000000"] },
  { id: "goiania", name: "Goiânia EC", shortName: "GEC", city: "Goiânia", state: "Goiás", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1937, badgeUrl: badge("brasileirao-d", "goiania"), colors: ["#006400", "#CC0000"] },
  { id: "goianesia", name: "Goianésia", shortName: "GON", city: "Goianésia", state: "Goiás", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1953, badgeUrl: badge("brasileirao-d", "goianesia"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "porto-velho", name: "Porto Velho EC", shortName: "PVE", city: "Porto Velho", state: "Rondônia", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2014, badgeUrl: badge("brasileirao-d", "porto-velho"), colors: ["#003DA5", "#FFD700"] },
  // Group A6
  { id: "portuguesa-sp", name: "Portuguesa", shortName: "PTG", city: "São Paulo", state: "São Paulo", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1920, badgeUrl: badge("brasileirao-d", "portuguesa-sp"), colors: ["#CC0000", "#006400"] },
  { id: "rio-branco-es", name: "Rio Branco-ES", shortName: "RBE", city: "Vitória", state: "Espírito Santo", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1913, badgeUrl: badge("brasileirao-d", "rio-branco-es"), colors: ["#FFFFFF", "#000000"] },
  { id: "agua-santa", name: "Água Santa", shortName: "AGS", city: "Diadema", state: "São Paulo", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1981, badgeUrl: badge("brasileirao-d", "agua-santa"), colors: ["#003DA5", "#CC0000"] },
  { id: "marica", name: "Maricá FC", shortName: "MRC", city: "Maricá", state: "Rio de Janeiro", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2018, badgeUrl: badge("brasileirao-d", "marica"), colors: ["#FFD700", "#003DA5"] },
  { id: "pouso-alegre", name: "Pouso Alegre", shortName: "PAG", city: "Pouso Alegre", state: "Minas Gerais", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1913, badgeUrl: badge("brasileirao-d", "pouso-alegre"), colors: ["#CC0000", "#000000"] },
  { id: "porto-vitoria", name: "Porto Vitória", shortName: "PTV", city: "Vitória", state: "Espírito Santo", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2014, badgeUrl: badge("brasileirao-d", "porto-vitoria"), colors: ["#003DA5", "#CC0000"] },
  { id: "nova-iguacu", name: "Nova Iguaçu", shortName: "NIG", city: "Nova Iguaçu", state: "Rio de Janeiro", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1990, badgeUrl: badge("brasileirao-d", "nova-iguacu"), colors: ["#FFD700", "#CC0000"] },
  { id: "boavista-rj", name: "Boavista", shortName: "BOA", city: "Saquarema", state: "Rio de Janeiro", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1961, badgeUrl: badge("brasileirao-d", "boavista-rj"), colors: ["#006400", "#FFFFFF"] },
  // Group A7
  { id: "fc-cascavel", name: "FC Cascavel", shortName: "FCC", city: "Cascavel", state: "Paraná", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2008, badgeUrl: badge("brasileirao-d", "fc-cascavel"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "azuriz", name: "Azuriz", shortName: "AZU", city: "Marmeleiro", state: "Paraná", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2018, badgeUrl: badge("brasileirao-d", "azuriz"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "cianorte", name: "Cianorte", shortName: "CIA", city: "Cianorte", state: "Paraná", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2002, badgeUrl: badge("brasileirao-d", "cianorte"), colors: ["#003DA5", "#CC0000"] },
  { id: "guarany-bage", name: "Guarany de Bagé", shortName: "GBA", city: "Bagé", state: "Rio Grande do Sul", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1907, badgeUrl: badge("brasileirao-d", "guarany-bage"), colors: ["#CC0000", "#000000"] },
  { id: "brasil-pelotas", name: "Brasil de Pelotas", shortName: "BPE", city: "Pelotas", state: "Rio Grande do Sul", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1911, badgeUrl: badge("brasileirao-d", "brasil-pelotas"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "sao-luiz-rs", name: "São Luiz", shortName: "SLU", city: "Ijuí", state: "Rio Grande do Sul", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1938, badgeUrl: badge("brasileirao-d", "sao-luiz-rs"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "sao-jose-rs", name: "São José-RS", shortName: "SJR", city: "Porto Alegre", state: "Rio Grande do Sul", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1913, badgeUrl: badge("brasileirao-d", "sao-jose-rs"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "marcilio-dias", name: "Marcílio Dias", shortName: "MCD", city: "Itajaí", state: "Santa Catarina", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1919, badgeUrl: badge("brasileirao-d", "marcilio-dias"), colors: ["#003DA5", "#FFFFFF"] },
  // Group A8
  { id: "barra-sc", name: "Barra FC", shortName: "BFC", city: "Balneário Camboriú", state: "Santa Catarina", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2013, badgeUrl: badge("brasileirao-d", "barra-sc"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "joinville", name: "Joinville", shortName: "JOI", city: "Joinville", state: "Santa Catarina", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1976, badgeUrl: badge("brasileirao-d", "joinville"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "inter-limeira", name: "Inter de Limeira", shortName: "INL", city: "Limeira", state: "São Paulo", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1913, badgeUrl: badge("brasileirao-d", "inter-limeira"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "uberlandia", name: "Uberlândia", shortName: "UBE", city: "Uberlândia", state: "Minas Gerais", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1922, badgeUrl: badge("brasileirao-d", "uberlandia"), colors: ["#006400", "#FFFFFF"] },
  { id: "itabirito", name: "Itabirito FC", shortName: "ITR", city: "Itabirito", state: "Minas Gerais", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 2022, badgeUrl: badge("brasileirao-d", "itabirito"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "monte-azul", name: "Monte Azul", shortName: "MAZ", city: "Monte Azul Paulista", state: "São Paulo", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1920, badgeUrl: badge("brasileirao-d", "monte-azul"), colors: ["#CC0000", "#000000"] },
  { id: "operario-ms", name: "Operário-MS", shortName: "OMS", city: "Campo Grande", state: "Mato Grosso do Sul", country: "Brazil", leagueId: "brasileirao-d", foundedYear: 1938, badgeUrl: badge("brasileirao-d", "operario-ms"), colors: ["#CC0000", "#000000"] },

  // ===== CAMPEONATO PARAIBANO =====
  { id: "auto-esporte", name: "Auto Esporte", shortName: "AUT", city: "João Pessoa", state: "Paraíba", country: "Brazil", leagueId: "paraibano", foundedYear: 1936, badgeUrl: badge("paraibano", "auto-esporte"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "campinense", name: "Campinense", shortName: "CMP", city: "Campina Grande", state: "Paraíba", country: "Brazil", leagueId: "paraibano", foundedYear: 1925, badgeUrl: badge("paraibano", "campinense"), colors: ["#CC0000", "#000000"] },
  { id: "nacional-patos", name: "Nacional de Patos", shortName: "NDP", city: "Patos", state: "Paraíba", country: "Brazil", leagueId: "paraibano", foundedYear: 1961, badgeUrl: badge("paraibano", "nacional-patos"), colors: ["#003DA5", "#CC0000"] },
  { id: "esporte-patos", name: "Esporte de Patos", shortName: "EDP", city: "Patos", state: "Paraíba", country: "Brazil", leagueId: "paraibano", foundedYear: 1945, badgeUrl: badge("paraibano", "esporte-patos"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "picuiense", name: "Picuiense", shortName: "PIC", city: "Picuí", state: "Paraíba", country: "Brazil", leagueId: "paraibano", foundedYear: 2008, badgeUrl: badge("paraibano", "picuiense"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "pombal", name: "Pombal EC", shortName: "PMB", city: "Pombal", state: "Paraíba", country: "Brazil", leagueId: "paraibano", foundedYear: 2018, badgeUrl: badge("paraibano", "pombal"), colors: ["#CC0000", "#000000"] },
  { id: "serra-branca", name: "Serra Branca EC", shortName: "SBR", city: "Serra Branca", state: "Paraíba", country: "Brazil", leagueId: "paraibano", foundedYear: 2005, badgeUrl: badge("paraibano", "serra-branca"), colors: ["#003DA5", "#FFFFFF"] },

  // ===== LIGA PROFESIONAL (Argentina) =====
  { id: "boca-juniors", name: "Boca Juniors", shortName: "BOC", city: "Buenos Aires", state: "Buenos Aires", country: "Argentina", leagueId: "liga-profesional", foundedYear: 1905, badgeUrl: badge("liga-profesional", "boca-juniors"), colors: ["#003087", "#FFD700"] },
  { id: "river-plate", name: "River Plate", shortName: "RIV", city: "Buenos Aires", state: "Buenos Aires", country: "Argentina", leagueId: "liga-profesional", foundedYear: 1901, badgeUrl: badge("liga-profesional", "river-plate"), colors: ["#FFFFFF", "#CC0000"] },
  { id: "racing-club", name: "Racing Club", shortName: "RAC", city: "Avellaneda", state: "Buenos Aires", country: "Argentina", leagueId: "liga-profesional", foundedYear: 1903, badgeUrl: badge("liga-profesional", "racing-club"), colors: ["#87CEEB", "#FFFFFF"] },
  { id: "independiente", name: "Independiente", shortName: "IND", city: "Avellaneda", state: "Buenos Aires", country: "Argentina", leagueId: "liga-profesional", foundedYear: 1905, badgeUrl: badge("liga-profesional", "independiente"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "san-lorenzo", name: "San Lorenzo", shortName: "SLO", city: "Buenos Aires", state: "Buenos Aires", country: "Argentina", leagueId: "liga-profesional", foundedYear: 1908, badgeUrl: badge("liga-profesional", "san-lorenzo"), colors: ["#003087", "#CC0000"] },
  { id: "velez-sarsfield", name: "Vélez Sarsfield", shortName: "VEL", city: "Buenos Aires", state: "Buenos Aires", country: "Argentina", leagueId: "liga-profesional", foundedYear: 1910, badgeUrl: badge("liga-profesional", "velez-sarsfield"), colors: ["#003087", "#FFFFFF"] },
  { id: "estudiantes", name: "Estudiantes", shortName: "EST", city: "La Plata", state: "Buenos Aires", country: "Argentina", leagueId: "liga-profesional", foundedYear: 1905, badgeUrl: badge("liga-profesional", "estudiantes"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "newells-old-boys", name: "Newell's Old Boys", shortName: "NOB", city: "Rosario", state: "Santa Fe", country: "Argentina", leagueId: "liga-profesional", foundedYear: 1903, badgeUrl: badge("liga-profesional", "newells-old-boys"), colors: ["#CC0000", "#000000"] },
  { id: "rosario-central", name: "Rosario Central", shortName: "ROS", city: "Rosario", state: "Santa Fe", country: "Argentina", leagueId: "liga-profesional", foundedYear: 1889, badgeUrl: badge("liga-profesional", "rosario-central"), colors: ["#003087", "#FFD700"] },
  { id: "talleres", name: "Talleres", shortName: "TAL", city: "Córdoba", state: "Córdoba", country: "Argentina", leagueId: "liga-profesional", foundedYear: 1913, badgeUrl: badge("liga-profesional", "talleres"), colors: ["#003087", "#FFFFFF"] },

  // ===== PREMIER LEAGUE (England) =====
  { id: "arsenal", name: "Arsenal", shortName: "ARS", city: "London", state: "England", country: "England", leagueId: "premier-league", foundedYear: 1886, badgeUrl: badge("premier-league", "arsenal"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "manchester-united", name: "Manchester United", shortName: "MUN", city: "Manchester", state: "England", country: "England", leagueId: "premier-league", foundedYear: 1878, badgeUrl: badge("premier-league", "manchester-united"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "manchester-city", name: "Manchester City", shortName: "MCI", city: "Manchester", state: "England", country: "England", leagueId: "premier-league", foundedYear: 1880, badgeUrl: badge("premier-league", "manchester-city"), colors: ["#6CADDF", "#FFFFFF"] },
  { id: "liverpool", name: "Liverpool", shortName: "LIV", city: "Liverpool", state: "England", country: "England", leagueId: "premier-league", foundedYear: 1892, badgeUrl: badge("premier-league", "liverpool"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "chelsea", name: "Chelsea", shortName: "CHE", city: "London", state: "England", country: "England", leagueId: "premier-league", foundedYear: 1905, badgeUrl: badge("premier-league", "chelsea"), colors: ["#003399", "#FFFFFF"] },
  { id: "tottenham", name: "Tottenham Hotspur", shortName: "TOT", city: "London", state: "England", country: "England", leagueId: "premier-league", foundedYear: 1882, badgeUrl: badge("premier-league", "tottenham"), colors: ["#FFFFFF", "#000080"] },
  { id: "aston-villa", name: "Aston Villa", shortName: "AVL", city: "Birmingham", state: "England", country: "England", leagueId: "premier-league", foundedYear: 1874, badgeUrl: badge("premier-league", "aston-villa"), colors: ["#670E36", "#95BFE5"] },
  { id: "newcastle", name: "Newcastle United", shortName: "NEW", city: "Newcastle", state: "England", country: "England", leagueId: "premier-league", foundedYear: 1892, badgeUrl: badge("premier-league", "newcastle"), colors: ["#000000", "#FFFFFF"] },
  { id: "west-ham", name: "West Ham United", shortName: "WHU", city: "London", state: "England", country: "England", leagueId: "premier-league", foundedYear: 1895, badgeUrl: badge("premier-league", "west-ham"), colors: ["#7A003C", "#2DAFE5"] },
  { id: "everton", name: "Everton", shortName: "EVE", city: "Liverpool", state: "England", country: "England", leagueId: "premier-league", foundedYear: 1878, badgeUrl: badge("premier-league", "everton"), colors: ["#003399", "#FFFFFF"] },

  // ===== LA LIGA (Spain) =====
  { id: "real-madrid", name: "Real Madrid", shortName: "RMA", city: "Madrid", state: "Madrid", country: "Spain", leagueId: "la-liga", foundedYear: 1902, badgeUrl: badge("la-liga", "real-madrid"), colors: ["#FFFFFF", "#D4AF37"] },
  { id: "barcelona", name: "FC Barcelona", shortName: "BAR", city: "Barcelona", state: "Catalonia", country: "Spain", leagueId: "la-liga", foundedYear: 1899, badgeUrl: badge("la-liga", "barcelona"), colors: ["#A50044", "#004D98"] },
  { id: "atletico-madrid", name: "Atlético Madrid", shortName: "ATM", city: "Madrid", state: "Madrid", country: "Spain", leagueId: "la-liga", foundedYear: 1903, badgeUrl: badge("la-liga", "atletico-madrid"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "sevilla", name: "Sevilla FC", shortName: "SEV", city: "Seville", state: "Andalusia", country: "Spain", leagueId: "la-liga", foundedYear: 1890, badgeUrl: badge("la-liga", "sevilla"), colors: ["#FFFFFF", "#CC0000"] },
  { id: "real-betis", name: "Real Betis", shortName: "BET", city: "Seville", state: "Andalusia", country: "Spain", leagueId: "la-liga", foundedYear: 1907, badgeUrl: badge("la-liga", "real-betis"), colors: ["#006400", "#FFFFFF"] },
  { id: "valencia", name: "Valencia CF", shortName: "VAL", city: "Valencia", state: "Valencia", country: "Spain", leagueId: "la-liga", foundedYear: 1919, badgeUrl: badge("la-liga", "valencia"), colors: ["#FFFFFF", "#FF6600"] },
  { id: "villarreal", name: "Villarreal CF", shortName: "VIL", city: "Villarreal", state: "Valencia", country: "Spain", leagueId: "la-liga", foundedYear: 1923, badgeUrl: badge("la-liga", "villarreal"), colors: ["#FFD700", "#003399"] },
  { id: "real-sociedad", name: "Real Sociedad", shortName: "RSO", city: "San Sebastián", state: "Basque Country", country: "Spain", leagueId: "la-liga", foundedYear: 1909, badgeUrl: badge("la-liga", "real-sociedad"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "athletic-bilbao", name: "Athletic Bilbao", shortName: "ATH", city: "Bilbao", state: "Basque Country", country: "Spain", leagueId: "la-liga", foundedYear: 1898, badgeUrl: badge("la-liga", "athletic-bilbao"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "celta-vigo", name: "Celta de Vigo", shortName: "CEL", city: "Vigo", state: "Galicia", country: "Spain", leagueId: "la-liga", foundedYear: 1923, badgeUrl: badge("la-liga", "celta-vigo"), colors: ["#87CEEB", "#CC0000"] },

  // ===== SERIE A (Italy) =====
  { id: "juventus", name: "Juventus", shortName: "JUV", city: "Turin", state: "Piedmont", country: "Italy", leagueId: "serie-a-it", foundedYear: 1897, badgeUrl: badge("serie-a-it", "juventus"), colors: ["#000000", "#FFFFFF"] },
  { id: "ac-milan", name: "AC Milan", shortName: "MIL", city: "Milan", state: "Lombardy", country: "Italy", leagueId: "serie-a-it", foundedYear: 1899, badgeUrl: badge("serie-a-it", "ac-milan"), colors: ["#CC0000", "#000000"] },
  { id: "inter-milan", name: "Inter Milan", shortName: "INT", city: "Milan", state: "Lombardy", country: "Italy", leagueId: "serie-a-it", foundedYear: 1908, badgeUrl: badge("serie-a-it", "inter-milan"), colors: ["#003DA5", "#000000"] },
  { id: "napoli", name: "SSC Napoli", shortName: "NAP", city: "Naples", state: "Campania", country: "Italy", leagueId: "serie-a-it", foundedYear: 1926, badgeUrl: badge("serie-a-it", "napoli"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "roma", name: "AS Roma", shortName: "ROM", city: "Rome", state: "Lazio", country: "Italy", leagueId: "serie-a-it", foundedYear: 1927, badgeUrl: badge("serie-a-it", "roma"), colors: ["#A0342B", "#FFD700"] },
  { id: "lazio", name: "SS Lazio", shortName: "LAZ", city: "Rome", state: "Lazio", country: "Italy", leagueId: "serie-a-it", foundedYear: 1900, badgeUrl: badge("serie-a-it", "lazio"), colors: ["#87CEEB", "#FFFFFF"] },
  { id: "fiorentina", name: "Fiorentina", shortName: "FIO", city: "Florence", state: "Tuscany", country: "Italy", leagueId: "serie-a-it", foundedYear: 1926, badgeUrl: badge("serie-a-it", "fiorentina"), colors: ["#6A0DAD", "#FFFFFF"] },
  { id: "atalanta", name: "Atalanta", shortName: "ATA", city: "Bergamo", state: "Lombardy", country: "Italy", leagueId: "serie-a-it", foundedYear: 1907, badgeUrl: badge("serie-a-it", "atalanta"), colors: ["#003DA5", "#000000"] },
  { id: "torino", name: "Torino FC", shortName: "TOR", city: "Turin", state: "Piedmont", country: "Italy", leagueId: "serie-a-it", foundedYear: 1906, badgeUrl: badge("serie-a-it", "torino"), colors: ["#7B003C", "#FFFFFF"] },
  { id: "bologna", name: "Bologna FC", shortName: "BOL", city: "Bologna", state: "Emilia-Romagna", country: "Italy", leagueId: "serie-a-it", foundedYear: 1909, badgeUrl: badge("serie-a-it", "bologna"), colors: ["#CC0000", "#003DA5"] },

  // ===== BUNDESLIGA (Germany) =====
  { id: "bayern-munich", name: "Bayern Munich", shortName: "BAY", city: "Munich", state: "Bavaria", country: "Germany", leagueId: "bundesliga", foundedYear: 1900, badgeUrl: badge("bundesliga", "bayern-munich"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "borussia-dortmund", name: "Borussia Dortmund", shortName: "BVB", city: "Dortmund", state: "North Rhine-Westphalia", country: "Germany", leagueId: "bundesliga", foundedYear: 1909, badgeUrl: badge("bundesliga", "borussia-dortmund"), colors: ["#FFD700", "#000000"] },
  { id: "rb-leipzig", name: "RB Leipzig", shortName: "RBL", city: "Leipzig", state: "Saxony", country: "Germany", leagueId: "bundesliga", foundedYear: 2009, badgeUrl: badge("bundesliga", "rb-leipzig"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "bayer-leverkusen", name: "Bayer Leverkusen", shortName: "B04", city: "Leverkusen", state: "North Rhine-Westphalia", country: "Germany", leagueId: "bundesliga", foundedYear: 1904, badgeUrl: badge("bundesliga", "bayer-leverkusen"), colors: ["#CC0000", "#000000"] },
  { id: "eintracht-frankfurt", name: "Eintracht Frankfurt", shortName: "SGE", city: "Frankfurt", state: "Hesse", country: "Germany", leagueId: "bundesliga", foundedYear: 1899, badgeUrl: badge("bundesliga", "eintracht-frankfurt"), colors: ["#000000", "#CC0000"] },
  { id: "wolfsburg", name: "VfL Wolfsburg", shortName: "WOB", city: "Wolfsburg", state: "Lower Saxony", country: "Germany", leagueId: "bundesliga", foundedYear: 1945, badgeUrl: badge("bundesliga", "wolfsburg"), colors: ["#006400", "#FFFFFF"] },
  { id: "schalke", name: "Schalke 04", shortName: "S04", city: "Gelsenkirchen", state: "North Rhine-Westphalia", country: "Germany", leagueId: "bundesliga", foundedYear: 1904, badgeUrl: badge("bundesliga", "schalke"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "borussia-monchengladbach", name: "Borussia Mönchengladbach", shortName: "BMG", city: "Mönchengladbach", state: "North Rhine-Westphalia", country: "Germany", leagueId: "bundesliga", foundedYear: 1900, badgeUrl: badge("bundesliga", "borussia-monchengladbach"), colors: ["#000000", "#FFFFFF"] },
  { id: "stuttgart", name: "VfB Stuttgart", shortName: "VFB", city: "Stuttgart", state: "Baden-Württemberg", country: "Germany", leagueId: "bundesliga", foundedYear: 1893, badgeUrl: badge("bundesliga", "stuttgart"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "werder-bremen", name: "Werder Bremen", shortName: "SVW", city: "Bremen", state: "Bremen", country: "Germany", leagueId: "bundesliga", foundedYear: 1899, badgeUrl: badge("bundesliga", "werder-bremen"), colors: ["#006400", "#FFFFFF"] },

  // ===== LIGUE 1 (France) =====
  { id: "psg", name: "Paris Saint-Germain", shortName: "PSG", city: "Paris", state: "Île-de-France", country: "France", leagueId: "ligue-1", foundedYear: 1970, badgeUrl: badge("ligue-1", "psg"), colors: ["#003DA5", "#CC0000"] },
  { id: "olympique-marseille", name: "Olympique de Marseille", shortName: "OM", city: "Marseille", state: "Provence", country: "France", leagueId: "ligue-1", foundedYear: 1899, badgeUrl: badge("ligue-1", "olympique-marseille"), colors: ["#2DAFE5", "#FFFFFF"] },
  { id: "olympique-lyon", name: "Olympique Lyonnais", shortName: "OL", city: "Lyon", state: "Auvergne-Rhône-Alpes", country: "France", leagueId: "ligue-1", foundedYear: 1950, badgeUrl: badge("ligue-1", "olympique-lyon"), colors: ["#CC0000", "#003DA5"] },
  { id: "monaco", name: "AS Monaco", shortName: "MON", city: "Monaco", state: "Monaco", country: "France", leagueId: "ligue-1", foundedYear: 1924, badgeUrl: badge("ligue-1", "monaco"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "lille", name: "LOSC Lille", shortName: "LIL", city: "Lille", state: "Hauts-de-France", country: "France", leagueId: "ligue-1", foundedYear: 1944, badgeUrl: badge("ligue-1", "lille"), colors: ["#CC0000", "#003DA5"] },
  { id: "nice", name: "OGC Nice", shortName: "NIC", city: "Nice", state: "Provence", country: "France", leagueId: "ligue-1", foundedYear: 1904, badgeUrl: badge("ligue-1", "nice"), colors: ["#CC0000", "#000000"] },
  { id: "lens", name: "RC Lens", shortName: "LEN", city: "Lens", state: "Hauts-de-France", country: "France", leagueId: "ligue-1", foundedYear: 1906, badgeUrl: badge("ligue-1", "lens"), colors: ["#FFD700", "#CC0000"] },
  { id: "rennes", name: "Stade Rennais", shortName: "REN", city: "Rennes", state: "Brittany", country: "France", leagueId: "ligue-1", foundedYear: 1901, badgeUrl: badge("ligue-1", "rennes"), colors: ["#CC0000", "#000000"] },

  // ===== LIGA PORTUGAL =====
  { id: "benfica", name: "SL Benfica", shortName: "BEN", city: "Lisbon", state: "Lisbon", country: "Portugal", leagueId: "liga-portugal", foundedYear: 1904, badgeUrl: badge("liga-portugal", "benfica"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "porto", name: "FC Porto", shortName: "POR", city: "Porto", state: "Porto", country: "Portugal", leagueId: "liga-portugal", foundedYear: 1893, badgeUrl: badge("liga-portugal", "porto"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "sporting-cp", name: "Sporting CP", shortName: "SCP", city: "Lisbon", state: "Lisbon", country: "Portugal", leagueId: "liga-portugal", foundedYear: 1906, badgeUrl: badge("liga-portugal", "sporting-cp"), colors: ["#006400", "#FFFFFF"] },
  { id: "braga", name: "SC Braga", shortName: "BRA", city: "Braga", state: "Braga", country: "Portugal", leagueId: "liga-portugal", foundedYear: 1921, badgeUrl: badge("liga-portugal", "braga"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "vitoria-guimaraes", name: "Vitória de Guimarães", shortName: "VSC", city: "Guimarães", state: "Braga", country: "Portugal", leagueId: "liga-portugal", foundedYear: 1922, badgeUrl: badge("liga-portugal", "vitoria-guimaraes"), colors: ["#000000", "#FFFFFF"] },

  // ===== EREDIVISIE (Netherlands) =====
  { id: "ajax", name: "Ajax", shortName: "AJA", city: "Amsterdam", state: "North Holland", country: "Netherlands", leagueId: "eredivisie", foundedYear: 1900, badgeUrl: badge("eredivisie", "ajax"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "psv", name: "PSV Eindhoven", shortName: "PSV", city: "Eindhoven", state: "North Brabant", country: "Netherlands", leagueId: "eredivisie", foundedYear: 1913, badgeUrl: badge("eredivisie", "psv"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "feyenoord", name: "Feyenoord", shortName: "FEY", city: "Rotterdam", state: "South Holland", country: "Netherlands", leagueId: "eredivisie", foundedYear: 1908, badgeUrl: badge("eredivisie", "feyenoord"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "az-alkmaar", name: "AZ Alkmaar", shortName: "AZ", city: "Alkmaar", state: "North Holland", country: "Netherlands", leagueId: "eredivisie", foundedYear: 1967, badgeUrl: badge("eredivisie", "az-alkmaar"), colors: ["#CC0000", "#FFFFFF"] },

  // ===== LIGA MX (Mexico) =====
  { id: "club-america", name: "Club América", shortName: "AME", city: "Mexico City", state: "CDMX", country: "Mexico", leagueId: "liga-mx", foundedYear: 1916, badgeUrl: badge("liga-mx", "club-america"), colors: ["#FFD700", "#003DA5"] },
  { id: "chivas", name: "Guadalajara (Chivas)", shortName: "CHI", city: "Guadalajara", state: "Jalisco", country: "Mexico", leagueId: "liga-mx", foundedYear: 1906, badgeUrl: badge("liga-mx", "chivas"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "cruz-azul", name: "Cruz Azul", shortName: "CAZ", city: "Mexico City", state: "CDMX", country: "Mexico", leagueId: "liga-mx", foundedYear: 1927, badgeUrl: badge("liga-mx", "cruz-azul"), colors: ["#003DA5", "#CC0000"] },
  { id: "pumas-unam", name: "Pumas UNAM", shortName: "PUM", city: "Mexico City", state: "CDMX", country: "Mexico", leagueId: "liga-mx", foundedYear: 1954, badgeUrl: badge("liga-mx", "pumas-unam"), colors: ["#003087", "#FFD700"] },
  { id: "monterrey", name: "CF Monterrey", shortName: "MTY", city: "Monterrey", state: "Nuevo León", country: "Mexico", leagueId: "liga-mx", foundedYear: 1945, badgeUrl: badge("liga-mx", "monterrey"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "tigres-uanl", name: "Tigres UANL", shortName: "TIG", city: "Monterrey", state: "Nuevo León", country: "Mexico", leagueId: "liga-mx", foundedYear: 1960, badgeUrl: badge("liga-mx", "tigres-uanl"), colors: ["#FFD700", "#003087"] },

  // ===== LIGA BETPLAY (Colombia) =====
  { id: "atletico-nacional", name: "Atlético Nacional", shortName: "NAL", city: "Medellín", state: "Antioquia", country: "Colombia", leagueId: "liga-betplay", foundedYear: 1947, badgeUrl: badge("liga-betplay", "atletico-nacional"), colors: ["#006400", "#FFFFFF"] },
  { id: "millonarios", name: "Millonarios", shortName: "MFC", city: "Bogotá", state: "Bogotá", country: "Colombia", leagueId: "liga-betplay", foundedYear: 1946, badgeUrl: badge("liga-betplay", "millonarios"), colors: ["#003DA5", "#FFFFFF"] },
  { id: "america-de-cali", name: "América de Cali", shortName: "AMC", city: "Cali", state: "Valle del Cauca", country: "Colombia", leagueId: "liga-betplay", foundedYear: 1927, badgeUrl: badge("liga-betplay", "america-de-cali"), colors: ["#CC0000", "#FFFFFF"] },
  { id: "deportivo-cali", name: "Deportivo Cali", shortName: "DCA", city: "Cali", state: "Valle del Cauca", country: "Colombia", leagueId: "liga-betplay", foundedYear: 1912, badgeUrl: badge("liga-betplay", "deportivo-cali"), colors: ["#006400", "#FFFFFF"] },
  { id: "junior-barranquilla", name: "Junior de Barranquilla", shortName: "JUN", city: "Barranquilla", state: "Atlántico", country: "Colombia", leagueId: "liga-betplay", foundedYear: 1924, badgeUrl: badge("liga-betplay", "junior-barranquilla"), colors: ["#CC0000", "#FFFFFF"] },

  // ===== PRIMERA DIVISIÓN (Uruguay) =====
  { id: "penarol", name: "Peñarol", shortName: "PEN", city: "Montevideo", state: "Montevideo", country: "Uruguay", leagueId: "primera-division-uy", foundedYear: 1891, badgeUrl: badge("primera-division-uy", "penarol"), colors: ["#FFD700", "#000000"] },
  { id: "nacional-uy", name: "Club Nacional", shortName: "NAC", city: "Montevideo", state: "Montevideo", country: "Uruguay", leagueId: "primera-division-uy", foundedYear: 1899, badgeUrl: badge("primera-division-uy", "nacional-uy"), colors: ["#CC0000", "#003DA5"] },

  // ===== PRIMERA DIVISIÓN (Chile) =====
  { id: "colo-colo", name: "Colo-Colo", shortName: "COL", city: "Santiago", state: "Santiago", country: "Chile", leagueId: "primera-division-cl", foundedYear: 1925, badgeUrl: badge("primera-division-cl", "colo-colo"), colors: ["#FFFFFF", "#000000"] },
  { id: "universidad-chile", name: "Universidad de Chile", shortName: "UCH", city: "Santiago", state: "Santiago", country: "Chile", leagueId: "primera-division-cl", foundedYear: 1927, badgeUrl: badge("primera-division-cl", "universidad-chile"), colors: ["#003DA5", "#CC0000"] },
  { id: "universidad-catolica", name: "Universidad Católica", shortName: "UC", city: "Santiago", state: "Santiago", country: "Chile", leagueId: "primera-division-cl", foundedYear: 1937, badgeUrl: badge("primera-division-cl", "universidad-catolica"), colors: ["#FFFFFF", "#003DA5"] },

  // ===== MLS (USA) =====
  { id: "lafc", name: "Los Angeles FC", shortName: "LAFC", city: "Los Angeles", state: "California", country: "USA", leagueId: "mls", foundedYear: 2014, badgeUrl: badge("mls", "lafc"), colors: ["#000000", "#C39E6D"] },
  { id: "la-galaxy", name: "LA Galaxy", shortName: "LAG", city: "Los Angeles", state: "California", country: "USA", leagueId: "mls", foundedYear: 1996, badgeUrl: badge("mls", "la-galaxy"), colors: ["#003DA5", "#FFD700"] },
  { id: "inter-miami", name: "Inter Miami CF", shortName: "MIA", city: "Fort Lauderdale", state: "Florida", country: "USA", leagueId: "mls", foundedYear: 2018, badgeUrl: badge("mls", "inter-miami"), colors: ["#F7B5CD", "#000000"] },
  { id: "atlanta-united", name: "Atlanta United", shortName: "ATL", city: "Atlanta", state: "Georgia", country: "USA", leagueId: "mls", foundedYear: 2014, badgeUrl: badge("mls", "atlanta-united"), colors: ["#80000A", "#A19060"] },
  { id: "seattle-sounders", name: "Seattle Sounders", shortName: "SEA", city: "Seattle", state: "Washington", country: "USA", leagueId: "mls", foundedYear: 2007, badgeUrl: badge("mls", "seattle-sounders"), colors: ["#5D9741", "#003DA5"] },
];
