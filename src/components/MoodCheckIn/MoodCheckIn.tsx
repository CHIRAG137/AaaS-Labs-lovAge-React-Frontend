
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const MoodCheckIn = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [showJoke, setShowJoke] = useState<boolean>(false);
  const [joke, setJoke] = useState<string>("");
  const { toast } = useToast();

  // Array of light-hearted jokes suitable for elderly users
  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised!",
    "What do you call a fake noodle? An impasta!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "How do you organize a space party? You planet!",
    "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
    "I tried to make a belt out of watches, but it was a waist of time.",
    "What do you call a parade of rabbits hopping backwards? A receding hare-line.",
    "Time flies like an arrow; fruit flies like a banana.",
    "Why don't eggs tell jokes? They'd crack each other up!"
  ];

  // Get a random joke from the jokes array
  const getRandomJoke = () => {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    return jokes[randomIndex];
  };

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    
    if (mood === "okay" || mood === "down") {
      // Show a joke to cheer them up
      setJoke(getRandomJoke());
      setShowJoke(true);
    } else {
      // Just close the dialog with a toast
      setIsDialogOpen(false);
      toast({
        title: "Mood Recorded",
        description: `You're feeling ${mood} today. Thanks for sharing!`,
        duration: 3000,
      });
    }
  };

  const handleJokeAcknowledged = () => {
    setShowJoke(false);
    setIsDialogOpen(false);
    toast({
      title: "Mood Recorded",
      description: `We hope that brought a smile to your day!`,
      duration: 3000,
    });
  };

  // Check if the user has already done a mood check today
  // In a real app, this would be stored in a database
  React.useEffect(() => {
    const hasDoneMoodCheck = localStorage.getItem('moodCheckDate') === new Date().toDateString();
    
    if (!hasDoneMoodCheck) {
      // Show the dialog after a short delay on page load
      const timer = setTimeout(() => {
        setIsDialogOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    
    // Remember that they've done the mood check today
    localStorage.setItem('moodCheckDate', new Date().toDateString());
  };

  const triggerMoodCheck = () => {
    setIsDialogOpen(true);
    setSelectedMood(null);
    setShowJoke(false);
  };

  return (
    <>
      <Button 
        onClick={triggerMoodCheck}
        className="rounded-full bg-primary hover:bg-primary/90 text-white px-6 py-2 flex items-center gap-2"
      >
        <Smile className="h-5 w-5" />
        How are you feeling today?
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">How are you feeling today?</DialogTitle>
            <DialogDescription className="text-center">
              Let us know your mood so we can suggest appropriate activities
            </DialogDescription>
          </DialogHeader>
          
          {!showJoke ? (
            <div className="flex justify-center space-x-6 py-6">
              <Button 
                variant={selectedMood === "happy" ? "default" : "outline"} 
                className="flex flex-col items-center p-4 h-auto" 
                onClick={() => handleMoodSelection("happy")}
              >
                <Smile className="h-10 w-10 mb-2" />
                <span>Happy</span>
              </Button>
              <Button 
                variant={selectedMood === "okay" ? "default" : "outline"} 
                className="flex flex-col items-center p-4 h-auto" 
                onClick={() => handleMoodSelection("okay")}
              >
                <Meh className="h-10 w-10 mb-2" />
                <span>Okay</span>
              </Button>
              <Button 
                variant={selectedMood === "down" ? "default" : "outline"} 
                className="flex flex-col items-center p-4 h-auto" 
                onClick={() => handleMoodSelection("down")}
              >
                <Frown className="h-10 w-10 mb-2" />
                <span>Down</span>
              </Button>
            </div>
          ) : (
            <div className="py-6 text-center space-y-4">
              <p className="text-lg font-medium">Here's something to brighten your day:</p>
              <p className="text-xl italic bg-muted p-4 rounded-lg">{joke}</p>
              <Button onClick={handleJokeAcknowledged} className="mt-4">
                Thank you, that helped!
              </Button>
            </div>
          )}
          
          <DialogFooter className="sm:justify-center text-center text-sm text-muted-foreground">
            {!showJoke && (
              <p>Your response is private and only used to suggest activities.</p>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MoodCheckIn;
