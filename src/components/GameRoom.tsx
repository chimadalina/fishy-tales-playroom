
import React, { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fish } from 'lucide-react';
import PlayerList from './PlayerList';
import StorytellerView from './StorytellerView';
import PlayerView from './PlayerView';

const GameRoom: React.FC = () => {
  const { gameState, playerInfo, endGame } = useGame();
  const navigate = useNavigate();

  // Redirect if not in a game or game is over
  useEffect(() => {
    if (!gameState.roomId) {
      navigate('/');
    } else if (gameState.status === 'ended') {
      navigate('/scoreboard');
    } else if (gameState.status === 'waiting') {
      navigate('/waiting-room');
    }
  }, [gameState.status, gameState.roomId, navigate]);

  if (!playerInfo) {
    return <div>Loading...</div>;
  }

  const currentRound = gameState.rounds[gameState.currentRound];

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Fish className={`w-6 h-6 ${playerInfo.isStoryteller ? 'text-yellow-400' : playerInfo.hasRedFish ? 'text-redFish' : 'text-blueFish'}`} />
          <div className="ml-2">
            <h2 className="text-xl font-bubblegum text-white">Round {currentRound.number}</h2>
            <p className="text-white/80 text-sm">
              {playerInfo.isStoryteller ? 'You are the Storyteller!' : 'You have a ' + (playerInfo.hasRedFish ? 'RED' : 'BLUE') + ' fish'}
            </p>
          </div>
        </div>
        
        {playerInfo.isAdmin && (
          <Button variant="destructive" onClick={endGame}>
            End Game
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          {playerInfo.isStoryteller ? (
            <StorytellerView />
          ) : (
            <PlayerView />
          )}
        </div>

        <div>
          <Card className="backdrop-blur-md bg-white/80 h-full">
            <CardHeader>
              <CardTitle className="text-blueFish">Players</CardTitle>
            </CardHeader>
            <CardContent>
              <PlayerList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
