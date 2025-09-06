import type { Player } from '../types/fantasy';

export interface ParsedTeamData {
  players: Player[];
  errors: string[];
}

export class FPLCSVParser {
  static parseCSV(content: string): ParsedTeamData {
    const errors: string[] = [];
    const players: Player[] = [];
    
    try {
      const lines = content.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        errors.push('CSV file is empty');
        return { players, errors };
      }

      // Skip header row if it exists
      const dataLines = lines[0].toLowerCase().includes('name') ? lines.slice(1) : lines;
      
      dataLines.forEach((line, index) => {
        try {
          const player = this.parsePlayerLine(line.trim(), index + 1);
          if (player) {
            players.push(player);
          }
        } catch (error) {
          errors.push(`Line ${index + 1}: ${error instanceof Error ? error.message : 'Invalid format'}`);
        }
      });

      // Validate team composition
      this.validateTeamComposition(players, errors);

    } catch (error) {
      errors.push(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { players, errors };
  }

  private static parsePlayerLine(line: string, lineNumber: number): Player | null {
    if (!line) return null;

    // Handle different CSV formats
    const formats = [
      // Format 1: Name,Position,Team,ProjectedPoints
      /^([^,]+),([^,]+),([^,]+),([^,]*)$/,
      // Format 2: Name,Position,Team (no projected points)
      /^([^,]+),([^,]+),([^,]+)$/,
      // Format 3: Name,Position,Team,Price,ProjectedPoints
      /^([^,]+),([^,]+),([^,]+),([^,]+),([^,]*)$/,
    ];

    let match: RegExpMatchArray | null = null;
    let formatIndex = -1;

    for (let i = 0; i < formats.length; i++) {
      match = line.match(formats[i]);
      if (match) {
        formatIndex = i;
        break;
      }
    }

    if (!match) {
      throw new Error(`Invalid format. Expected: Name,Position,Team,ProjectedPoints`);
    }

    const name = match[1].trim();
    const position = this.normalizePosition(match[2].trim());
    const team = match[3].trim();
    const projectedPoints = formatIndex === 1 ? 0 : parseFloat(match[4] || '0') || 0;
    const price = formatIndex === 2 ? parseFloat(match[4] || '0') || 0 : undefined;

    if (!name) {
      throw new Error('Player name is required');
    }

    if (!position) {
      throw new Error('Valid position is required (GK, DEF, MID, FWD)');
    }

    if (!team) {
      throw new Error('Team is required');
    }

    return {
      id: `imported-${lineNumber}-${Date.now()}`,
      name,
      position,
      team,
      projectedPoints,
      price
    };
  }

  private static normalizePosition(position: string): Player['position'] | null {
    const positionMap: Record<string, Player['position']> = {
      // Goalkeeper variations
      'gk': 'GK',
      'gkp': 'GK',
      'goalkeeper': 'GK',
      'keeper': 'GK',
      
      // Defender variations
      'def': 'DEF',
      'defender': 'DEF',
      'defence': 'DEF',
      
      // Midfielder variations
      'mid': 'MID',
      'midfielder': 'MID',
      'midfield': 'MID',
      
      // Forward variations
      'fwd': 'FWD',
      'forward': 'FWD',
      'striker': 'FWD',
      'attacker': 'FWD',
    };

    return positionMap[position.toLowerCase()] || null;
  }

  private static validateTeamComposition(players: Player[], errors: string[]): void {
    const positionCounts = players.reduce((counts, player) => {
      counts[player.position] = (counts[player.position] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    // Check for minimum requirements
    if (positionCounts.GK < 1) {
      errors.push('Team needs at least 1 goalkeeper');
    }
    if (positionCounts.DEF < 3) {
      errors.push('Team needs at least 3 defenders');
    }
    if (positionCounts.MID < 3) {
      errors.push('Team needs at least 3 midfielders');
    }
    if (positionCounts.FWD < 1) {
      errors.push('Team needs at least 1 forward');
    }

    // Check for maximum limits (typical FPL squad size)
    const totalPlayers = players.length;
    if (totalPlayers > 15) {
      errors.push('Team has too many players (maximum 15)');
    }
    if (totalPlayers < 11) {
      errors.push('Team needs at least 11 players');
    }
  }

  static generateSampleCSV(): string {
    return `Name,Position,Team,ProjectedPoints
Alisson,GK,LIV,5.8
Virgil van Dijk,DEF,LIV,6.2
Trent Alexander-Arnold,DEF,LIV,8.5
Kyle Walker,DEF,MCI,5.5
Mohamed Salah,MID,LIV,13.0
Kevin De Bruyne,MID,MCI,10.5
Bruno Fernandes,MID,MUN,8.5
Erling Haaland,FWD,MCI,14.0
Harry Kane,FWD,BAY,12.5`;
  }
}
