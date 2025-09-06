import type { Player } from '../types/fantasy';

export interface FPLPlayerData {
  id: number;
  web_name: string;
  first_name: string;
  second_name: string;
  element_type: number; // 1=GK, 2=DEF, 3=MID, 4=FWD
  team: number;
  now_cost: number; // Price in tenths (e.g., 85 = £8.5m)
  total_points: number;
  form: string; // Recent form
  points_per_game: string;
  selected_by_percent: string; // Ownership percentage
  news: string; // Injury/news
  news_added?: string;
  status: string; // 'a'=available, 'd'=doubtful, 'i'=injured, 's'=suspended
  chance_of_playing_this_round?: number;
  chance_of_playing_next_round?: number;
  value_form: string;
  value_season: string;
  cost_change_start: number;
  cost_change_event: number;
  cost_change_start_fall: number;
  cost_change_event_fall: number;
  in_dreamteam: boolean;
  dreamteam_count: number;
  in_form: boolean;
  creativity: string;
  creativity_rank: number;
  creativity_rank_type: number;
  threat: string;
  threat_rank: number;
  threat_rank_type: number;
  ict_index: string;
  ict_index_rank: number;
  ict_index_rank_type: number;
  starts: number;
  expected_goals: string;
  expected_assists: string;
  expected_goal_involvements: string;
  expected_goals_conceded: string;
  influence: string;
  influence_rank: number;
  influence_rank_type: number;
  clean_sheets: number;
  saves: number;
  bonus: number;
  bps: number;
  transfers_in: number;
  transfers_out: number;
  transfers_in_event: number;
  transfers_out_event: number;
  penalties_missed: number;
  penalties_saved: number;
  yellow_cards: number;
  red_cards: number;
  goals_scored: number;
  assists: number;
  own_goals: number;
  goals_conceded: number;
  expected_goals_per_90: string;
  saves_per_90: string;
  expected_assists_per_90: string;
  expected_goal_involvements_per_90: string;
  expected_goals_conceded_per_90: string;
  goals_conceded_per_90: string;
  now_cost_rank: number;
  now_cost_rank_type: number;
  form_rank: number;
  form_rank_type: number;
  points_per_game_rank: number;
  points_per_game_rank_type: number;
  selected_rank: number;
  selected_rank_type: number;
  starts_per_90: string;
  clean_sheets_per_90: string;
}

export interface FPLTeamData {
  id: number;
  name: string;
  short_name: string;
  strength: number;
  strength_overall_home: number;
  strength_overall_away: number;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
  team_division: number;
}

export interface FPLBootstrapData {
  elements: FPLPlayerData[];
  teams: FPLTeamData[];
  element_types: Array<{
    id: number;
    plural_name: string;
    plural_name_short: string;
    singular_name: string;
    singular_name_short: string;
    squad_select: number;
    squad_min_play: number;
    squad_max_play: number;
    ui_shirt_specific: boolean;
    sub_positions_locked: number[];
    element_count: number;
  }>;
  events: Array<{
    id: number;
    name: string;
    deadline_time: string;
    average_entry_score: number;
    finished: boolean;
    data_checked: boolean;
    highest_scoring_entry: number;
    deadline_time_epoch: number;
    deadline_time_game_offset: number;
    highest_score: number;
    is_previous: boolean;
    is_current: boolean;
    is_next: boolean;
    cup_leagues_created: boolean;
    h2h_ko_matches_created: boolean;
    chip_plays: any[];
    most_selected: number;
    most_transferred_in: number;
    top_element: number;
    top_element_info: {
      id: number;
      points: number;
    };
    transfers_made: number;
    most_captained: number;
    most_vice_captained: number;
  }>;
  game_settings: {
    league_join_private_max: number;
    league_join_public_max: number;
    league_max_size_public_classic: number;
    league_max_size_public_h2h: number;
    league_max_size_private_h2h: number;
    league_max_ko_rounds_private_h2h: number;
    league_prefix_public: string;
    league_points_h2h_win: number;
    league_points_h2h_lose: number;
    league_points_h2h_draw: number;
    league_ko_first_instead_of_random: boolean;
    cup_start_event_id: number;
    cup_stop_event_id: number;
    cup_qualifying_method: string;
    cup_type: string;
    squad_squadplay: number;
    squad_squadsize: number;
    squad_team_limit: number;
    squad_total_spend: number;
    ui_currency_multiplier: number;
    ui_use_special_shirts: boolean;
    ui_special_shirt_exclusions: any[];
    stats_form_days: number;
    sys_vice_captain_enabled: boolean;
    transfers_cap: number;
    transfers_sell_on_fee: number;
    league_h2h_tiebreak_stats: string[];
    timezone: string;
  };
  phases: any[];
  total_players: number;
  element_stats: Array<{
    label: string;
    name: string;
  }>;
}

class FPLApiService {
  private baseUrl = '/api'; // Use Vite proxy
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private async fetchWithCache<T>(endpoint: string): Promise<T> {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('FPL API Error:', error);
      throw error;
    }
  }

  async getBootstrapData(): Promise<FPLBootstrapData> {
    return this.fetchWithCache<FPLBootstrapData>('/bootstrap-static/');
  }

  async getPlayerData(): Promise<FPLPlayerData[]> {
    const bootstrapData = await this.getBootstrapData();
    return bootstrapData.elements;
  }

  async getTeamData(): Promise<FPLTeamData[]> {
    const bootstrapData = await this.getBootstrapData();
    return bootstrapData.teams;
  }

  async getCurrentGameweek(): Promise<number> {
    const bootstrapData = await this.getBootstrapData();
    const currentEvent = bootstrapData.events.find(event => event.is_current);
    return currentEvent ? currentEvent.id : 1;
  }

  convertFPLPlayerToAppPlayer(fplPlayer: FPLPlayerData, teamData: FPLTeamData[]): Player {
    const team = teamData.find(t => t.id === fplPlayer.team);
    const positionMap = { 1: 'GK', 2: 'DEF', 3: 'MID', 4: 'FWD' } as const;
    
    return {
      id: fplPlayer.id.toString(),
      name: fplPlayer.web_name,
      position: positionMap[fplPlayer.element_type] || 'GK',
      team: team?.short_name || 'UNK',
      price: fplPlayer.now_cost / 10, // Convert from tenths to actual price
      projectedPoints: this.calculateProjectedPoints(fplPlayer),
      totalPoints: fplPlayer.total_points,
      form: parseFloat(fplPlayer.form) || 0,
      ownership: parseFloat(fplPlayer.selected_by_percent) || 0,
      injuryStatus: this.getInjuryStatus(fplPlayer.status, fplPlayer.chance_of_playing_this_round),
      news: fplPlayer.news || undefined
    };
  }

  private calculateProjectedPoints(fplPlayer: FPLPlayerData): number {
    // Base calculation using form and points per game
    const form = parseFloat(fplPlayer.form) || 0;
    const pointsPerGame = parseFloat(fplPlayer.points_per_game) || 0;
    
    // Use the higher of form or points per game as base
    let basePoints = Math.max(form, pointsPerGame);
    
    // Adjust for injury status
    const injuryMultiplier = this.getInjuryMultiplier(fplPlayer.status, fplPlayer.chance_of_playing_this_round);
    basePoints *= injuryMultiplier;
    
    // Round to 1 decimal place
    return Math.round(basePoints * 10) / 10;
  }

  private getInjuryStatus(status: string, chanceOfPlaying?: number): 'Healthy' | 'Questionable' | 'Doubtful' | 'Out' {
    switch (status) {
      case 'a': return 'Healthy';
      case 'd': return chanceOfPlaying && chanceOfPlaying > 50 ? 'Questionable' : 'Doubtful';
      case 'i': return 'Out';
      case 's': return 'Out';
      default: return 'Healthy';
    }
  }

  private getInjuryMultiplier(status: string, chanceOfPlaying?: number): number {
    switch (status) {
      case 'a': return 1.0;
      case 'd': return (chanceOfPlaying || 0) / 100;
      case 'i': return 0;
      case 's': return 0;
      default: return 1.0;
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    try {
      const [playerData, teamData] = await Promise.all([
        this.getPlayerData(),
        this.getTeamData()
      ]);

      return playerData.map(fplPlayer => 
        this.convertFPLPlayerToAppPlayer(fplPlayer, teamData)
      );
    } catch (error) {
      console.error('Error fetching FPL players:', error);
      console.log('Falling back to static player data...');
      return this.getFallbackPlayers();
    }
  }

  private getFallbackPlayers(): Player[] {
    // Fallback static data in case API fails
    return [
      // Goalkeepers
      {
        id: '1',
        name: 'Alisson',
        position: 'GK',
        team: 'LIV',
        price: 5.8,
        projectedPoints: 5.8,
        totalPoints: 142,
        form: 4.2,
        ownership: 15.2,
        injuryStatus: 'Healthy'
      },
      {
        id: '2',
        name: 'Ederson',
        position: 'GK',
        team: 'MCI',
        price: 5.5,
        projectedPoints: 5.5,
        totalPoints: 138,
        form: 4.0,
        ownership: 12.8,
        injuryStatus: 'Healthy'
      },
      {
        id: '3',
        name: 'Aaron Ramsdale',
        position: 'GK',
        team: 'ARS',
        price: 5.0,
        projectedPoints: 5.0,
        totalPoints: 125,
        form: 3.8,
        ownership: 8.5,
        injuryStatus: 'Healthy'
      },
      // Defenders
      {
        id: '4',
        name: 'Trent Alexander-Arnold',
        position: 'DEF',
        team: 'LIV',
        price: 8.5,
        projectedPoints: 8.5,
        totalPoints: 156,
        form: 6.8,
        ownership: 25.3,
        injuryStatus: 'Healthy'
      },
      {
        id: '5',
        name: 'Virgil van Dijk',
        position: 'DEF',
        team: 'LIV',
        price: 6.2,
        projectedPoints: 6.2,
        totalPoints: 145,
        form: 5.2,
        ownership: 18.7,
        injuryStatus: 'Healthy'
      },
      {
        id: '6',
        name: 'Kyle Walker',
        position: 'DEF',
        team: 'MCI',
        price: 5.5,
        projectedPoints: 5.5,
        totalPoints: 132,
        form: 4.8,
        ownership: 12.4,
        injuryStatus: 'Healthy'
      },
      {
        id: '7',
        name: 'William Saliba',
        position: 'DEF',
        team: 'ARS',
        price: 5.0,
        projectedPoints: 5.0,
        totalPoints: 128,
        form: 4.5,
        ownership: 15.6,
        injuryStatus: 'Healthy'
      },
      {
        id: '8',
        name: 'Kieran Trippier',
        position: 'DEF',
        team: 'NEW',
        price: 6.5,
        projectedPoints: 6.5,
        totalPoints: 142,
        form: 5.8,
        ownership: 22.1,
        injuryStatus: 'Healthy'
      },
      // Midfielders
      {
        id: '9',
        name: 'Mohamed Salah',
        position: 'MID',
        team: 'LIV',
        price: 13.0,
        projectedPoints: 13.0,
        totalPoints: 198,
        form: 8.2,
        ownership: 45.7,
        injuryStatus: 'Healthy'
      },
      {
        id: '10',
        name: 'Kevin De Bruyne',
        position: 'MID',
        team: 'MCI',
        price: 10.5,
        projectedPoints: 10.5,
        totalPoints: 185,
        form: 7.8,
        ownership: 38.2,
        injuryStatus: 'Healthy'
      },
      {
        id: '11',
        name: 'Bruno Fernandes',
        position: 'MID',
        team: 'MUN',
        price: 8.5,
        projectedPoints: 8.5,
        totalPoints: 172,
        form: 6.5,
        ownership: 28.4,
        injuryStatus: 'Healthy'
      },
      {
        id: '12',
        name: 'Bukayo Saka',
        position: 'MID',
        team: 'ARS',
        price: 8.0,
        projectedPoints: 8.0,
        totalPoints: 168,
        form: 6.8,
        ownership: 32.1,
        injuryStatus: 'Healthy'
      },
      {
        id: '13',
        name: 'Son Heung-min',
        position: 'MID',
        team: 'TOT',
        price: 9.0,
        projectedPoints: 9.0,
        totalPoints: 175,
        form: 7.2,
        ownership: 25.6,
        injuryStatus: 'Healthy'
      },
      {
        id: '14',
        name: 'Marcus Rashford',
        position: 'MID',
        team: 'MUN',
        price: 7.5,
        projectedPoints: 7.5,
        totalPoints: 158,
        form: 6.0,
        ownership: 18.9,
        injuryStatus: 'Healthy'
      },
      {
        id: '15',
        name: 'Gabriel Martinelli',
        position: 'MID',
        team: 'ARS',
        price: 7.0,
        projectedPoints: 7.0,
        totalPoints: 145,
        form: 5.8,
        ownership: 15.3,
        injuryStatus: 'Healthy'
      },
      {
        id: '16',
        name: 'James Maddison',
        position: 'MID',
        team: 'TOT',
        price: 6.5,
        projectedPoints: 6.5,
        totalPoints: 142,
        form: 5.5,
        ownership: 12.7,
        injuryStatus: 'Healthy'
      },
      // Forwards
      {
        id: '17',
        name: 'Erling Haaland',
        position: 'FWD',
        team: 'MCI',
        price: 14.0,
        projectedPoints: 14.0,
        totalPoints: 212,
        form: 9.5,
        ownership: 68.4,
        injuryStatus: 'Healthy'
      },
      {
        id: '18',
        name: 'Harry Kane',
        position: 'FWD',
        team: 'BAY',
        price: 12.5,
        projectedPoints: 12.5,
        totalPoints: 195,
        form: 8.2,
        ownership: 42.1,
        injuryStatus: 'Healthy'
      },
      {
        id: '19',
        name: 'Ollie Watkins',
        position: 'FWD',
        team: 'AVL',
        price: 8.5,
        projectedPoints: 8.5,
        totalPoints: 178,
        form: 7.0,
        ownership: 35.8,
        injuryStatus: 'Healthy'
      },
      {
        id: '20',
        name: 'Alexander Isak',
        position: 'FWD',
        team: 'NEW',
        price: 7.5,
        projectedPoints: 7.5,
        totalPoints: 165,
        form: 6.5,
        ownership: 22.4,
        injuryStatus: 'Healthy'
      },
      {
        id: '21',
        name: 'Gabriel Jesus',
        position: 'FWD',
        team: 'ARS',
        price: 8.0,
        projectedPoints: 8.0,
        totalPoints: 158,
        form: 6.2,
        ownership: 18.7,
        injuryStatus: 'Healthy'
      },
      {
        id: '22',
        name: 'Darwin Núñez',
        position: 'FWD',
        team: 'LIV',
        price: 7.0,
        projectedPoints: 7.0,
        totalPoints: 145,
        form: 5.8,
        ownership: 15.2,
        injuryStatus: 'Healthy'
      }
    ];
  }

  async getPlayersByPosition(position: Player['position']): Promise<Player[]> {
    const allPlayers = await this.getAllPlayers();
    return allPlayers.filter(player => player.position === position);
  }

  async getPlayerById(id: string): Promise<Player | undefined> {
    const allPlayers = await this.getAllPlayers();
    return allPlayers.find(player => player.id === id);
  }

  async getTeamByID(teamId: string): Promise<{ team: any; picks: any[] }> {
    try {
      console.log('API: Fetching team data for ID:', teamId);
      
      const [teamData, currentGameweek] = await Promise.all([
        this.fetchWithCache(`/entry/${teamId}/`),
        this.getCurrentGameweek()
      ]);

      console.log('API: Team data received:', teamData);
      console.log('API: Current gameweek:', currentGameweek);

      // Get the team picks for the current gameweek
      const picksData = await this.fetchWithCache(`/entry/${teamId}/event/${currentGameweek}/picks/`);
      
      console.log('API: Picks data received:', picksData);
      
      return {
        team: teamData,
        picks: picksData.picks || []
      };
    } catch (error) {
      console.error('Error fetching team data:', error);
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error(`Team ID ${teamId} not found. Please check your team ID and try again.`);
      }
      throw new Error(`Failed to fetch team data for ID: ${teamId}. ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }


  async convertTeamPicksToPlayers(teamPicks: any[], allPlayers: Player[]): Promise<Player[]> {
    const playerMap = new Map(allPlayers.map(player => [player.id, player]));
    const convertedPlayers: Player[] = [];

    for (const pick of teamPicks) {
      const player = playerMap.get(pick.element.toString());
      if (player) {
        convertedPlayers.push({
          ...player,
          // Add any additional data from the pick if needed
        });
      }
    }

    return convertedPlayers;
  }

  // Clear cache (useful for testing or forcing refresh)
  clearCache(): void {
    this.cache.clear();
  }
}

export const fplApiService = new FPLApiService();
