
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume, VolumeX, Mic, MicOff, Phone, SkipForward, MessageSquare, X, Maximize, Minimize, Video, VideoOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';

interface Message {
  id: number;
  content: string;
  sender: 'me' | 'friend';
  timestamp: string;
}

const VideoContainer: React.FC = () => {
  const [isChatting, setIsChatting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [showTextChat, setShowTextChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [videoPosition, setVideoPosition] = useState({ x: 4, y: 4 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasVideo, setHasVideo] = useState(true);
  const [peerHasVideo, setPeerHasVideo] = useState(true);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  
  // WebRTC refs
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localVideoElementRef = useRef<HTMLVideoElement>(null);
  const remoteVideoElementRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const isInitiatorRef = useRef(false);
  const isConnectedRef = useRef(false);
  
  // Signaling server simulation (in a real app, this would be a WebSocket connection)
  const signalingChannel = useRef<{
    onmessage: ((event: { data: string }) => void) | null;
    send: (message: string) => void;
  }>({
    onmessage: null,
    send: (message: string) => {
      // Simulate sending a message to the peer
      // In a real app, this would send data through a WebSocket
      console.log('Sending signaling message:', JSON.parse(message));
      
      // Simulate delay and reception
      setTimeout(() => {
        if (signalingChannel.current.onmessage) {
          signalingChannel.current.onmessage({ data: message });
        }
      }, 500);
    }
  });

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  // Clean up WebRTC connections when component unmounts
  useEffect(() => {
    return () => {
      endWebRTC();
    };
  }, []);

  const setupWebRTC = async () => {
    try {
      // Request access to webcam and microphone
      const mediaConstraints = {
        audio: true,
        video: true
      };
      
      const localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      localStreamRef.current = localStream;
      
      if (localVideoElementRef.current) {
        localVideoElementRef.current.srcObject = localStream;
      }
      
      // Create a new RTCPeerConnection
      const configuration = { 
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
        ] 
      };
      
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;
      
      // Add local tracks to the peer connection
      localStream.getTracks().forEach(track => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.addTrack(track, localStream);
        }
      });
      
      // Set up event handlers for ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          const message = JSON.stringify({
            type: 'candidate',
            candidate: event.candidate
          });
          signalingChannel.current.send(message);
        }
      };
      
      // Handle incoming tracks
      peerConnection.ontrack = (event) => {
        if (!remoteStreamRef.current) {
          remoteStreamRef.current = new MediaStream();
        }
        
        event.streams[0].getTracks().forEach(track => {
          if (remoteStreamRef.current) {
            remoteStreamRef.current.addTrack(track);
          }
        });
        
        if (remoteVideoElementRef.current) {
          remoteVideoElementRef.current.srcObject = remoteStreamRef.current;
        }
        
        isConnectedRef.current = true;
      };
      
      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        
        if (peerConnection.connectionState === 'disconnected' || 
            peerConnection.connectionState === 'failed' || 
            peerConnection.connectionState === 'closed') {
          // Handle disconnection
          isConnectedRef.current = false;
          toast({
            title: "Connection lost",
            description: "The connection to your chat partner was lost."
          });
        }
      };
      
      // Set up signaling channel message handler
      signalingChannel.current.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'offer') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(message));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          
          signalingChannel.current.send(JSON.stringify({
            type: 'answer',
            sdp: answer
          }));
          
        } else if (message.type === 'answer') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(message));
          
        } else if (message.type === 'candidate') {
          try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
          } catch (err) {
            console.error('Error adding ice candidate:', err);
          }
          
        } else if (message.type === 'ready') {
          if (isInitiatorRef.current) {
            createOffer();
          }
        }
      };
      
      return true;
    } catch (err) {
      console.error('Error setting up WebRTC:', err);
      toast({
        title: "Camera access error",
        description: "Could not access your camera or microphone. Please check your permissions.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const createOffer = async () => {
    if (!peerConnectionRef.current) return;
    
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      signalingChannel.current.send(JSON.stringify({
        type: 'offer',
        sdp: offer
      }));
    } catch (err) {
      console.error('Error creating offer:', err);
      toast({
        title: "Connection error",
        description: "Could not establish a connection. Please try again."
      });
    }
  };
  
  const endWebRTC = () => {
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Stop all tracks in the local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    // Clear remote stream
    remoteStreamRef.current = null;
    
    if (localVideoElementRef.current) {
      localVideoElementRef.current.srcObject = null;
    }
    
    if (remoteVideoElementRef.current) {
      remoteVideoElementRef.current.srcObject = null;
    }
    
    isConnectedRef.current = false;
  };

  const startChat = async () => {
    toast({
      title: "Looking for a chat partner",
      description: "Please wait while we connect you with someone nice to talk to."
    });
    
    // Initialize WebRTC
    const success = await setupWebRTC();
    if (success) {
      // In a real app, you would connect to a signaling server here
      
      // For the demo, simulate finding a partner after a short delay
      setTimeout(() => {
        setIsChatting(true);
        setIsSkipping(false);
        isInitiatorRef.current = true;
        
        // Signal that we're ready to connect
        signalingChannel.current.send(JSON.stringify({ type: 'ready' }));
        
        toast({
          title: "Connected!",
          description: "You're now chatting with a new friend. Say hello!"
        });
        
        // In a real app, the actual connection would be established 
        // through the signaling server
        createOffer();
      }, 2000);
    }
  };

  const endChat = () => {
    endWebRTC();
    setIsChatting(false);
    setShowTextChat(false);
    setMessages([]);
    toast({
      title: "Chat ended",
      description: "Your chat has ended. We hope you had a nice conversation!"
    });
  };

  const skipChat = () => {
    endWebRTC();
    setIsSkipping(true);
    toast({
      title: "Skipping to next person",
      description: "Looking for someone new to talk with..."
    });
    
    // In a real app, this would disconnect the current WebRTC connection
    // and establish a new one through the signaling server
    
    // For the demo, simulate finding a new partner after a short delay
    setTimeout(async () => {
      const success = await setupWebRTC();
      if (success) {
        setIsSkipping(false);
        setMessages([]);
        isInitiatorRef.current = true;
        
        // Signal that we're ready to connect
        signalingChannel.current.send(JSON.stringify({ type: 'ready' }));
        
        toast({
          title: "Connected!",
          description: "You're now chatting with a new friend. Say hello!"
        });
        
        // Create an offer to the new peer
        createOffer();
      } else {
        setIsChatting(false);
        setIsSkipping(false);
      }
    }, 2000);
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
    }
    
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone turned on" : "Microphone turned off",
      description: isMuted ? "Others can now hear you" : "Others cannot hear you now"
    });
  };

  const toggleAudio = () => {
    if (remoteStreamRef.current) {
      const audioTracks = remoteStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isAudioMuted;
      });
    }
    
    setIsAudioMuted(!isAudioMuted);
    toast({
      title: isAudioMuted ? "Speaker turned on" : "Speaker turned off",
      description: isAudioMuted ? "You can now hear others" : "You cannot hear others now"
    });
  };
  
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !hasVideo;
      });
    }
    
    setHasVideo(!hasVideo);
    toast({
      title: hasVideo ? "Camera turned off" : "Camera turned on",
      description: hasVideo ? "Others cannot see you now" : "Others can now see you"
    });
  };

  const toggleTextChat = () => {
    setShowTextChat(!showTextChat);
    if (!showTextChat) {
      toast({
        title: "Text chat opened",
        description: "You can now send text messages during your video call"
      });
    }
  };

  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      try {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen();
        }
      } catch (err) {
        toast({
          title: "Fullscreen error",
          description: "Could not enter fullscreen mode"
        });
      }
    } else {
      document.exitFullscreen();
    }
  };

  const handleMouseDown = (e) => {
    if (localVideoRef.current) {
      setIsDragging(true);
      const rect = localVideoRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && containerRef.current) {
      e.preventDefault();
      const containerRect = containerRef.current.getBoundingClientRect();
      const localVideoRect = localVideoRef.current.getBoundingClientRect();
      
      let newX = e.clientX - containerRect.left - dragOffset.x;
      let newY = e.clientY - containerRect.top - dragOffset.y;
      
      // Keep within bounds
      newX = Math.max(0, Math.min(newX, containerRect.width - localVideoRect.width));
      newY = Math.max(0, Math.min(newY, containerRect.height - localVideoRect.height));
      
      setVideoPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for drag and drop
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate a reply after a delay (in a real app, this would be handled by your backend)
    setTimeout(() => {
      const replyMsg: Message = {
        id: messages.length + 2,
        content: "I received your message! This is a simple reply.",
        sender: 'friend',
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      setMessages(prevMessages => [...prevMessages, replyMsg]);
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div 
        ref={containerRef}
        className={`card-elderly aspect-video bg-muted overflow-hidden relative ${isFullScreen ? 'w-full h-full' : ''}`}
      >
        {isChatting ? (
          <>
            {/* Remote video stream */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isSkipping ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                  <p className="text-2xl font-medium mt-4">Finding new friend...</p>
                </div>
              ) : (
                <>
                  <video
                    ref={remoteVideoElementRef}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover ${!peerHasVideo ? 'hidden' : ''}`}
                  />
                  {!peerHasVideo && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <div className="text-white text-center p-4">
                        <VideoOff size={64} className="mx-auto mb-4" />
                        <p className="text-xl">Friend's camera is turned off</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Fullscreen toggle button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 rounded-full bg-black/30 hover:bg-black/50 text-white z-20"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </Button>
            
            {/* Local video preview - now draggable */}
            <div 
              ref={localVideoRef}
              className="absolute w-48 h-36 bg-black/20 rounded-lg overflow-hidden border-2 border-white cursor-move"
              style={{ 
                left: `${videoPosition.x}px`, 
                bottom: `${videoPosition.y + (showTextChat ? 0 : 0)}px`,
                touchAction: 'none',
                zIndex: 15
              }}
              onMouseDown={handleMouseDown}
            >
              {hasVideo ? (
                <video
                  ref={localVideoElementRef}
                  autoPlay
                  playsInline
                  muted // Must be muted to avoid feedback
                  className="w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <VideoOff size={24} className="text-white" />
                </div>
              )}
            </div>
            
            {/* Text chat sidebar - improved positioning */}
            {showTextChat && (
              <div className="absolute top-0 right-0 bottom-0 h-full w-80 bg-white/95 dark:bg-gray-800/95 shadow-lg flex flex-col z-10">
                <div className="flex justify-between items-center p-3 border-b">
                  <h3 className="font-semibold">Chat</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full" 
                    onClick={toggleTextChat}
                  >
                    <X size={20} />
                  </Button>
                </div>
                
                <ScrollArea className="flex-grow p-3">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        content={message.content}
                        timestamp={message.timestamp}
                        isSentByMe={message.sender === 'me'}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-grow"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      className="shrink-0"
                      size="icon"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m22 2-7 20-4-9-9-4Z"></path>
                        <path d="M22 2 11 13"></path>
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Controls - moved to center bottom with more space */}
            <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 ${showTextChat ? 'pr-80' : ''}`}>
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
                variant={hasVideo ? "secondary" : "destructive"}
                className="rounded-full w-14 h-14 flex items-center justify-center"
                onClick={toggleVideo}
                disabled={isSkipping}
              >
                {hasVideo ? <Video size={24} /> : <VideoOff size={24} />}
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
              
              <Button 
                size="lg"
                variant={showTextChat ? "default" : "secondary"}
                className="rounded-full w-14 h-14 flex items-center justify-center"
                onClick={toggleTextChat}
                disabled={isSkipping}
              >
                <MessageSquare size={24} />
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
        <h3 className="text-2xl font-medium mb-4">How to use lovAge:</h3>
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
