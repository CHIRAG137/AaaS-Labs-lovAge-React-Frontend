
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume, VolumeX, Mic, MicOff, Phone, SkipForward } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const VideoContainer: React.FC = () => {
  const [isChatting, setIsChatting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const { toast } = useToast();

  const startChat = () => {
    toast({
      title: "Looking for a chat partner",
      description: "Please wait while we connect you with someone nice to talk to."
    });
    
    // In a real app, this would initiate the WebRTC connection
    setTimeout(() => {
      setIsChatting(true);
      setIsSkipping(false);
      toast({
        title: "Connected!",
        description: "You're now chatting with a new friend. Say hello!"
      });
    }, 2000);
  };

  const endChat = () => {
    setIsChatting(false);
    toast({
      title: "Chat ended",
      description: "Your chat has ended. We hope you had a nice conversation!"
    });
  };

  const skipChat = () => {
    setIsSkipping(true);
    toast({
      title: "Skipping to next person",
      description: "Looking for someone new to talk with..."
    });
    
    // In a real app, this would end current WebRTC connection and start a new one
    setTimeout(() => {
      setIsSkipping(false);
      toast({
        title: "Connected!",
        description: "You're now chatting with a new friend. Say hello!"
      });
    }, 2000);
  };

  const toggleMic = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone turned on" : "Microphone turned off",
      description: isMuted ? "Others can now hear you" : "Others cannot hear you now"
    });
  };

  const toggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
    toast({
      title: isAudioMuted ? "Speaker turned on" : "Speaker turned off",
      description: isAudioMuted ? "You can now hear others" : "You cannot hear others now"
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="card-elderly aspect-video bg-muted overflow-hidden relative">
        {isChatting ? (
          <>
            {/* This would be replaced with actual video streams in a real app */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isSkipping ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                  <p className="text-2xl font-medium mt-4">Finding new friend...</p>
                </div>
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1472396961693-142e6e269027" 
                  alt="Video placeholder" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* Local video preview */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-black/20 rounded-lg overflow-hidden border-2 border-white">
              <img 
                src="https://images.unsplash.com/photo-1582562124811-c09040d0a901" 
                alt="Your video" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
              <Button 
                size="lg"
                variant={isMuted ? "destructive" : "secondary"}
                className="rounded-full w-14 h-14 flex items-center justify-center"
                onClick={toggleMic}
                disabled={isSkipping}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </Button>
              
              <Button 
                size="lg"
                variant="destructive"
                className="rounded-full w-16 h-16 flex items-center justify-center"
                onClick={endChat}
                disabled={isSkipping}
              >
                <Phone size={28} />
              </Button>
              
              <Button 
                size="lg"
                variant="secondary"
                className="rounded-full w-14 h-14 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={skipChat}
                disabled={isSkipping}
              >
                <SkipForward size={24} />
              </Button>
              
              <Button 
                size="lg"
                variant={isAudioMuted ? "destructive" : "secondary"}
                className="rounded-full w-14 h-14 flex items-center justify-center"
                onClick={toggleAudio}
                disabled={isSkipping}
              >
                {isAudioMuted ? <VolumeX size={24} /> : <Volume size={24} />}
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8">
            <h2 className="text-4xl font-bold text-primary mb-6">Ready to chat?</h2>
            <p className="text-2xl text-center mb-8 max-w-md">
              Click the button below to start a friendly video conversation with another person
            </p>
            <Button 
              className="btn-primary text-2xl py-6 px-10 animate-pulse-gentle"
              onClick={startChat}
            >
              Start Video Chat
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-2xl font-medium mb-4">How to use GoldenChat:</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-elderly">
            <div className="text-xl mb-2 font-semibold">1. Start a chat</div>
            <p>Click the "Start Video Chat" button to begin</p>
          </div>
          <div className="card-elderly">
            <div className="text-xl mb-2 font-semibold">2. Say hello</div>
            <p>Greet your new friend with a smile and a wave</p>
          </div>
          <div className="card-elderly">
            <div className="text-xl mb-2 font-semibold">3. Skip to next</div>
            <p>Press the yellow button to find a new person to chat with</p>
          </div>
          <div className="card-elderly">
            <div className="text-xl mb-2 font-semibold">4. End anytime</div>
            <p>Press the red button when you're ready to finish</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;
