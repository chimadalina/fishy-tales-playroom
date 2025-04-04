
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Types for our game state
type PlayerType = {
  id: string;
  name: string;
  score: number;
  isAdmin: boolean;
  isStoryteller: boolean;
  hasRedFish: boolean;
  answer: string;
  hasSubmitted: boolean;
};

type RoundType = {
  number: number;
  question: string;
  correctAnswer: string;
  storytellerId: string;
  submissions: {
    playerId: string;
    answer: string;
    isGuessedCorrectly?: boolean;
  }[];
  points: number;
};

type GameStateType = {
  roomId: string;
  players: PlayerType[];
  status: 'waiting' | 'playing' | 'ended';
  rounds: RoundType[];
  currentRound: number;
  questions: { question: string; answer: string }[];
};

type GameContextType = {
  gameState: GameStateType;
  playerInfo: PlayerType | null;
  createRoom: () => void;
  joinRoom: (roomId: string, playerName: string) => void;
  startGame: () => void;
  submitAnswer: (answer: string) => void;
  guessAnswer: (playerId: string, isCorrect: boolean) => void;
  endGuessing: () => void;
  endGame: () => void;
};

const initialGameState: GameStateType = {
  roomId: '',
  players: [],
  status: 'waiting',
  rounds: [],
  currentRound: 0,
  questions: [
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "In what year did the Titanic sink?", answer: "1912" },
    { question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" },
    { question: "What is the largest planet in our solar system?", answer: "Jupiter" },
    { question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare" },
    { question: "What is the chemical symbol for gold?", answer: "Au" },
    { question: "How many continents are there on Earth?", answer: "7" },
    { question: "What is the tallest mountain in the world?", answer: "Mount Everest" },
    { question: "Who was the first person to step on the moon?", answer: "Neil Armstrong" },
    { question: "What is the largest ocean on Earth?", answer: "Pacific Ocean" },
    { question: "What is the capital of Japan?", answer: "Tokyo" },
    { question: "Who discovered penicillin?", answer: "Alexander Fleming" },
    { question: "What is the hardest natural substance on Earth?", answer: "Diamond" },
    { question: "What is the main language spoken in Brazil?", answer: "Portuguese" },
    { question: "Who is known as the father of modern physics?", answer: "Albert Einstein" }
  ]
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameStateType>(initialGameState);
  const [playerInfo, setPlayerInfo] = useState<PlayerType | null>(null);

  // Generate a random room ID
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Create a new game room
  // const createRoom = () => {
  //   const roomId = "123"
  //   //const roomId = generateRoomId();
  //   setGameState({
  //     ...initialGameState,
  //     roomId
  //   });
    
   
  // };

  const createRoom = async (): Promise<string> => {
    const roomId = generateRoomId();
    // create the room in DB or server
    toast.success("Room created! Share the room code with your friends");
    setGameState((prev) => ({ ...prev, roomId }));
    return roomId;
  };

  // Join an existing room
  const joinRoom = (roomId: string, playerName: string) => {
    // if (roomId !== gameState.roomId) {
    //   toast.error("Invalid room code");
    //   return;
    // }

    if (gameState.players.length >= 8) {
      toast.error("Room is full");
      return;
    }

    if (gameState.status !== 'waiting') {
      toast.error("Game already started");
      return;
    }

    const isFirstPlayer = gameState.players.length === 0;
    const playerId = Math.random().toString(36).substr(2, 9);
    toast.success(`about to set the player`);
    const newPlayer: PlayerType = {
      id: playerId,
      name: playerName,
      score: 0,
      isAdmin: isFirstPlayer,
      isStoryteller: false,
      hasRedFish: false,
      answer: '',
      hasSubmitted: false
    };

    setPlayerInfo(newPlayer);
    toast.success(`about to set the game`);
    setGameState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));

    toast.success(`Joined room as ${playerName}`);
  };

  // Start the game
  const startGame = () => {
    if (!playerInfo?.isAdmin) {
      toast.error("Only the admin can start the game");
      return;
    }

    if (gameState.players.length < 3) {
      toast.error("Need at least 3 players to start");
      return;
    }

    // Select a random storyteller for the first round
    const firstStorytellerIndex = Math.floor(Math.random() * gameState.players.length);
    const updatedPlayers = gameState.players.map((player, index) => ({
      ...player,
      isStoryteller: index === firstStorytellerIndex,
      hasRedFish: false,
      answer: '',
      hasSubmitted: false
    }));

    // Randomly select one non-storyteller to have the red fish
    let redFishIndex;
    do {
      redFishIndex = Math.floor(Math.random() * gameState.players.length);
    } while (redFishIndex === firstStorytellerIndex);

    updatedPlayers[redFishIndex].hasRedFish = true;

    // Select a random question
    const randomQuestionIndex = Math.floor(Math.random() * gameState.questions.length);
    const selectedQuestion = gameState.questions[randomQuestionIndex];

    // Create the first round
    const firstRound: RoundType = {
      number: 1,
      question: selectedQuestion.question,
      correctAnswer: selectedQuestion.answer,
      storytellerId: updatedPlayers[firstStorytellerIndex].id,
      submissions: [],
      points: 0
    };

    setGameState(prev => ({
      ...prev,
      status: 'playing',
      players: updatedPlayers,
      rounds: [firstRound],
      currentRound: 0
    }));

    // Update the current player's info
    if (playerInfo) {
      const updatedPlayerInfo = updatedPlayers.find(p => p.id === playerInfo.id) || null;
      setPlayerInfo(updatedPlayerInfo);
    }

    toast.success("Game started!");
  };

  // Submit an answer for the current round
  const submitAnswer = (answer: string) => {
    if (!playerInfo || playerInfo.isStoryteller || playerInfo.hasSubmitted) {
      return;
    }

    // Update player's answer and submission status
    const updatedPlayers = gameState.players.map(player => {
      if (player.id === playerInfo.id) {
        return { ...player, answer, hasSubmitted: true };
      }
      return player;
    });

    // Add submission to the current round
    const currentRound = gameState.rounds[gameState.currentRound];
    const updatedSubmission = {
      playerId: playerInfo.id,
      answer
    };

    const updatedRounds = [...gameState.rounds];
    updatedRounds[gameState.currentRound] = {
      ...currentRound,
      submissions: [...currentRound.submissions, updatedSubmission]
    };

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      rounds: updatedRounds
    }));

    // Update player info
    setPlayerInfo({
      ...playerInfo,
      answer,
      hasSubmitted: true
    });

    toast.success("Answer submitted!");
  };

  // Storyteller guesses if an answer is correct or not
  const guessAnswer = (playerId: string, isCorrect: boolean) => {
    if (!playerInfo?.isStoryteller) {
      return;
    }

    const targetPlayer = gameState.players.find(p => p.id === playerId);
    if (!targetPlayer) return;

    const isActuallyCorrect = targetPlayer.hasRedFish === !isCorrect;
    
    // Update the submission in the current round
    const currentRound = gameState.rounds[gameState.currentRound];
    const updatedSubmissions = currentRound.submissions.map(sub => {
      if (sub.playerId === playerId) {
        return { ...sub, isGuessedCorrectly: isActuallyCorrect };
      }
      return sub;
    });

    // Update points based on the guess
    let updatedPoints = currentRound.points;
    if (isActuallyCorrect) {
      updatedPoints += 1; // Add a point for correct guess
    } else {
      updatedPoints = 0; // Reset points if guess is wrong
    }

    // Update the round
    const updatedRounds = [...gameState.rounds];
    updatedRounds[gameState.currentRound] = {
      ...currentRound,
      submissions: updatedSubmissions,
      points: updatedPoints
    };

    setGameState(prev => ({
      ...prev,
      rounds: updatedRounds
    }));
  };

  // End the guessing phase and award points to the storyteller
  const endGuessing = () => {
    if (!playerInfo?.isStoryteller) {
      return;
    }

    const currentRound = gameState.rounds[gameState.currentRound];
    
    // Award points to the storyteller
    const updatedPlayers = gameState.players.map(player => {
      if (player.id === playerInfo.id) {
        return { ...player, score: player.score + currentRound.points };
      }
      return player;
    });

    // Prepare for next round - select new storyteller (rotate)
    const currentStorytellerIndex = updatedPlayers.findIndex(p => p.isStoryteller);
    const nextStorytellerIndex = (currentStorytellerIndex + 1) % updatedPlayers.length;
    
    const playersForNextRound = updatedPlayers.map((player, index) => ({
      ...player,
      isStoryteller: index === nextStorytellerIndex,
      hasRedFish: false,
      answer: '',
      hasSubmitted: false
    }));

    // Randomly select one non-storyteller to have the red fish for next round
    let redFishIndex;
    do {
      redFishIndex = Math.floor(Math.random() * playersForNextRound.length);
    } while (redFishIndex === nextStorytellerIndex);

    playersForNextRound[redFishIndex].hasRedFish = true;

    // Select a new question for the next round
    const usedQuestions = gameState.rounds.map(r => r.question);
    const availableQuestions = gameState.questions.filter(q => !usedQuestions.includes(q.question));
    
    // If we've used all questions, reset the pool
    const questionPool = availableQuestions.length > 0 ? availableQuestions : gameState.questions;
    const randomQuestionIndex = Math.floor(Math.random() * questionPool.length);
    const selectedQuestion = questionPool[randomQuestionIndex];

    // Create the next round
    const nextRound: RoundType = {
      number: currentRound.number + 1,
      question: selectedQuestion.question,
      correctAnswer: selectedQuestion.answer,
      storytellerId: playersForNextRound[nextStorytellerIndex].id,
      submissions: [],
      points: 0
    };

    setGameState(prev => ({
      ...prev,
      players: playersForNextRound,
      rounds: [...prev.rounds, nextRound],
      currentRound: prev.currentRound + 1
    }));

    // Update the current player's info
    if (playerInfo) {
      const updatedPlayerInfo = playersForNextRound.find(p => p.id === playerInfo.id) || null;
      setPlayerInfo(updatedPlayerInfo);
    }

    toast.success(`Round ${currentRound.number} completed! Starting round ${currentRound.number + 1}`);
  };

  // End the game and show final scores
  const endGame = () => {
    if (!playerInfo?.isAdmin) {
      toast.error("Only the admin can end the game");
      return;
    }

    setGameState(prev => ({
      ...prev,
      status: 'ended'
    }));

    toast.success("Game ended! Check the final scores");
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        playerInfo,
        createRoom,
        joinRoom,
        startGame,
        submitAnswer,
        guessAnswer,
        endGuessing,
        endGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
