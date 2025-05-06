
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MemoryCard {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

const MemoryGame = () => {
  const { toast } = useToast();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const symbols = ["🌸", "🌺", "🌼", "🌻", "🌷", "🍀", "🌹", "🌈"];
  
  const initializeGame = () => {
    // Create pairs of cards with symbols
    const cardValues = [...symbols, ...symbols];
    // Shuffle the cards
    const shuffledCards = cardValues
      .map((value, index) => ({ id: index, value, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
      
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStarted(true);
    
    toast({
      title: "Memory Game Started",
      description: "Find matching pairs of symbols. Good luck!",
      duration: 3000,
    });
  };

  const handleCardClick = (id: number) => {
    // Don't allow more than 2 cards flipped at once or clicking on already matched/flipped cards
    if (flippedCards.length >= 2 || cards[id].flipped || cards[id].matched) {
      return;
    }
    
    // Flip the card
    const newCards = cards.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    
    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    // Check for matches if we have 2 cards flipped
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      if (cards[firstCardId].value === cards[secondCardId].value) {
        // It's a match!
        setTimeout(() => {
          const matchedCards = cards.map(card => 
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, matched: true }
              : card
          );
          setCards(matchedCards);
          setFlippedCards([]);
          setMatchedPairs(matchedPairs + 1);
          
          // Check if game is complete
          if (matchedPairs + 1 === symbols.length) {
            toast({
              title: "Congratulations!",
              description: `You completed the game in ${moves + 1} moves!`,
              duration: 5000,
            });
          }
        }, 500);
      } else {
        // Not a match, flip the cards back
        setTimeout(() => {
          const resetCards = cards.map(card => 
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, flipped: false }
              : card
          );
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    // Clean up timeouts when component unmounts
    return () => {
      // Nothing to clean up in this version
    };
  }, []);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
          <Brain className="h-6 w-6" /> Memory Game
        </CardTitle>
        <CardDescription className="text-center">
          Flip cards to find matching pairs. Exercise your memory!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!gameStarted ? (
          <div className="text-center p-6">
            <p className="mb-4 text-muted-foreground">
              This simple memory game helps stimulate brain activity and improve short-term memory.
            </p>
            <Button onClick={initializeGame}>Start Game</Button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {cards.map((card) => (
                <Button
                  key={card.id}
                  variant={card.flipped || card.matched ? "default" : "outline"}
                  className={`h-16 text-2xl transition-all ${card.matched ? "bg-primary/30" : ""}`}
                  onClick={() => handleCardClick(card.id)}
                >
                  {(card.flipped || card.matched) ? card.value : ""}
                </Button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Moves: {moves}</span>
              <span>Pairs found: {matchedPairs} / {symbols.length}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {gameStarted && (
          <Button variant="outline" onClick={initializeGame}>Restart Game</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MemoryGame;
