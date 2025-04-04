
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import LandingPage from "./components/LandingPage";
import WaitingRoom from "./components/WaitingRoom";
import GameRoom from "./components/GameRoom";
import Scoreboard from "./components/Scoreboard";
import NotFound from "./pages/NotFound";
import BubbleBackground from "./components/BubbleBackground";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <BubbleBackground />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/waiting-room" element={<WaitingRoom />} />
            <Route path="/game" element={<GameRoom />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
