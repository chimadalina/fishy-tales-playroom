
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fish } from 'lucide-react';

const PlayerView: React.FC = () => {
  const { gameState, playerInfo, submitAnswer } = useGame();
  const [answer, setAnswer] = useState('');
  
  if (!playerInfo) return null;
  
  const currentRound = gameState.rounds[gameState.currentRound];
  const hasSubmitted = playerInfo.hasSubmitted;
  const hasRedFish = playerInfo.hasRedFish;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      submitAnswer(answer.trim());
    }
  };

  return (
    <Card className={`h-full ${hasRedFish ? 'red-fish-pattern' : 'blue-fish-pattern'}`}>
      <CardHeader className="bg-white/60 backdrop-blur-sm rounded-t-lg">
        <div className="flex items-center justify-center mb-2">
          <Fish className={`h-10 w-10 ${hasRedFish ? 'text-redFish' : 'text-blueFish'}`} />
        </div>
        <CardTitle className={`text-center text-xl ${hasRedFish ? 'text-redFish' : 'text-blueFish'}`}>
          You have a {hasRedFish ? 'RED' : 'BLUE'} fish!
        </CardTitle>
        <CardDescription className="text-center font-medium">
          {hasRedFish 
            ? "Try to blend in with a believable false answer!" 
            : "Submit the correct answer to the question!"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="bg-white/90 p-4 rounded-lg shadow-inner">
          <h3 className="font-semibold mb-2">Question:</h3>
          <p className="text-lg">{currentRound.question}</p>
        </div>

        {hasRedFish ? (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
            <p className="text-sm font-medium text-red-800">
              As the player with the Red Fish, your goal is to trick the Storyteller! 
              Come up with a plausible-sounding false answer.
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
            <h3 className="font-semibold mb-1">The correct answer is:</h3>
            <p className="text-lg font-bold">{currentRound.correctAnswer}</p>
            <p className="text-sm mt-2">
              Submit this answer, but try to make it look like you might be the one with the Red Fish!
            </p>
          </div>
        )}

        {hasSubmitted ? (
          <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Your answer has been submitted!</h3>
            <p className="mt-2">
              Waiting for other players to submit their answers...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Answer:</label>
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={hasRedFish ? "Enter your deceptive answer..." : "Enter the correct answer..."}
                className="w-full border-2"
              />
            </div>
            <Button 
              type="submit" 
              className={`w-full ${hasRedFish ? 'bg-redFish hover:bg-red-700' : 'bg-blueFish hover:bg-blue-700'}`}
              disabled={!answer.trim()}
            >
              Submit Answer
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerView;
