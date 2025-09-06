import OpenAI from 'openai';
import type { FantasyTeam, TeamAnalysis, AISuggestion } from '../types/fantasy';
import { fplApiService } from './fplApiService';

class RealAIService {
  private openai: OpenAI | null = null;
  private apiKey: string | null = null;

  constructor() {
    // Get API key from environment or prompt user
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
    
    if (this.apiKey) {
      this.openai = new OpenAI({
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true // Only for client-side usage
      });
    }
  }

  async analyzeTeam(team: FantasyTeam): Promise<TeamAnalysis> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }

    try {
      // Get additional context data
      const [allPlayers, currentGameweek, fixtures] = await Promise.all([
        fplApiService.getAllPlayers(),
        fplApiService.getCurrentGameweek(),
        this.getUpcomingFixtures(team)
      ]);

      // Create comprehensive prompt
      const prompt = this.createAnalysisPrompt(team, allPlayers, currentGameweek, fixtures);

      // Call OpenAI API - try different models in order of preference
      const models = ["gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"];
      let completion;
      let lastError;

      for (const model of models) {
        try {
          console.log(`Trying model: ${model}`);
          completion = await this.openai.chat.completions.create({
            model: model,
            messages: [
              {
                role: "system",
                content: "You are an expert Fantasy Premier League analyst with deep knowledge of player form, fixtures, injuries, and FPL strategy. Provide detailed, actionable advice for FPL managers."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2000
          });
          console.log(`Successfully used model: ${model}`);
          break; // Success, exit the loop
        } catch (error) {
          console.warn(`Model ${model} failed:`, error);
          lastError = error;
          continue; // Try next model
        }
      }

      if (!completion) {
        throw new Error(`All models failed. Last error: ${lastError instanceof Error ? lastError.message : 'Unknown error'}. Please check your OpenAI account has access to GPT models.`);
      }

      const analysisText = completion.choices[0]?.message?.content || 'No analysis available';
      
      // Parse the AI response into structured data
      return this.parseAIResponse(analysisText, team);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error('Failed to analyze team with AI. Please check your API key and try again.');
    }
  }

  private async getUpcomingFixtures(team: FantasyTeam): Promise<any[]> {
    try {
      // Get fixtures for the next 3 gameweeks for teams in the user's squad
      const teamIds = [...team.starting11, ...team.bench]
        .map(player => player.team)
        .filter((team, index, arr) => arr.indexOf(team) === index); // Remove duplicates

      const fixtures = [];
      for (let gw = 1; gw <= 3; gw++) {
        try {
          const gwFixtures = await fplApiService.fetchWithCache(`/fixtures/?event=${gw}`);
          fixtures.push(...gwFixtures);
        } catch (error) {
          console.warn(`Could not fetch fixtures for gameweek ${gw}:`, error);
        }
      }

      return fixtures;
    } catch (error) {
      console.warn('Could not fetch fixtures:', error);
      return [];
    }
  }

  private createAnalysisPrompt(team: FantasyTeam, allPlayers: any[], currentGameweek: number, fixtures: any[]): string {
    const teamPlayers = [...team.starting11, ...team.bench];
    const totalCost = team.totalCost;
    const totalProjectedPoints = team.totalProjectedPoints || 0;

    let prompt = `Analyze this Fantasy Premier League team and provide detailed recommendations:

TEAM OVERVIEW:
- Formation: ${team.formation}
- Total Cost: £${totalCost}m
- Total Projected Points: ${totalProjectedPoints}
- Current Gameweek: ${currentGameweek}

STARTING 11:
${team.starting11.map((player, index) => 
  `${index + 1}. ${player.name} (${player.position}) - ${player.team} - £${player.price}m - ${player.totalPoints}pts - Form: ${player.form || 'N/A'}`
).join('\n')}

BENCH:
${team.bench.map((player, index) => 
  `${index + 1}. ${player.name} (${player.position}) - ${player.team} - £${player.price}m - ${player.totalPoints}pts`
).join('\n')}

UPCOMING FIXTURES (Next 3 Gameweeks):
${fixtures.slice(0, 20).map(fixture => 
  `GW${fixture.event}: ${fixture.team_h} vs ${fixture.team_a} (${fixture.team_h_difficulty}/${fixture.team_a_difficulty})`
).join('\n')}

Please provide:
1. Overall team grade (A+ to F)
2. Detailed analysis of strengths and weaknesses
3. Specific transfer recommendations with reasoning
4. Captain and vice-captain suggestions
5. Formation optimization advice
6. Budget allocation analysis
7. Fixture difficulty considerations
8. Risk assessment and potential issues

Format your response as JSON with this structure:
{
  "overallGrade": "A+",
  "summary": "Brief overall assessment",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": [
    {
      "type": "TRANSFER_IN" | "TRANSFER_OUT" | "CAPTAIN" | "FORMATION",
      "title": "Suggestion title",
      "description": "Detailed explanation",
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "reasoning": "Why this suggestion makes sense"
    }
  ]
}`;

    return prompt;
  }

  private parseAIResponse(response: string, team: FantasyTeam): TeamAnalysis {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          team,
          overallGrade: parsed.overallGrade || 'B',
          summary: parsed.summary || 'AI analysis completed',
          strengths: parsed.strengths || [],
          weaknesses: parsed.weaknesses || [],
          suggestions: parsed.suggestions || []
        };
      }
    } catch (error) {
      console.warn('Could not parse AI response as JSON:', error);
    }

    // Fallback: create a basic analysis from the text response
    return {
      team,
      overallGrade: 'B',
      summary: response.substring(0, 200) + '...',
      strengths: ['AI analysis provided'],
      weaknesses: ['Could not parse detailed analysis'],
      suggestions: [{
        type: 'TRANSFER_IN',
        title: 'AI Analysis Available',
        description: response,
        priority: 'MEDIUM',
        reasoning: 'Full AI analysis provided in description'
      }]
    };
  }

  // Method to check if AI is available
  isAvailable(): boolean {
    return this.openai !== null;
  }

  // Method to set API key dynamically
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.openai = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true
    });
  }
}

export const realAiService = new RealAIService();
