import type { FantasyTeam, AISuggestion, TeamAnalysis, Player } from '../types/fantasy';
import { realAiService } from './realAiService';

// AI service that uses real AI when available, falls back to mock analysis
export class AIService {
  static async analyzeTeam(team: FantasyTeam): Promise<TeamAnalysis> {
    // Try to use real AI service first
    if (realAiService.isAvailable()) {
      try {
        console.log('Using real AI service for team analysis...');
        return await realAiService.analyzeTeam(team);
      } catch (error) {
        console.warn('Real AI service failed, falling back to mock analysis:', error);
        // Fall through to mock analysis
      }
    } else {
      console.log('Real AI service not available, using mock analysis...');
    }

    // Fallback to mock analysis
    return this.mockAnalyzeTeam(team);
  }

  private static async mockAnalyzeTeam(team: FantasyTeam): Promise<TeamAnalysis> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const suggestions: AISuggestion[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Analyze team composition
    const positionCounts = this.getPositionCounts(team.starting11);
    const totalProjectedPoints = team.starting11.reduce((sum, p) => sum + (p.projectedPoints || 0), 0);

    // Check for positional needs (English football)
    if (positionCounts.GK < 1) {
      suggestions.push({
        id: 'need-gk',
        type: 'add',
        priority: 'high',
        title: 'Add a Goalkeeper',
        description: 'Your team needs a starting goalkeeper.',
        reasoning: 'Every fantasy team needs at least one goalkeeper to be competitive.',
        projectedImpact: 15
      });
      weaknesses.push('Missing starting goalkeeper');
    }

    if (positionCounts.DEF < 3) {
      suggestions.push({
        id: 'need-def',
        type: 'add',
        priority: 'high',
        title: 'Add More Defenders',
        description: `You have ${positionCounts.DEF} defender(s). Consider adding more for depth.`,
        reasoning: 'Defenders are crucial for clean sheets and can provide consistent points.',
        projectedImpact: 12
      });
      weaknesses.push('Insufficient defensive depth');
    }

    if (positionCounts.MID < 3) {
      suggestions.push({
        id: 'need-mid',
        type: 'add',
        priority: 'medium',
        title: 'Add More Midfielders',
        description: `You have ${positionCounts.MID} midfielder(s). Consider adding more for depth.`,
        reasoning: 'Midfielders provide goals, assists, and bonus points through tackles and passes.',
        projectedImpact: 10
      });
      weaknesses.push('Limited midfield depth');
    }

    if (positionCounts.FWD < 2) {
      suggestions.push({
        id: 'need-fwd',
        type: 'add',
        priority: 'medium',
        title: 'Add More Forwards',
        description: `You have ${positionCounts.FWD} forward(s). Consider adding more for depth.`,
        reasoning: 'Forwards are your primary goal scorers and can provide high point hauls.',
        projectedImpact: 8
      });
      weaknesses.push('Limited forward depth');
    }

    // Analyze player performance and value
    const lowPerformers = team.starting11.filter(p => (p.projectedPoints || 0) < 4);
    if (lowPerformers.length > 0) {
      suggestions.push({
        id: 'upgrade-low-performers',
        type: 'drop',
        priority: 'medium',
        title: 'Consider Upgrading Low Performers',
        description: `You have ${lowPerformers.length} player(s) with low projected points (< 4.0).`,
        reasoning: 'Players with consistently low projections may not provide good value for money.',
        projectedImpact: 5
      });
      weaknesses.push('Some players have low projected performance');
    }

    // Check for budget optimization
    const totalCost = team.totalCost;
    if (totalCost > 95) {
      suggestions.push({
        id: 'budget-optimization',
        type: 'trade',
        priority: 'medium',
        title: 'Budget Optimization',
        description: `Your team costs £${totalCost.toFixed(1)}m, leaving little room for flexibility.`,
        reasoning: 'Consider cheaper alternatives to free up budget for premium players in key positions.',
        projectedImpact: 3
      });
    }

    // Check for captain options
    const captainOptions = team.starting11.filter(p => (p.projectedPoints || 0) > 8);
    if (captainOptions.length < 2) {
      suggestions.push({
        id: 'captain-options',
        type: 'add',
        priority: 'low',
        title: 'More Captain Options',
        description: 'Consider adding more high-scoring players for captain choices.',
        reasoning: 'Having multiple captain options gives you flexibility and reduces risk.',
        projectedImpact: 4
      });
    }

    // Check for bye week conflicts
    const byeWeekConflicts = this.findByeWeekConflicts(team.starting11);
    if (byeWeekConflicts.length > 0) {
      suggestions.push({
        id: 'bye-week-planning',
        type: 'add',
        priority: 'medium',
        title: 'Plan for Bye Weeks',
        description: `You have potential bye week conflicts in weeks: ${byeWeekConflicts.join(', ')}`,
        reasoning: 'Having multiple players on bye the same week can hurt your lineup.',
        projectedImpact: 10
      });
    }

    // Identify strengths
    if (positionCounts.DEF >= 4) {
      strengths.push('Strong defensive depth');
    }
    if (positionCounts.MID >= 4) {
      strengths.push('Good midfield depth');
    }
    if (positionCounts.FWD >= 2) {
      strengths.push('Strong forward options');
    }
    if (totalProjectedPoints > 80) {
      strengths.push('High projected point total');
    }
    
    // Check for premium players
    const premiumPlayers = team.starting11.filter(p => (p.price || 0) > 8);
    if (premiumPlayers.length >= 3) {
      strengths.push('Good premium player coverage');
    }
    
    // Check for captain options
    if (captainOptions.length >= 2) {
      strengths.push('Multiple captain options');
    }
    
    // Check budget efficiency
    if (totalCost < 90 && totalProjectedPoints > 70) {
      strengths.push('Good budget efficiency');
    }

    // Calculate overall grade
    const grade = this.calculateTeamGrade(team, suggestions, strengths, weaknesses);

    // Generate summary
    const summary = this.generateSummary(team, suggestions, strengths, weaknesses, grade);

    return {
      team,
      suggestions,
      overallGrade: grade,
      strengths,
      weaknesses,
      summary
    };
  }

  private static getPositionCounts(players: Player[]): Record<string, number> {
    return players.reduce((counts, player) => {
      counts[player.position] = (counts[player.position] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }

  private static findByeWeekConflicts(players: Player[]): number[] {
    const byeWeeks: Record<number, number> = {};
    players.forEach(player => {
      if (player.byeWeek) {
        byeWeeks[player.byeWeek] = (byeWeeks[player.byeWeek] || 0) + 1;
      }
    });
    return Object.entries(byeWeeks)
      .filter(([_, count]) => count >= 2)
      .map(([week, _]) => parseInt(week));
  }

  private static calculateTeamGrade(
    team: FantasyTeam,
    suggestions: AISuggestion[],
    strengths: string[],
    weaknesses: string[]
  ): 'A' | 'B' | 'C' | 'D' | 'F' {
    const highPriorityIssues = suggestions.filter(s => s.priority === 'high').length;
    const mediumPriorityIssues = suggestions.filter(s => s.priority === 'medium').length;
    const totalProjectedPoints = team.totalProjectedPoints || 0;

    if (highPriorityIssues === 0 && mediumPriorityIssues <= 1 && totalProjectedPoints > 100) {
      return 'A';
    } else if (highPriorityIssues === 0 && mediumPriorityIssues <= 2 && totalProjectedPoints > 80) {
      return 'B';
    } else if (highPriorityIssues <= 1 && mediumPriorityIssues <= 3 && totalProjectedPoints > 60) {
      return 'C';
    } else if (highPriorityIssues <= 2 && totalProjectedPoints > 40) {
      return 'D';
    } else {
      return 'F';
    }
  }

  private static generateSummary(
    team: FantasyTeam,
    suggestions: AISuggestion[],
    strengths: string[],
    weaknesses: string[],
    grade: 'A' | 'B' | 'C' | 'D' | 'F'
  ): string {
    const totalProjectedPoints = team.totalProjectedPoints || 0;
    
    let summary = `Your ${team.name} team has a projected total of ${totalProjectedPoints.toFixed(1)} points and receives a grade of ${grade}. `;
    
    if (strengths.length > 0) {
      summary += `Strengths include: ${strengths.join(', ')}. `;
    }
    
    if (weaknesses.length > 0) {
      summary += `Areas for improvement: ${weaknesses.join(', ')}. `;
    }
    
    if (suggestions.length > 0) {
      summary += `I recommend focusing on ${suggestions.filter(s => s.priority === 'high').length} high-priority suggestions to improve your team.`;
    } else {
      summary += 'Your team looks well-balanced with no major issues identified.';
    }
    
    return summary;
  }
}
