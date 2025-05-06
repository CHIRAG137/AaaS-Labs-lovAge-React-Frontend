
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Puzzle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PuzzleGame = () => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  
  // Sample puzzle questions
  const puzzles = [
    {
      question: "I'm tall when I'm young, and I'm short when I'm old. What am I?",
      options: ["A Mountain", "A Tree", "A Candle", "A Person"],
      answer: "A Candle"
    },
    {
      question: "What has keys but no locks, space but no room, and you can enter but not go in?",
      options: ["A Map", "A Keyboard", "A Telephone", "A House"],
      answer: "A Keyboard"
    },
    {
      question: "What has a head, a tail, is brown, and has no legs?",
      options: ["A Penny", "A Snake", "A Fish", "A Dog"],
      answer: "A Penny"
    },
    {
      question: "What has 13 hearts but no other organs?",
      options: ["A Hospital", "A Valentine's Card", "A Deck of Cards", "A Calendar"],
      answer: "A Deck of Cards"
    },
    {
      question: "What gets wetter as it dries?",
      options: ["A Sponge", "A Towel", "An Umbrella", "A Dishwasher"],
      answer: "A Towel"
    }
  ];
  
  const startGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setGameStarted(true);
    setGameFinished(false);
    
    toast({
      title: "Puzzle Challenge Started",
      description: "Let's exercise your brain with some fun riddles!",
      duration: 3000,
    });
  };
  
  const handleAnswer = (selectedOption: string) => {
    const isCorrect = selectedOption === puzzles[currentQuestion].answer;
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Well done, that's the right answer!",
        duration: 1500,
      });
    } else {
      toast({
        title: "Not quite right",
        description: `The correct answer was: ${puzzles[currentQuestion].answer}`,
        duration: 1500,
      });
    }
    
    // Move to next question or end game
    if (currentQuestion < puzzles.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        setGameFinished(true);
      }, 1000);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
          <Puzzle className="h-6 w-6" /> Brain Teasers
        </CardTitle>
        <CardDescription className="text-center">
          Solve riddles and puzzles to keep your mind sharp
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[250px]">
        {!gameStarted && !gameFinished ? (
          <div className="text-center p-6">
            <p className="mb-4 text-muted-foreground">
              Challenge yourself with these brain teasers to stimulate critical thinking and problem solving.
            </p>
            <Button onClick={startGame}>Start Challenge</Button>
          </div>
        ) : gameFinished ? (
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-2">Challenge Complete!</h3>
            <p className="mb-4">
              You scored {score} out of {puzzles.length} questions.
              {score === puzzles.length ? " Perfect score!" : " Keep practicing!"}
            </p>
            <Button onClick={startGame}>Play Again</Button>
          </div>
        ) : (
          <div className="p-2">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">
                Question {currentQuestion + 1} of {puzzles.length}:
              </h3>
              <p className="text-center p-4 bg-secondary/50 rounded-lg">
                {puzzles[currentQuestion].question}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {puzzles[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto py-3 text-left"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        {gameStarted && !gameFinished && (
          <div className="w-full flex justify-between">
            <span>Question: {currentQuestion + 1}/{puzzles.length}</span>
            <span>Score: {score}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PuzzleGame;
