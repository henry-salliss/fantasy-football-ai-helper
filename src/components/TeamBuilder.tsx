import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Brain } from 'lucide-react';
import type { Player, FantasyTeam } from '../types/fantasy';
import { fplApiService } from '../services/fplApiService';
import { FPL_FORMATIONS } from '../data/fplPlayers';
import PlayerSearchInput from './PlayerSearchInput';
import FootballPitch from './FootballPitch';
import FPLExportHelper from './FPLExportHelper';
import { AIConfig } from './AIConfig';
import { realAiService } from '../services/realAiService';

interface TeamBuilderProps {
  onTeamSubmit: (team: FantasyTeam) => void;
}

const TeamBuilder: React.FC<TeamBuilderProps> = ({ onTeamSubmit }) => {
  const [teamName, setTeamName] = useState('');
  const [selectedFormation, setSelectedFormation] = useState('3-4-3');
  const [starting11, setStarting11] = useState<Player[]>([]);
  const [bench, setBench] = useState<Player[]>([]);
  const [showExportHelper, setShowExportHelper] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [teamIdInput, setTeamIdInput] = useState('');
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [showAIConfig, setShowAIConfig] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(realAiService.isAvailable());

  const positions: Player['position'][] = ['GK', 'DEF', 'MID', 'FWD'];

  // Fetch players from FPL API on component mount
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        setUsingFallbackData(false);
        const allPlayers = await fplApiService.getAllPlayers();
        setPlayers(allPlayers);
        
        // Check if we got fallback data (fewer players than expected from API)
        if (allPlayers.length < 100) {
          setUsingFallbackData(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load player data');
        console.error('Error fetching players:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Update team when formation changes
  useEffect(() => {
    const formationPositions = getFormationPositions(selectedFormation);
    const newStarting11: Player[] = [];
    const newBench: Player[] = [...bench];

    // Reorganize players based on new formation
    const allPlayers = [...starting11, ...bench];
    
    // Add goalkeeper
    const gk = allPlayers.find(p => p.position === 'GK');
    if (gk) newStarting11.push(gk);

    // Add defenders
    const defenders = allPlayers.filter(p => p.position === 'DEF');
    newStarting11.push(...defenders.slice(0, formationPositions.defenders));
    newBench.push(...defenders.slice(formationPositions.defenders));

    // Add midfielders
    const midfielders = allPlayers.filter(p => p.position === 'MID');
    newStarting11.push(...midfielders.slice(0, formationPositions.midfielders));
    newBench.push(...midfielders.slice(formationPositions.midfielders));

    // Add forwards
    const forwards = allPlayers.filter(p => p.position === 'FWD');
    newStarting11.push(...forwards.slice(0, formationPositions.forwards));
    newBench.push(...forwards.slice(formationPositions.forwards));

    setStarting11(newStarting11);
    setBench(newBench);
  }, [selectedFormation]);

  const getFormationPositions = (formation: string) => {
    const parts = formation.split('-');
    return {
      defenders: parseInt(parts[0]) || 4,
      midfielders: parseInt(parts[1]) || 3,
      forwards: parseInt(parts[2]) || 3
    };
  };

  const handleFetchTeam = async () => {
    const trimmedTeamId = teamIdInput.trim();
    
    if (!trimmedTeamId) {
      setTeamError('Please enter a valid team ID');
      return;
    }

    // Validate team ID is numeric
    if (!/^\d+$/.test(trimmedTeamId)) {
      setTeamError('Team ID must be a number (e.g., 1234567)');
      return;
    }

    try {
      setLoadingTeam(true);
      setTeamError(null);
      
      console.log('Fetching team with ID:', trimmedTeamId);
      
      const [teamData, allPlayers] = await Promise.all([
        fplApiService.getTeamByID(trimmedTeamId),
        fplApiService.getAllPlayers()
      ]);

      const teamPlayers = await fplApiService.convertTeamPicksToPlayers(teamData.picks, allPlayers);
      
      console.log('Team players from API:', teamPlayers);
      console.log('Team picks from API:', teamData.picks);
      
      // Update team name from API data
      setTeamName(teamData.team.name || `Team ${teamIdInput}`);
      
      // Process FPL team data - the picks array contains all 15 players
      // We need to determine which are starting 11 vs bench based on the formation
      const formationPositions = getFormationPositions(selectedFormation);
      const newStarting11: Player[] = [];
      const newBench: Player[] = [];
      
      // Group players by position
      const playersByPosition = {
        GK: teamPlayers.filter(p => p.position === 'GK'),
        DEF: teamPlayers.filter(p => p.position === 'DEF'),
        MID: teamPlayers.filter(p => p.position === 'MID'),
        FWD: teamPlayers.filter(p => p.position === 'FWD')
      };
      
      console.log('Players by position:', playersByPosition);
      
      // Add players to starting 11 based on formation
      // Add 1 goalkeeper
      if (playersByPosition.GK.length > 0) {
        newStarting11.push(playersByPosition.GK[0]);
        newBench.push(...playersByPosition.GK.slice(1));
      }
      
      // Add defenders
      newStarting11.push(...playersByPosition.DEF.slice(0, formationPositions.defenders));
      newBench.push(...playersByPosition.DEF.slice(formationPositions.defenders));
      
      // Add midfielders
      newStarting11.push(...playersByPosition.MID.slice(0, formationPositions.midfielders));
      newBench.push(...playersByPosition.MID.slice(formationPositions.midfielders));
      
      // Add forwards
      newStarting11.push(...playersByPosition.FWD.slice(0, formationPositions.forwards));
      newBench.push(...playersByPosition.FWD.slice(formationPositions.forwards));
      
      console.log('New starting 11:', newStarting11);
      console.log('New bench:', newBench);

      setStarting11(newStarting11);
      setBench(newBench);
      setTeamIdInput('');
      
    } catch (err) {
      setTeamError(err instanceof Error ? err.message : 'Failed to fetch team data');
      console.error('Error fetching team:', err);
    } finally {
      setLoadingTeam(false);
    }
  };

  const addPlayer = (player: Player) => {
    const allPlayers = [...starting11, ...bench];
    
    // Check if player is already in team
    if (allPlayers.some(p => p.id === player.id)) {
      return;
    }

    // Check if we have space (max 15 players)
    if (allPlayers.length >= 15) {
      alert('You can only have 15 players in your squad');
      return;
    }

    const formationPositions = getFormationPositions(selectedFormation);
    const positionCounts = {
      GK: starting11.filter(p => p.position === 'GK').length,
      DEF: starting11.filter(p => p.position === 'DEF').length,
      MID: starting11.filter(p => p.position === 'MID').length,
      FWD: starting11.filter(p => p.position === 'FWD').length
    };

    // Add to starting 11 if there's space, otherwise to bench
    if (player.position === 'GK' && positionCounts.GK < 1) {
      setStarting11(prev => [...prev, player]);
    } else if (player.position === 'DEF' && positionCounts.DEF < formationPositions.defenders) {
      setStarting11(prev => [...prev, player]);
    } else if (player.position === 'MID' && positionCounts.MID < formationPositions.midfielders) {
      setStarting11(prev => [...prev, player]);
    } else if (player.position === 'FWD' && positionCounts.FWD < formationPositions.forwards) {
      setStarting11(prev => [...prev, player]);
    } else {
      setBench(prev => [...prev, player]);
    }
  };

  // const removePlayer = (playerId: string) => {
  //   setStarting11(prev => prev.filter(p => p.id !== playerId));
  //   setBench(prev => prev.filter(p => p.id !== playerId));
  // };

  const movePlayer = (player: Player, fromStarting: boolean) => {
    if (fromStarting) {
      setStarting11(prev => prev.filter(p => p.id !== player.id));
      setBench(prev => [...prev, player]);
    } else {
      setBench(prev => prev.filter(p => p.id !== player.id));
      setStarting11(prev => [...prev, player]);
    }
  };

  const getTotalCost = () => {
    const allPlayers = [...starting11, ...bench];
    return allPlayers.reduce((total, player) => total + (player.price || 0), 0);
  };

  const getTotalProjectedPoints = () => {
    return starting11.reduce((total, player) => total + (player.projectedPoints || 0), 0);
  };

  const handleSubmit = () => {
    if (starting11.length !== 11) {
      alert('Please select exactly 11 players for your starting lineup');
      return;
    }

    if (!teamName.trim()) {
      alert('Please enter a team name');
      return;
    }

    const team: FantasyTeam = {
      id: Date.now().toString(),
      name: teamName,
      starting11,
      bench,
      formation: selectedFormation,
      totalCost: getTotalCost(),
      totalProjectedPoints: getTotalProjectedPoints()
    };

    onTeamSubmit(team);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading FPL Data</h2>
            <p className="text-gray-600">Fetching latest player information from Fantasy Premier League...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Player Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fantasy Premier League AI Helper</h1>
        <p className="text-gray-600">Build your FPL team and get AI-powered analysis</p>
        {usingFallbackData ? (
          <p className="text-sm text-yellow-600 mt-1">⚠️ Using fallback data (API unavailable)</p>
        ) : (
          <p className="text-sm text-green-600 mt-1">✓ Live data from Fantasy Premier League API</p>
        )}
      </div>

      {/* Team ID Input Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">⚡</span>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">Quick Team Import</h3>
            <p className="text-sm text-gray-600">Enter your FPL Team ID to automatically load your current team</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter your FPL Team ID (e.g., 1234567)"
              value={teamIdInput}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numeric input
                if (value === '' || /^\d+$/.test(value)) {
                  setTeamIdInput(value);
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loadingTeam}
            />
            {teamError && (
              <p className="text-red-600 text-sm mt-2">{teamError}</p>
            )}
          </div>
          <button
            onClick={handleFetchTeam}
            disabled={loadingTeam || !teamIdInput.trim()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingTeam ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <span>🚀</span>
                Load Team
              </>
            )}
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          <p>💡 <strong>How to find your Team ID:</strong> Go to your FPL team page and look at the URL - it will be the number after "entry/" (e.g., fantasy.premierleague.com/entry/1234567/event/1)</p>
          <p className="mt-1">🧪 <strong>Test with:</strong> Try team ID <code className="bg-gray-200 px-1 rounded">1</code> for a sample team</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Team Info */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Details</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter team name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formation
              </label>
              <select
                value={selectedFormation}
                onChange={(e) => setSelectedFormation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {FPL_FORMATIONS.map(formation => (
                  <option key={formation.name} value={formation.name}>
                    {formation.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Starting 11:</span>
                <span className="font-medium">{starting11.length}/11</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bench:</span>
                <span className="font-medium">{bench.length}/4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Cost:</span>
                <span className="font-medium">£{getTotalCost().toFixed(1)}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Projected Points:</span>
                <span className="font-medium">{getTotalProjectedPoints().toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Player Search */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Players</h3>
            <div className="space-y-3">
              {positions.map(position => (
                <div key={position}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {position}
                  </label>
                  <PlayerSearchInput
                    players={players}
                    position={position}
                    selectedPlayer={null}
                    onPlayerSelect={addPlayer}
                    onPlayerRemove={() => {}}
                    placeholder={`Search ${position}...`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Football Pitch */}
        <div className="lg:col-span-2">
          <FootballPitch
            starting11={starting11}
            bench={bench}
            formation={selectedFormation}
            onPlayerClick={(player) => {
              const isInStarting = starting11.some(p => p.id === player.id);
              movePlayer(player, isInStarting);
            }}
          />
        </div>
      </div>

      {/* AI Configuration Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
            {aiAvailable ? (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Available
              </span>
            ) : (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Setup Required
              </span>
            )}
          </div>
          <button
            onClick={() => setShowAIConfig(!showAIConfig)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {showAIConfig ? 'Hide' : 'Configure'} AI
          </button>
        </div>

        {showAIConfig && (
          <AIConfig onApiKeySet={() => setAiAvailable(true)} />
        )}

        {!aiAvailable && !showAIConfig && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Enhanced AI Analysis Available</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Get intelligent analysis with real-time player data, fixture analysis, and personalized recommendations.
                </p>
                <button
                  onClick={() => setShowAIConfig(true)}
                  className="mt-2 text-sm text-yellow-800 hover:text-yellow-900 underline"
                >
                  Set up AI analysis →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!teamName || starting11.length !== 11}
        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
      >
        {aiAvailable ? '🤖 Analyze My Team with AI' : '📊 Analyze My Team'} ({starting11.length}/11 players)
      </button>

      {showExportHelper && (
        <FPLExportHelper onClose={() => setShowExportHelper(false)} />
      )}
    </div>
  );
};

export default TeamBuilder;