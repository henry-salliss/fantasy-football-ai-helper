export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  team: string;
  projectedPoints?: number;
  actualPoints?: number;
  totalPoints?: number;
  form?: number;
  ownership?: number;
  injuryStatus?: 'Healthy' | 'Questionable' | 'Doubtful' | 'Out';
  price?: number; // Player price in fantasy football
}

export interface FantasyTeam {
  id: string;
  name: string;
  starting11: Player[];
  bench: Player[];
  formation: string;
  totalCost: number;
  totalProjectedPoints?: number;
  totalActualPoints?: number;
}

export interface AISuggestion {
  id: string;
  type: 'add' | 'drop' | 'start' | 'bench' | 'trade';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reasoning: string;
  player?: Player;
  targetPlayer?: Player;
  projectedImpact?: number;
}

export interface TeamAnalysis {
  team: FantasyTeam;
  suggestions: AISuggestion[];
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  strengths: string[];
  weaknesses: string[];
  summary: string;
}
