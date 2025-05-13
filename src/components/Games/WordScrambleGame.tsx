
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Laugh, Trophy } from "lucide-react";

const WordScrambleGame = () => {
  const { toast } = useToast();
  const [currentWord, setCurrentWord] = useState<string>("");
  const [scrambledWord, setScrambledWord] = useState<string>("");
  const [userGuess, setUserGuess] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [funnyMessage, setFunnyMessage] = useState<string>("");
  
  // Word lists by difficulty
  const easyWords = [
    "smile", "happy", "laugh", "funny", "joke", "party", "dance", "silly",
    "cheer", "music", "song", "play", "game", "friend", "chat", "share"
  ];
  
  const mediumWords = [
    "garden", "sunset", "coffee", "dinner", "family", "memory", "picture",
    "journey", "wonder", "wisdom", "peaceful", "laughter", "sunshine", "rainbow"
  ];
  
  const hardWords = [
    "retirement", "grandchildren", "experience", "celebration", "achievement", 
    "creativity", "friendship", "relaxation", "adventure", "knowledge", "generation"
  ];
  
  const funnyMessages = [
    "You're sharper than my grandson's math skills!",
    "Your brain is like a fine wine - gets better with age!",
    "Who needs crosswords when you're this good?",
    "You could win the Senior Olympics of word games!",
    "Your grandkids would be impressed with those skills!",
    "Are you sure you haven't been practicing in secret?",
    "Look at you, showing these words who's boss!",
    "Your brain cells are doing the cha-cha with excitement!",
    "If words could talk, they'd ask for your autograph!",
    "You're so good, spell check wants YOUR advice!"
  ];

  // Get random word based on difficulty
  const getRandomWord = () => {
    let wordList;
    switch (difficulty) {
      case 'easy':
        wordList = easyWords;
        break;
      case 'medium':
        wordList = mediumWords;
        break;
      case 'hard':
        wordList = hardWords;
        break;
      default:
        wordList = easyWords;
    }
    
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  };

  // Scramble a word
  const scrambleWord = (word: string) => {
    const characters = word.split('');
    // Make sure the word is actually scrambled and not the same
    let scrambled;
    do {
      for (let i = characters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [characters[i], characters[j]] = [characters[j], characters[i]];
      }
      scrambled = characters.join('');
    } while (scrambled === word);
    
    return scrambled;
  };

  // Start a new game
  const startGame = () => {
    const newWord = getRandomWord();
    setCurrentWord(newWord);
    setScrambledWord(scrambleWord(newWord));
    setUserGuess("");
    setTimeLeft(difficulty === 'easy' ? 30 : difficulty === 'medium' ? 25 : 20);
    setGameStarted(true);
    setGameFinished(false);
    setScore(0);
    setShowHint(false);
    
    toast({
      title: "Word Scramble Started!",
      description: "Unscramble the words before time runs out!",
      duration: 3000,
    });
  };

  // Check user's guess
  const checkGuess = () => {
    if (userGuess.toLowerCase() === currentWord.toLowerCase()) {
      // Correct guess!
      const pointsGained = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
      setScore(score + pointsGained);
      
      // Display a random funny message
      const randomMessageIndex = Math.floor(Math.random() * funnyMessages.length);
      setFunnyMessage(funnyMessages[randomMessageIndex]);
      
      toast({
        title: "Correct!",
        description: "That's right! Get ready for the next word.",
        duration: 1500,
      });
      
      // Move to next word
      setTimeout(() => {
        const newWord = getRandomWord();
        setCurrentWord(newWord);
        setScrambledWord(scrambleWord(newWord));
        setUserGuess("");
        setShowHint(false);
        
        // Add a small time bonus for correct answers
        setTimeLeft(prev => Math.min(prev + 5, difficulty === 'easy' ? 30 : difficulty === 'medium' ? 25 : 20));
      }, 1500);
    } else {
      // Wrong guess
      toast({
        title: "Not quite right",
        description: "Try again or use a hint!",
        duration: 1500,
      });
    }
  };

  // Provide a hint (first letter)
  const showWordHint = () => {
    setShowHint(true);
    // Small penalty for using a hint
    setTimeLeft(prev => Math.max(prev - 3, 0));
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gameStarted && !gameFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameFinished(true);
            clearInterval(timer as NodeJS.Timeout);
            
            toast({
              title: "Time's Up!",
              description: `Final score: ${score} points!`,
              duration: 3000,
            });
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, gameFinished, timeLeft]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkGuess();
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
          <Laugh className="h-6 w-6" /> Word Scramble
        </CardTitle>
        <CardDescription className="text-center">
          Unscramble the words and have a chuckle along the way!
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[250px]">
        {!gameStarted && !gameFinished ? (
          <div className="text-center p-6">
            <p className="mb-4 text-muted-foreground">
              Test your word skills with this fun scramble game! Choose your difficulty:
            </p>
            <div className="flex justify-center gap-2 mb-4">
              <Button
                variant={difficulty === 'easy' ? 'default' : 'outline'}
                onClick={() => setDifficulty('easy')}
              >
                Easy
              </Button>
              <Button
                variant={difficulty === 'medium' ? 'default' : 'outline'}
                onClick={() => setDifficulty('medium')}
              >
                Medium
              </Button>
              <Button
                variant={difficulty === 'hard' ? 'default' : 'outline'}
                onClick={() => setDifficulty('hard')}
              >
                Hard
              </Button>
            </div>
            <Button onClick={startGame}>Start Game</Button>
          </div>
        ) : gameFinished ? (
          <div className="text-center p-6">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-xl font-semibold mb-2">Game Over!</h3>
            <p className="mb-4">
              You scored {score} points! {score > 5 ? "Amazing job!" : "Keep practicing!"}
            </p>
            <Button onClick={startGame}>Play Again</Button>
          </div>
        ) : (
          <div className="p-2">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span>Score: {score}</span>
                <span className={`font-medium ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : ''}`}>
                  Time: {timeLeft}s
                </span>
              </div>
              
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Unscramble this word:</h3>
                <p className="text-3xl font-mono tracking-wider">
                  {scrambledWord.toUpperCase()}
                </p>
                
                {showHint && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Hint: The first letter is "{currentWord[0].toUpperCase()}"
                  </p>
                )}
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="Type your answer here..."
                className="text-center text-lg"
                autoComplete="off"
              />
              
              <div className="flex justify-between gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={showWordHint}
                  disabled={showHint}
                  className="flex-1"
                >
                  Hint (-3s)
                </Button>
                <Button type="submit" className="flex-1">Check Answer</Button>
              </div>
            </form>
            
            {funnyMessage && (
              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
                <p className="italic">{funnyMessage}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="w-full text-center">
          Exercising your brain and having fun at the same time!
        </div>
      </CardFooter>
    </Card>
  );
};

export default WordScrambleGame;
