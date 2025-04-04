
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Fish } from 'lucide-react';

const PlayerList: React.FC = () => {
  const { gameState, playerInfo } = useGame();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-2">
      {gameState.players.map((player) => (
        <div 
          key={player.id} 
          className={`flex items-center p-2 rounded-md ${
            player.isStoryteller 
              ? 'bg-yellow-100 border-2 border-yellow-300' 
              : player.hasSubmitted 
                ? 'bg-green-50 border-2 border-green-200' 
                : 'bg-blue-50 border-2 border-blue-200'
          }`}
        >
          <Avatar className="mr-2 h-8 w-8 border">
            <AvatarFallback className={
              player.isStoryteller 
                ? 'bg-gradient-to-br from-yellow-500 to-yellow-300 text-white' 
                : 'bg-gradient-to-br from-blueFish to-lightBlue text-white'
            }>
              {getInitials(player.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate flex items-center">
              {player.name}
              {player.isStoryteller && (
                <Fish className="ml-1 h-4 w-4 text-yellow-500" />
              )}
              {player.id === playerInfo?.id && <span className="ml-1 text-xs">(You)</span>}
            </p>
            <p className="text-xs">
              {player.isStoryteller 
                ? 'Storyteller'
                : player.hasSubmitted
                  ? 'Answer submitted'
                  : 'Thinking...'}
            </p>
          </div>
          <div className="text-sm font-medium">
            {player.score} pts
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
