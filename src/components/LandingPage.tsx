
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fish, Users } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [joinMode, setJoinMode] = useState(false);
  const { createRoom, joinRoom, gameState } = useGame();
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      return;
    }
    createRoom();
    // Navigate to the waiting room
    setTimeout(() => {
      joinRoom(gameState.roomId, playerName);
      navigate('/waiting-room');
    }, 100);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomId.trim()) {
      return;
    }
    joinRoom(roomId.trim().toUpperCase(), playerName);
    navigate('/waiting-room');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo />
          <h2 className="mt-6 text-2xl font-bubblegum text-white">The game of deception and wit!</h2>
        </div>

        <Card className="backdrop-blur-md bg-white/80 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-blueFish">
              {joinMode ? 'Join a Playroom' : 'Create a Playroom'}
            </CardTitle>
            <CardDescription className="text-center">
              {joinMode ? 'Enter a room code to join an existing game' : 'Start a new game with friends'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="playerName">Your Nickname</label>
              <Input
                id="playerName"
                placeholder="Enter your nickname"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="border-2 border-blue-200"
              />
            </div>
            
            {joinMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="roomCode">Room Code</label>
                <Input
                  id="roomCode"
                  placeholder="Enter room code"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  className="border-2 border-blue-200 uppercase"
                  maxLength={6}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {joinMode ? (
              <>
                <Button 
                  onClick={handleJoinRoom} 
                  className="w-full bg-blueFish hover:bg-blue-700 text-lg"
                  disabled={!playerName.trim() || !roomId.trim()}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Join Game
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setJoinMode(false)}
                  className="w-full text-blueFish"
                >
                  Create New Room Instead
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={handleCreateRoom} 
                  className="w-full bg-gradient-to-r from-blueFish to-redFish hover:from-blue-700 hover:to-red-700 text-lg"
                  disabled={!playerName.trim()}
                >
                  <Fish className="mr-2 h-5 w-5" />
                  Create New Game
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setJoinMode(true)}
                  className="w-full text-blueFish"
                >
                  Join Existing Room Instead
                </Button>
              </>
            )}
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-white/80 mt-8">
          <p>Gather 3-8 players and try to find the Red Herring!</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
