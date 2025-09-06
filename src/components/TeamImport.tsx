import React, { useState } from 'react';
import { Upload, Users, Plus, Trash2, HelpCircle, AlertCircle, Download } from 'lucide-react';
import type { FantasyTeam, Player } from '../types/fantasy';
import FPLExportHelper from './FPLExportHelper';
import { FPLCSVParser } from '../utils/csvParser';

interface TeamImportProps {
  onTeamSubmit: (team: FantasyTeam) => void;
}

const TeamImport: React.FC<TeamImportProps> = ({ onTeamSubmit }) => {
  const [teamName, setTeamName] = useState('');
  const [leagueName, setLeagueName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: '',
    position: 'GK',
    team: '',
    projectedPoints: 0
  });
  const [showExportHelper, setShowExportHelper] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const positions: Player['position'][] = ['GK', 'DEF', 'MID', 'FWD'];

  const addPlayer = () => {
    if (newPlayer.name && newPlayer.position && newPlayer.team) {
      const player: Player = {
        id: Date.now().toString(),
        name: newPlayer.name,
        position: newPlayer.position,
        team: newPlayer.team,
        projectedPoints: newPlayer.projectedPoints || 0
      };
      setPlayers([...players, player]);
      setNewPlayer({ name: '', position: 'GK', team: '', projectedPoints: 0 });
    }
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const handleSubmit = () => {
    if (teamName && leagueName && players.length > 0) {
      const team: FantasyTeam = {
        id: Date.now().toString(),
        name: teamName,
        league: leagueName,
        players: players,
        bench: [],
        totalProjectedPoints: players.reduce((sum, p) => sum + (p.projectedPoints || 0), 0)
      };
      onTeamSubmit(team);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const { players: importedPlayers, errors } = FPLCSVParser.parseCSV(content);
          
          if (errors.length > 0) {
            setImportErrors(errors);
            // Still import players even if there are errors, but show warnings
            if (importedPlayers.length > 0) {
              setPlayers(importedPlayers);
            }
          } else {
            setImportErrors([]);
            setPlayers(importedPlayers);
          }
        } catch (error) {
          setImportErrors([`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`]);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fantasy Premier League AI Helper</h1>
        <p className="text-gray-600">Import your FPL team to get AI-powered suggestions and analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Name
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your team name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            League Name
          </label>
          <input
            type="text"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your league name"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Users className="mr-2" />
            Players ({players.length})
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowExportHelper(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <HelpCircle className="mr-2" size={16} />
              Export from FPL
            </button>
            <button
              onClick={() => {
                const sampleCSV = FPLCSVParser.generateSampleCSV();
                const blob = new Blob([sampleCSV], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'sample-fpl-team.csv';
                a.click();
                window.URL.revokeObjectURL(url);
              }}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <Download className="mr-2" size={16} />
              Sample CSV
            </button>
            <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
              <Upload className="mr-2" size={16} />
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {importErrors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle size={20} className="text-red-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Import Issues:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {importErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            value={newPlayer.name || ''}
            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Player Name"
          />
          <select
            value={newPlayer.position || 'QB'}
            onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value as Player['position'] })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {positions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
          <input
            type="text"
            value={newPlayer.team || ''}
            onChange={(e) => setNewPlayer({ ...newPlayer, team: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Team"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={newPlayer.projectedPoints || ''}
              onChange={(e) => setNewPlayer({ ...newPlayer, projectedPoints: parseFloat(e.target.value) || 0 })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Proj. Pts"
              step="0.1"
            />
            <button
              onClick={addPlayer}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {players.length > 0 && (
          <div className="space-y-2">
            {players.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{player.name}</span>
                  <span className="text-sm text-gray-600">{player.position}</span>
                  <span className="text-sm text-gray-600">{player.team}</span>
                  <span className="text-sm font-medium text-blue-600">{player.projectedPoints} pts</span>
                </div>
                <button
                  onClick={() => removePlayer(player.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!teamName || !leagueName || players.length === 0}
        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Analyze My Team
      </button>

      {showExportHelper && (
        <FPLExportHelper onClose={() => setShowExportHelper(false)} />
      )}
    </div>
  );
};

export default TeamImport;
