
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from '@/context/GameContext';
import { useNavigate } from 'react-router-dom';
import { Copy, PlayCircle, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Logo from './Logo';

const WaitingRoom: React.FC = () => {
  const { gameState, playerInfo, startGame } = useGame();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // If game starts, redirect to game
  useEffect(() => {
    if (gameState.status === 'playing') {
      navigate('/game');
    }
  }, [gameState.status, navigate]);

  // If no room exists, redirect to landing
  useEffect(() => {
    if (!gameState.roomId) {
      navigate('/');
    }
  }, [gameState.roomId, navigate]);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(gameState.roomId);
    setCopied(true);
    toast.success('Room code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    startGame();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <Logo />
          <h2 className="mt-2 text-2xl font-bubblegum text-white">Waiting Room</h2>
        </div>

        <Card className="backdrop-blur-md bg-white/80 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-xl text-blueFish">
              Room Code: <span className="text-redFish">{gameState.roomId}</span>
            </CardTitle>
            <CardDescription className="text-center">
              Share this code with your friends to join the game
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              onClick={copyRoomCode} 
              className="w-full border-2 border-blue-200"
            >
              <Copy className="mr-2 h-4 w-4" />
              {copied ? 'Copied!' : 'Copy Room Code'}
            </Button>

            <div className="mt-6">
              <h3 className="text-md font-medium mb-2 flex items-center">
                <Users className="mr-2 h-5 w-5 text-blueFish" />
                Players ({gameState.players.length}/8)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {gameState.players.map((player) => (
                  <div 
                    key={player.id} 
                    className="flex items-center p-2 bg-blue-50 rounded-md"
                  >
                    <Avatar className="mr-2 h-8 w-8 border-2 border-blue-200">
                      <AvatarFallback className="bg-gradient-to-br from-blueFish to-lightBlue text-white">
                        {getInitials(player.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">{player.name}</p>
                      {player.isAdmin && (
                        <p className="text-xs text-blue-600">Game Admin</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            {playerInfo?.isAdmin ? (
              <Button 
                onClick={handleStartGame} 
                className="bg-gradient-to-r from-blueFish to-redFish hover:from-blue-700 hover:to-red-700 text-lg"
                disabled={gameState.players.length < 3}
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Start Game
              </Button>
            ) : (
              <p className="text-blueFish text-center">
                Waiting for the game admin to start the game...
              </p>
            )}
          </CardFooter>
        </Card>

        {gameState.players.length < 3 && playerInfo?.isAdmin && (
          <div className="text-center text-white bg-blue-600/70 p-3 rounded-lg">
            You need at least 3 players to start the game. Currently: {gameState.players.length}/3
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;
