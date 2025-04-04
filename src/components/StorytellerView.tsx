
import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, HelpCircle, Fish, Trophy } from 'lucide-react';

const StorytellerView: React.FC = () => {
  const { gameState, playerInfo, guessAnswer, endGuessing } = useGame();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [guessedPlayers, setGuessedPlayers] = useState<string[]>([]);
  const [canContinue, setCanContinue] = useState(false);
  
  const currentRound = gameState.rounds[gameState.currentRound];
  const nonStorytellerPlayers = gameState.players.filter(p => !p.isStoryteller);
  
  // Check if all players (except storyteller) have submitted answers
  const allSubmitted = nonStorytellerPlayers.every(player => {
    return currentRound.submissions.some(sub => sub.playerId === player.id);
  });

  // Get submissions with player info
  const submissionsWithInfo = currentRound.submissions.map(sub => {
    const player = gameState.players.find(p => p.id === sub.playerId);
    return {
      ...sub,
      playerName: player?.name || 'Unknown',
      hasRedFish: player?.hasRedFish || false,
      isGuessed: guessedPlayers.includes(sub.playerId)
    };
  });

  // Determine if we can continue to next round
  useEffect(() => {
    // Can continue if either:
    // 1. All players have been guessed
    // 2. At least one player has been guessed, and there was a wrong guess
    const wrongGuessExists = currentRound.submissions.some(sub => 
      sub.isGuessedCorrectly === false
    );
    
    const allGuessed = nonStorytellerPlayers.length === guessedPlayers.length;
    
    setCanContinue(allGuessed || (guessedPlayers.length > 0 && wrongGuessExists));
  }, [currentRound.submissions, guessedPlayers.length, nonStorytellerPlayers.length]);

  const handleGuess = (playerId: string, isRedFish: boolean) => {
    guessAnswer(playerId, isRedFish);
    setGuessedPlayers(prev => [...prev, playerId]);
    setSelectedPlayerId(null);
  };

  const handleEndRound = () => {
    endGuessing();
  };

  if (!playerInfo?.isStoryteller) return null;

  return (
    <Card className="h-full backdrop-blur-md bg-white/80 border-2 border-yellow-300">
      <CardHeader className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-t-lg">
        <div className="flex items-center justify-center mb-2">
          <Fish className="h-10 w-10" />
        </div>
        <CardTitle className="text-center text-xl">
          You are the Storyteller!
        </CardTitle>
        <CardDescription className="text-center text-white/90">
          Find the player with the Red Fish to earn points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="bg-white p-4 rounded-lg shadow-inner">
          <h3 className="font-semibold mb-2">Question:</h3>
          <p className="text-lg">{currentRound.question}</p>
          <div className="mt-2">
            <h3 className="font-semibold mb-1">Correct Answer:</h3>
            <p className="text-lg font-bold">{currentRound.correctAnswer}</p>
          </div>
        </div>

        {!allSubmitted ? (
          <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-center">
            <p className="text-center">
              Waiting for all players to submit their answers...
              <br />
              <span className="text-sm">
                {currentRound.submissions.length} of {nonStorytellerPlayers.length} answers submitted
              </span>
            </p>
          </div>
        ) : (
          <>
            <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Player Answers:</h3>
              <p className="text-sm mb-3">
                Review each answer and decide which player has the Red Fish (who gave a false answer).
                Each correct guess earns you 1 point, but if you make a wrong guess, you lose all points for this round!
              </p>
              
              <div className="space-y-2 mt-4">
                {submissionsWithInfo.map((submission) => (
                  <div 
                    key={submission.playerId}
                    className={`p-3 rounded-lg border-2 ${
                      submission.isGuessed 
                        ? submission.isGuessedCorrectly 
                          ? 'bg-green-50 border-green-300'
                          : 'bg-red-50 border-red-300'
                        : selectedPlayerId === submission.playerId
                          ? 'bg-blue-100 border-blue-300'
                          : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{submission.playerName}</h4>
                      
                      {submission.isGuessed ? (
                        <div className="flex items-center">
                          {submission.isGuessedCorrectly ? (
                            <span className="text-green-600 flex items-center">
                              <CheckCircle className="h-5 w-5 mr-1" />
                              Correct!
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center">
                              <XCircle className="h-5 w-5 mr-1" />
                              Wrong!
                            </span>
                          )}
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedPlayerId(
                            selectedPlayerId === submission.playerId ? null : submission.playerId
                          )}
                          className="text-blue-600"
                        >
                          <HelpCircle className="h-4 w-4 mr-1" />
                          Evaluate
                        </Button>
                      )}
                    </div>
                    
                    <p className="mt-1">{submission.answer}</p>
                    
                    {selectedPlayerId === submission.playerId && (
                      <div className="mt-3 flex space-x-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 border-2 border-blue-300"
                          onClick={() => handleGuess(submission.playerId, false)}
                        >
                          <Fish className="h-4 w-4 mr-1 text-blueFish" />
                          Blue Fish
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-2 border-red-300"
                          onClick={() => handleGuess(submission.playerId, true)}
                        >
                          <Fish className="h-4 w-4 mr-1 text-redFish" />
                          Red Fish
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-yellow-100 border-2 border-yellow-300 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Current Round Points:</h3>
                <p className="text-2xl font-bold">{currentRound.points}</p>
              </div>
              
              <Button 
                onClick={handleEndRound}
                disabled={!canContinue}
                className="bg-amber-500 hover:bg-amber-600"
              >
                <Trophy className="h-5 w-5 mr-1" />
                {currentRound.points > 0 ? 'Collect Points & Continue' : 'Next Round'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StorytellerView;
