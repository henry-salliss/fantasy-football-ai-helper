import React from 'react';
import type { Player } from '../types/fantasy';

interface FootballPitchProps {
  starting11: Player[];
  bench: Player[];
  formation: string;
  onPlayerClick?: (player: Player, position: string) => void;
}

const FootballPitch: React.FC<FootballPitchProps> = ({
  starting11,
  bench,
  formation,
  onPlayerClick
}) => {
  // Parse formation to get position counts
  const getFormationPositions = (formation: string) => {
    const parts = formation.split('-');
    return {
      defenders: parseInt(parts[0]) || 4,
      midfielders: parseInt(parts[1]) || 3,
      forwards: parseInt(parts[2]) || 3
    };
  };

  const positions = getFormationPositions(formation);
  
  // Group players by position
  const playersByPosition = {
    GK: starting11.filter(p => p.position === 'GK'),
    DEF: starting11.filter(p => p.position === 'DEF'),
    MID: starting11.filter(p => p.position === 'MID'),
    FWD: starting11.filter(p => p.position === 'FWD')
  };

  const PlayerShirt: React.FC<{ player: Player; onClick?: () => void }> = ({ player, onClick }) => (
    <div 
      className="bg-blue-600 text-white rounded-lg p-4 cursor-pointer hover:bg-blue-700 hover:scale-105 transition-all duration-200 min-w-[120px] text-center shadow-lg border-2 border-blue-500"
      onClick={onClick}
      title="Click to move between starting 11 and bench"
    >
      <div className="text-sm font-bold mb-2 bg-blue-800 rounded px-2 py-1">{player.position}</div>
      <div className="text-sm font-semibold mb-1 truncate">{player.name}</div>
      <div className="text-xs opacity-90 mb-2">{player.team}</div>
      <div className="text-xs opacity-80">
        £{player.price}m • {player.totalPoints}pts
      </div>
    </div>
  );

  const BenchPlayer: React.FC<{ player: Player; onClick?: () => void }> = ({ player, onClick }) => {
    console.log('Rendering bench player:', player);
    return (
      <div 
        style={{
          backgroundColor: '#374151',
          color: '#ffffff',
          borderRadius: '8px',
          padding: '12px',
          cursor: 'pointer',
          minWidth: '100px',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '2px solid #4B5563',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#4B5563';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#374151';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onClick={onClick}
        title="Click to move to starting 11"
      >
        <div style={{
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '4px',
          backgroundColor: '#111827',
          color: '#ffffff',
          borderRadius: '4px',
          padding: '4px 8px'
        }}>{player.position}</div>
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#ffffff',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>{player.name}</div>
        <div style={{
          fontSize: '12px',
          color: '#E5E7EB'
        }}>{player.team}</div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-green-200 to-green-300 border-4 border-green-800 rounded-xl p-6 relative overflow-hidden shadow-xl">
      {/* Pitch Background Pattern */}
      <div className="absolute inset-0 bg-green-100 opacity-20"></div>
      
      {/* Goal Areas */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-20 border-2 border-green-800 border-b-0 rounded-t-full"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-20 border-2 border-green-800 border-t-0 rounded-b-full"></div>
      
      {/* Center Circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-green-800 rounded-full"></div>
      
      {/* Center Line */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-green-800"></div>
      
      {/* Penalty Areas */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-12 border-2 border-green-800 border-b-0"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-12 border-2 border-green-800 border-t-0"></div>

      <div className="relative z-10">
        {/* Formation Display */}
        <div className="text-center mb-6">
          <span className="bg-white px-4 py-2 rounded-lg text-sm font-bold text-green-800 shadow-md border-2 border-green-600">
            {formation} Formation
          </span>
          <p className="text-xs text-gray-600 mt-2">Click players to move between starting 11 and bench</p>
        </div>

        {/* Forwards (Top) */}
        <div className="flex justify-center gap-3 mb-6">
          {playersByPosition.FWD.slice(0, positions.forwards).map((player) => (
            <PlayerShirt 
              key={player.id} 
              player={player}
              onClick={() => onPlayerClick?.(player, 'FWD')}
            />
          ))}
          {/* Show empty slots for missing forwards */}
          {Array.from({ length: Math.max(0, positions.forwards - playersByPosition.FWD.length) }).map((_, index) => (
            <div key={`empty-fwd-${index}`} className="bg-red-200 border-2 border-dashed border-gray-400 rounded-lg p-4 min-w-[120px] text-center flex items-center justify-center">
              <span className="text-gray-500 text-sm">Add FWD</span>
            </div>
          ))}
        </div>

        {/* Midfielders */}
        <div className="flex justify-center gap-3 mb-6">
          {playersByPosition.MID.slice(0, positions.midfielders).map((player) => (
            <PlayerShirt 
              key={player.id} 
              player={player}
              onClick={() => onPlayerClick?.(player, 'MID')}
            />
          ))}
          {/* Show empty slots for missing midfielders */}
          {Array.from({ length: Math.max(0, positions.midfielders - playersByPosition.MID.length) }).map((_, index) => (
            <div key={`empty-mid-${index}`} className="bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg p-4 min-w-[120px] text-center flex items-center justify-center">
              <span className="text-gray-500 text-sm">Add MID</span>
            </div>
          ))}
        </div>

        {/* Defenders */}
        <div className="flex justify-center gap-3 mb-6">
          {playersByPosition.DEF.slice(0, positions.defenders).map((player) => (
            <PlayerShirt 
              key={player.id} 
              player={player}
              onClick={() => onPlayerClick?.(player, 'DEF')}
            />
          ))}
          {/* Show empty slots for missing defenders */}
          {Array.from({ length: Math.max(0, positions.defenders - playersByPosition.DEF.length) }).map((_, index) => (
            <div key={`empty-def-${index}`} className="bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg p-4 min-w-[120px] text-center flex items-center justify-center">
              <span className="text-gray-500 text-sm">Add DEF</span>
            </div>
          ))}
        </div>

        {/* Goalkeeper (Bottom) */}
        <div className="flex justify-center">
          {playersByPosition.GK.map((player) => (
            <PlayerShirt 
              key={player.id} 
              player={player}
              onClick={() => onPlayerClick?.(player, 'GK')}
            />
          ))}
          {/* Show empty slot for missing goalkeeper */}
          {playersByPosition.GK.length === 0 && (
            <div className="bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg p-4 min-w-[120px] text-center flex items-center justify-center">
              <span className="text-gray-500 text-sm">Add GK</span>
            </div>
          )}
        </div>

        {/* Bench */}
        {bench.length > 0 && (
          <div className="mt-8 pt-6 border-t-2 border-green-600">
            <div className="text-center mb-4">
              <span style={{
                backgroundColor: '#4B5563',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                BENCH ({bench.length}/4)
              </span>
              <p style={{
                fontSize: '12px',
                color: '#4B5563',
                marginTop: '4px'
              }}>Click players to move to starting 11</p>
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              {bench.map((player, index) => {
                console.log('Bench player in map:', player, 'index:', index);
                return (
                  <BenchPlayer 
                    key={player.id || `bench-${index}`} 
                    player={player}
                    onClick={() => onPlayerClick?.(player, 'BENCH')}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FootballPitch;
