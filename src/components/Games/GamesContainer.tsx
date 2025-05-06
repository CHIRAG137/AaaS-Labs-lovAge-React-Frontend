
import React, { useState } from 'react';
import MemoryGame from './MemoryGame';
import PuzzleGame from './PuzzleGame';
import { Button } from "@/components/ui/button";
import { Brain, Puzzle } from "lucide-react";

const GamesContainer = () => {
  const [activeGame, setActiveGame] = useState<'memory' | 'puzzle' | null>('memory');

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-display font-semibold text-center mb-6">Mental Stimulation Games</h2>
      <div className="flex justify-center gap-4 mb-6">
        <Button 
          onClick={() => setActiveGame('memory')}
          variant={activeGame === 'memory' ? 'default' : 'outline'}
          className="gap-2"
        >
          <Brain className="h-5 w-5" /> Memory Game
        </Button>
        <Button 
          onClick={() => setActiveGame('puzzle')}
          variant={activeGame === 'puzzle' ? 'default' : 'outline'}
          className="gap-2"
        >
          <Puzzle className="h-5 w-5" /> Brain Teasers
        </Button>
      </div>
      
      <div className="transition-all duration-300 ease-in-out">
        {activeGame === 'memory' && <MemoryGame />}
        {activeGame === 'puzzle' && <PuzzleGame />}
      </div>
      
      <div className="text-center mt-6 text-sm text-muted-foreground">
        <p>Playing games regularly helps keep your mind active and engaged!</p>
      </div>
    </div>
  );
};

export default GamesContainer;
