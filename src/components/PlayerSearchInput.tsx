import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import type { Player } from '../types/fantasy';

interface PlayerSearchInputProps {
  players: Player[];
  position: Player['position'];
  selectedPlayer: Player | null;
  onPlayerSelect: (player: Player) => void;
  onPlayerRemove: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const PlayerSearchInput: React.FC<PlayerSearchInputProps> = ({
  players,
  position,
  selectedPlayer,
  onPlayerSelect,
  onPlayerRemove,
  placeholder,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter players by position and search term
  useEffect(() => {
    const filtered = players
      .filter(player => player.position === position)
      .filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.team.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        // Sort by name match first, then by total points
        const aNameMatch = a.name.toLowerCase().startsWith(searchTerm.toLowerCase());
        const bNameMatch = b.name.toLowerCase().startsWith(searchTerm.toLowerCase());
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        
        return (b.totalPoints || 0) - (a.totalPoints || 0);
      })
      .slice(0, 10); // Limit to 10 results

    setFilteredPlayers(filtered);
  }, [players, position, searchTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handlePlayerSelect = (player: Player) => {
    onPlayerSelect(player);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemove = () => {
    onPlayerRemove();
    setSearchTerm('');
  };

  const handleInputFocus = () => {
    if (!selectedPlayer) {
      setIsOpen(true);
    }
  };

  if (selectedPlayer) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {selectedPlayer.position}
              </div>
              <div>
                <p className="font-medium text-blue-900">{selectedPlayer.name}</p>
                <p className="text-sm text-blue-700">{selectedPlayer.team} • £{selectedPlayer.price}m</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
              <span>Points: {selectedPlayer.totalPoints}</span>
              <span>Form: {selectedPlayer.form}</span>
              <span>Proj: {selectedPlayer.projectedPoints}</span>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-red-600 hover:text-red-800 p-1"
            disabled={disabled}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder || `Search ${position}...`}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          disabled={disabled}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      {isOpen && filteredPlayers.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredPlayers.map((player) => (
            <button
              key={player.id}
              onClick={() => handlePlayerSelect(player)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{player.name}</p>
                  <p className="text-sm text-gray-600">{player.team} • £{player.price}m</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{player.totalPoints} pts</p>
                  <p>Form: {player.form}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && filteredPlayers.length === 0 && searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No players found for "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default PlayerSearchInput;
