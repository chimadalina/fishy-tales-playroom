
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Fish, Trophy, Home } from 'lucide-react';
import Logo from './Logo';

const Scoreboard: React.FC = () => {
  const { gameState } = useGame();
  const navigate = useNavigate();

  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const winners = sortedPlayers.filter(player => player.score === sortedPlayers[0].score);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <Logo />
          <h2 className="mt-2 text-3xl font-bubblegum text-white">Game Over!</h2>
        </div>

        <Card className="backdrop-blur-md bg-white/80 border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="h-10 w-10 text-yellow-300" />
            </div>
            <CardTitle className="text-center text-2xl">
              Final Scores
            </CardTitle>
            <CardDescription className="text-center text-white/90">
              {winners.length === 1 
                ? `${winners[0].name} is the winner with ${winners[0].score} points!` 
                : `${winners.map(w => w.name).join(' & ')} tie for the win with ${winners[0].score} points!`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-3">
              {sortedPlayers.map((player, index) => (
                <div 
                  key={player.id}
                  className={`flex items-center p-3 rounded-lg ${
                    index === 0 
                      ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300' 
                      : index === 1 
                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300'
                        : index === 2 
                          ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200'
                          : 'bg-white border-2 border-gray-200'
                  }`}
                >
                  <div className="w-8 text-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 ml-3">
                    <p className="font-medium">{player.name}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl font-bold mr-1">{player.score}</span>
                    <span className="text-sm">points</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-4">
            <Button
              onClick={() => navigate('/')} 
              className="bg-gradient-to-r from-blueFish to-redFish hover:from-blue-700 hover:to-red-700"
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Scoreboard;
