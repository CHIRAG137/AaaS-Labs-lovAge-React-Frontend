
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const MoodCheckIn = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { toast } = useToast();

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    toast({
      title: "Mood Recorded",
      description: `You're feeling ${mood} today. Thanks for sharing!`,
      duration: 3000,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">How are you feeling today?</CardTitle>
        <CardDescription className="text-center">
          Let us know your mood so we can suggest appropriate activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center space-x-6 py-4">
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
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        {selectedMood ? 
          "Thank you for sharing how you're feeling. We're here for you!" : 
          "Your response is private and only used to suggest activities."}
      </CardFooter>
    </Card>
  );
};

export default MoodCheckIn;
