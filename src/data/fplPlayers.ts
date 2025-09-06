import type { Player } from '../types/fantasy';

export interface FPLPlayer extends Player {
  price: number;
  teamCode: string;
  teamName: string;
  totalPoints: number;
  form: number; // Recent form (last 5 games average)
  fixtureDifficulty: number; // 1-5 scale (1 = easy, 5 = hard)
  ownership: number; // Percentage of FPL managers who own this player
  injuryStatus: 'Healthy' | 'Questionable' | 'Doubtful' | 'Out';
  news?: string; // Latest news about the player
}

export interface Formation {
  id: string;
  name: string;
  display: string;
  positions: {
    GK: number;
    DEF: number;
    MID: number;
    FWD: number;
  };
}

export const FPL_FORMATIONS: Formation[] = [
  { id: '3-4-3', name: '3-4-3', display: '3-4-3', positions: { GK: 1, DEF: 3, MID: 4, FWD: 3 } },
  { id: '3-5-2', name: '3-5-2', display: '3-5-2', positions: { GK: 1, DEF: 3, MID: 5, FWD: 2 } },
  { id: '4-3-3', name: '4-3-3', display: '4-3-3', positions: { GK: 1, DEF: 4, MID: 3, FWD: 3 } },
  { id: '4-4-2', name: '4-4-2', display: '4-4-2', positions: { GK: 1, DEF: 4, MID: 4, FWD: 2 } },
  { id: '4-5-1', name: '4-5-1', display: '4-5-1', positions: { GK: 1, DEF: 4, MID: 5, FWD: 1 } },
  { id: '5-3-2', name: '5-3-2', display: '5-3-2', positions: { GK: 1, DEF: 5, MID: 3, FWD: 2 } },
  { id: '5-4-1', name: '5-4-1', display: '5-4-1', positions: { GK: 1, DEF: 5, MID: 4, FWD: 1 } },
];

export const FPL_PLAYERS: FPLPlayer[] = [
  // Goalkeepers
  {
    id: 'alisson',
    name: 'Alisson',
    position: 'GK',
    team: 'LIV',
    teamCode: 'LIV',
    teamName: 'Liverpool',
    price: 5.8,
    totalPoints: 142,
    form: 4.2,
    fixtureDifficulty: 2,
    ownership: 15.2,
    injuryStatus: 'Healthy',
    projectedPoints: 5.8
  },
  {
    id: 'ederson',
    name: 'Ederson',
    position: 'GK',
    team: 'MCI',
    teamCode: 'MCI',
    teamName: 'Manchester City',
    price: 5.5,
    totalPoints: 138,
    form: 4.0,
    fixtureDifficulty: 2,
    ownership: 12.8,
    injuryStatus: 'Healthy',
    projectedPoints: 5.5
  },
  {
    id: 'ramsdale',
    name: 'Aaron Ramsdale',
    position: 'GK',
    team: 'ARS',
    teamCode: 'ARS',
    teamName: 'Arsenal',
    price: 5.0,
    totalPoints: 125,
    form: 3.8,
    fixtureDifficulty: 3,
    ownership: 8.5,
    injuryStatus: 'Healthy',
    projectedPoints: 5.0
  },
  {
    id: 'pope',
    name: 'Nick Pope',
    position: 'GK',
    team: 'NEW',
    teamCode: 'NEW',
    teamName: 'Newcastle',
    price: 4.5,
    totalPoints: 118,
    form: 3.5,
    fixtureDifficulty: 3,
    ownership: 6.2,
    injuryStatus: 'Healthy',
    projectedPoints: 4.5
  },

  // Defenders
  {
    id: 'trent',
    name: 'Trent Alexander-Arnold',
    position: 'DEF',
    team: 'LIV',
    teamCode: 'LIV',
    teamName: 'Liverpool',
    price: 8.5,
    totalPoints: 156,
    form: 6.8,
    fixtureDifficulty: 2,
    ownership: 25.3,
    injuryStatus: 'Healthy',
    projectedPoints: 8.5
  },
  {
    id: 'vvd',
    name: 'Virgil van Dijk',
    position: 'DEF',
    team: 'LIV',
    teamCode: 'LIV',
    teamName: 'Liverpool',
    price: 6.2,
    totalPoints: 145,
    form: 5.2,
    fixtureDifficulty: 2,
    ownership: 18.7,
    injuryStatus: 'Healthy',
    projectedPoints: 6.2
  },
  {
    id: 'walker',
    name: 'Kyle Walker',
    position: 'DEF',
    team: 'MCI',
    teamCode: 'MCI',
    teamName: 'Manchester City',
    price: 5.5,
    totalPoints: 132,
    form: 4.8,
    fixtureDifficulty: 2,
    ownership: 12.4,
    injuryStatus: 'Healthy',
    projectedPoints: 5.5
  },
  {
    id: 'saliba',
    name: 'William Saliba',
    position: 'DEF',
    team: 'ARS',
    teamCode: 'ARS',
    teamName: 'Arsenal',
    price: 5.0,
    totalPoints: 128,
    form: 4.5,
    fixtureDifficulty: 3,
    ownership: 15.6,
    injuryStatus: 'Healthy',
    projectedPoints: 5.0
  },
  {
    id: 'trippier',
    name: 'Kieran Trippier',
    position: 'DEF',
    team: 'NEW',
    teamCode: 'NEW',
    teamName: 'Newcastle',
    price: 6.5,
    totalPoints: 142,
    form: 5.8,
    fixtureDifficulty: 3,
    ownership: 22.1,
    injuryStatus: 'Healthy',
    projectedPoints: 6.5
  },
  {
    id: 'white',
    name: 'Ben White',
    position: 'DEF',
    team: 'ARS',
    teamCode: 'ARS',
    teamName: 'Arsenal',
    price: 4.5,
    totalPoints: 115,
    form: 4.2,
    fixtureDifficulty: 3,
    ownership: 8.9,
    injuryStatus: 'Healthy',
    projectedPoints: 4.5
  },

  // Midfielders
  {
    id: 'salah',
    name: 'Mohamed Salah',
    position: 'MID',
    team: 'LIV',
    teamCode: 'LIV',
    teamName: 'Liverpool',
    price: 13.0,
    totalPoints: 198,
    form: 8.2,
    fixtureDifficulty: 2,
    ownership: 45.7,
    injuryStatus: 'Healthy',
    projectedPoints: 13.0
  },
  {
    id: 'debruyne',
    name: 'Kevin De Bruyne',
    position: 'MID',
    team: 'MCI',
    teamCode: 'MCI',
    teamName: 'Manchester City',
    price: 10.5,
    totalPoints: 185,
    form: 7.8,
    fixtureDifficulty: 2,
    ownership: 38.2,
    injuryStatus: 'Healthy',
    projectedPoints: 10.5
  },
  {
    id: 'bruno',
    name: 'Bruno Fernandes',
    position: 'MID',
    team: 'MUN',
    teamCode: 'MUN',
    teamName: 'Manchester United',
    price: 8.5,
    totalPoints: 172,
    form: 6.5,
    fixtureDifficulty: 3,
    ownership: 28.4,
    injuryStatus: 'Healthy',
    projectedPoints: 8.5
  },
  {
    id: 'saka',
    name: 'Bukayo Saka',
    position: 'MID',
    team: 'ARS',
    teamCode: 'ARS',
    teamName: 'Arsenal',
    price: 8.0,
    totalPoints: 168,
    form: 6.8,
    fixtureDifficulty: 3,
    ownership: 32.1,
    injuryStatus: 'Healthy',
    projectedPoints: 8.0
  },
  {
    id: 'son',
    name: 'Son Heung-min',
    position: 'MID',
    team: 'TOT',
    teamCode: 'TOT',
    teamName: 'Tottenham',
    price: 9.0,
    totalPoints: 175,
    form: 7.2,
    fixtureDifficulty: 3,
    ownership: 25.6,
    injuryStatus: 'Healthy',
    projectedPoints: 9.0
  },
  {
    id: 'rashford',
    name: 'Marcus Rashford',
    position: 'MID',
    team: 'MUN',
    teamCode: 'MUN',
    teamName: 'Manchester United',
    price: 7.5,
    totalPoints: 158,
    form: 6.0,
    fixtureDifficulty: 3,
    ownership: 18.9,
    injuryStatus: 'Healthy',
    projectedPoints: 7.5
  },
  {
    id: 'martinelli',
    name: 'Gabriel Martinelli',
    position: 'MID',
    team: 'ARS',
    teamCode: 'ARS',
    teamName: 'Arsenal',
    price: 7.0,
    totalPoints: 145,
    form: 5.8,
    fixtureDifficulty: 3,
    ownership: 15.3,
    injuryStatus: 'Healthy',
    projectedPoints: 7.0
  },
  {
    id: 'maddison',
    name: 'James Maddison',
    position: 'MID',
    team: 'TOT',
    teamCode: 'TOT',
    teamName: 'Tottenham',
    price: 6.5,
    totalPoints: 142,
    form: 5.5,
    fixtureDifficulty: 3,
    ownership: 12.7,
    injuryStatus: 'Healthy',
    projectedPoints: 6.5
  },

  // Forwards
  {
    id: 'haaland',
    name: 'Erling Haaland',
    position: 'FWD',
    team: 'MCI',
    teamCode: 'MCI',
    teamName: 'Manchester City',
    price: 14.0,
    totalPoints: 212,
    form: 9.5,
    fixtureDifficulty: 2,
    ownership: 68.4,
    injuryStatus: 'Healthy',
    projectedPoints: 14.0
  },
  {
    id: 'kane',
    name: 'Harry Kane',
    position: 'FWD',
    team: 'BAY',
    teamCode: 'BAY',
    teamName: 'Bayern Munich',
    price: 12.5,
    totalPoints: 195,
    form: 8.2,
    fixtureDifficulty: 2,
    ownership: 42.1,
    injuryStatus: 'Healthy',
    projectedPoints: 12.5
  },
  {
    id: 'watkins',
    name: 'Ollie Watkins',
    position: 'FWD',
    team: 'AVL',
    teamCode: 'AVL',
    teamName: 'Aston Villa',
    price: 8.5,
    totalPoints: 178,
    form: 7.0,
    fixtureDifficulty: 3,
    ownership: 35.8,
    injuryStatus: 'Healthy',
    projectedPoints: 8.5
  },
  {
    id: 'isak',
    name: 'Alexander Isak',
    position: 'FWD',
    team: 'NEW',
    teamCode: 'NEW',
    teamName: 'Newcastle',
    price: 7.5,
    totalPoints: 165,
    form: 6.5,
    fixtureDifficulty: 3,
    ownership: 22.4,
    injuryStatus: 'Healthy',
    projectedPoints: 7.5
  },
  {
    id: 'jesus',
    name: 'Gabriel Jesus',
    position: 'FWD',
    team: 'ARS',
    teamCode: 'ARS',
    teamName: 'Arsenal',
    price: 8.0,
    totalPoints: 158,
    form: 6.2,
    fixtureDifficulty: 3,
    ownership: 18.7,
    injuryStatus: 'Healthy',
    projectedPoints: 8.0
  },
  {
    id: 'nunez',
    name: 'Darwin Núñez',
    position: 'FWD',
    team: 'LIV',
    teamCode: 'LIV',
    teamName: 'Liverpool',
    price: 7.0,
    totalPoints: 145,
    form: 5.8,
    fixtureDifficulty: 2,
    ownership: 15.2,
    injuryStatus: 'Healthy',
    projectedPoints: 7.0
  }
];

export const getPlayersByPosition = (position: Player['position']): FPLPlayer[] => {
  return FPL_PLAYERS.filter(player => player.position === position);
};

export const getPlayerById = (id: string): FPLPlayer | undefined => {
  return FPL_PLAYERS.find(player => player.id === id);
};

export const calculateProjectedPoints = (player: FPLPlayer): number => {
  // Base calculation using form, fixture difficulty, and historical performance
  let basePoints = player.form;
  
  // Adjust for fixture difficulty (easier fixtures = higher projected points)
  const fixtureMultiplier = 1 + (0.2 * (5 - player.fixtureDifficulty));
  basePoints *= fixtureMultiplier;
  
  // Adjust for injury status
  const injuryMultiplier = player.injuryStatus === 'Healthy' ? 1 : 
                          player.injuryStatus === 'Questionable' ? 0.8 :
                          player.injuryStatus === 'Doubtful' ? 0.6 : 0;
  basePoints *= injuryMultiplier;
  
  // Round to 1 decimal place
  return Math.round(basePoints * 10) / 10;
};
