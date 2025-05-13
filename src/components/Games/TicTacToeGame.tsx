import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PartyPopper, Smile, Trophy } from "lucide-react";

type Player = 'X' | 'O' | null;
type BoardState = (Player)[];

const TicTacToeGame = () => {
  const { toast } = useToast();
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [computerScore, setComputerScore] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [funnyQuips, setFunnyQuips] = useState<string[]>([]);
  
  // Collection of funny computer quips
  const computerWinQuips = [
    "I've been playing this since the 1980s!",
    "This old computer's still got it!",
    "Don't worry, I won't tell your grandkids.",
    "I may be a computer, but I'm young at heart!",
    "That was just luck... maybe.",
  ];
  
  const computerLoseQuips = [
    "Oh dear, I think my circuits are getting rusty!",
    "You're too good! Have you been practicing?",
    "I demand a rematch! My processors were distracted.",
    "You're sharper than my latest software update!",
    "Well played! I need to recalibrate my algorithms.",
  ];
  
  const drawQuips = [
    "A tie! Great minds think alike.",
    "We're evenly matched! Care for another round?",
    "Neither of us wanted to hurt the other's feelings.",
    "That was intense! My circuits are still cooling down.",
    "A diplomatic outcome - very wise of us both!",
  ];
  
  // Emojis for the board instead of X and O
  const playerEmoji = "😊"; // Smile emoji for player
  const computerEmoji = "🤖"; // Robot emoji for computer

  // Check for winner
  const checkWinner = (boardState: BoardState): Player | 'draw' | null => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a];
      }
    }
    
    // Check for draw
    if (!boardState.includes(null)) {
      return 'draw';
    }
    
    return null;
  };

  // Start a new game
  const startGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setGameStarted(true);
    setIsPlayerTurn(true);
    setFunnyQuips([]);
    
    toast({
      title: "New Game Started!",
      description: "You go first. Good luck!",
      duration: 2000,
    });
  };

  // Handle player's move
  const handleCellClick = (index: number) => {
    if (!gameStarted || !isPlayerTurn || board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
    
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      handleGameOver(gameWinner);
    }
  };

  // Computer's turn
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameStarted && !isPlayerTurn && !winner) {
      timer = setTimeout(() => {
        const newBoard = [...board];
        
        // Try to win first
        const winMove = findBestMove(newBoard, 'O');
        if (winMove !== -1) {
          newBoard[winMove] = 'O';
        } 
        // Then try to block player
        else {
          const blockMove = findBestMove(newBoard, 'X');
          if (blockMove !== -1) {
            newBoard[blockMove] = 'O';
          } 
          // Otherwise, make a random move
          else {
            const availableMoves = newBoard.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
            if (availableMoves.length > 0) {
              const randomIndex = Math.floor(Math.random() * availableMoves.length);
              newBoard[availableMoves[randomIndex]] = 'O';
            }
          }
        }
        
        setBoard(newBoard);
        setIsPlayerTurn(true);
        
        const gameWinner = checkWinner(newBoard);
        if (gameWinner) {
          handleGameOver(gameWinner);
        }
      }, 1000);
    }
    
    return () => clearTimeout(timer);
  }, [isPlayerTurn, gameStarted, winner, board]);

  // Find best move for computer
  const findBestMove = (boardState: BoardState, player: Player): number => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      
      // Check if two cells have the same value and the third is empty
      if (boardState[a] === player && boardState[b] === player && boardState[c] === null) {
        return c;
      }
      if (boardState[a] === player && boardState[c] === player && boardState[b] === null) {
        return b;
      }
      if (boardState[b] === player && boardState[c] === player && boardState[a] === null) {
        return a;
      }
    }
    
    // No winning move found
    return -1;
  };

  // Handle game over
  const handleGameOver = (result: Player | 'draw') => {
    setWinner(result);
    
    if (result === 'X') {
      setPlayerScore(playerScore + 1);
      const quip = computerLoseQuips[Math.floor(Math.random() * computerLoseQuips.length)];
      setFunnyQuips(prev => [...prev, quip]);
      toast({
        title: "You won!",
        description: "Congratulations! You outsmarted the computer!",
        duration: 3000,
      });
    } else if (result === 'O') {
      setComputerScore(computerScore + 1);
      const quip = computerWinQuips[Math.floor(Math.random() * computerWinQuips.length)];
      setFunnyQuips(prev => [...prev, quip]);
      toast({
        title: "Computer won!",
        description: "Better luck next time!",
        duration: 3000,
      });
    } else if (result === 'draw') {
      const quip = drawQuips[Math.floor(Math.random() * drawQuips.length)];
      setFunnyQuips(prev => [...prev, quip]);
      toast({
        title: "It's a draw!",
        description: "Great game, both of you played well!",
        duration: 3000,
      });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
          <PartyPopper className="h-6 w-6" /> Tic Tac Toe
        </CardTitle>
        <CardDescription className="text-center">
          Classic game with a twist - compete against a computer with personality!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!gameStarted ? (
          <div className="text-center p-6">
            <p className="mb-4 text-muted-foreground">
              Play the classic game of Tic Tac Toe against a computer opponent with a sense of humor!
            </p>
            <Button onClick={startGame}>Start Game</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <p>You ({playerEmoji})</p>
                <p className="text-2xl font-bold">{playerScore}</p>
              </div>
              
              <div className="bg-secondary/30 px-4 py-1 rounded-full">
                {winner ? (
                  winner === 'X' ? "You Won!" : 
                  winner === 'O' ? "Computer Won!" : 
                  "It's a Draw!"
                ) : (
                  isPlayerTurn ? "Your Turn" : "Computer Thinking..."
                )}
              </div>
              
              <div className="text-center">
                <p>Computer ({computerEmoji})</p>
                <p className="text-2xl font-bold">{computerScore}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto mb-4">
              {board.map((cell, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`aspect-square text-3xl ${!isPlayerTurn ? 'cursor-not-allowed' : 'hover:bg-secondary/50'}`}
                  onClick={() => handleCellClick(index)}
                  disabled={!!cell || !isPlayerTurn || !!winner}
                >
                  {cell === 'X' ? playerEmoji : cell === 'O' ? computerEmoji : ''}
                </Button>
              ))}
            </div>
            
            {funnyQuips.length > 0 && (
              <div className="my-4 p-3 bg-secondary/20 rounded-lg">
                <p className="font-medium flex items-center gap-2">
                  <Smile size={18} /> Computer says:
                </p>
                <p className="italic">"{funnyQuips[funnyQuips.length - 1]}"</p>
              </div>
            )}
            
            {winner && (
              <div className="flex justify-center mt-2">
                <Button onClick={startGame} className="animate-bounce">Play Again</Button>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <div className="text-center">
          {winner === 'X' && <Trophy className="h-5 w-5 inline-block mr-1 text-yellow-500" />}
          Tic Tac Toe has been enjoyed for centuries - now with modern humor!
        </div>
      </CardFooter>
    </Card>
  );
};

export default TicTacToeGame;
