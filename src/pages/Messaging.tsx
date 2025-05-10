
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import MessageBubble from '@/components/Messaging/MessageBubble';

interface Friend {
  id: string;
  name: string;
  image: string;
}

const Messaging = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  console.log("Messaging component rendered");
  console.log("Location state:", location.state);
  
  // Check if friend data is available in the location state
  const friendData = location.state?.friend;
  
  // If no friend data is provided, redirect back to friends page
  useEffect(() => {
    if (!friendData) {
      console.log("No friend data found, redirecting to friends page");
      navigate('/friends');
    } else {
      console.log("Friend data received:", friendData);
      
      // Show a toast that we've started chatting with this friend
      toast({
        title: "Chat opened",
        description: `You can now chat with ${friendData.name}`,
      });
    }
  }, [friendData, navigate, toast]);
  
  // Use the friend data from state or fallback to default
  const friend: Friend = friendData || { 
    id: '1', 
    name: 'Elizabeth', 
    image: 'https://images.unsplash.com/photo-1581579438747-104c53d7fbc0' 
  };
  
  const [messages, setMessages] = useState([
    { id: 1, content: "Hello there! How are you today?", sender: 'friend', timestamp: '10:05 AM' },
    { id: 2, content: "I'm doing well, thank you for asking! How about you?", sender: 'me', timestamp: '10:07 AM' },
    { id: 3, content: "I'm good too. Did you enjoy the book club yesterday?", sender: 'friend', timestamp: '10:10 AM' },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: messages.length + 1,
      content: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate a reply after a delay (in a real app, this would be handled by your backend)
    setTimeout(() => {
      const replyMsg = {
        id: messages.length + 2,
        content: "I received your message! This is a simple automated reply.",
        sender: 'friend',
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      setMessages(prevMessages => [...prevMessages, replyMsg]);
      
      toast({
        title: "New Message",
        description: `${friend.name} has sent you a message`,
      });
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-200px)]">
          {/* Chat header */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Avatar className="w-12 h-12">
              <AvatarImage src={friend.image} alt={friend.name} />
              <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{friend.name}</h2>
              <p className="text-sm text-muted-foreground">Online now</p>
            </div>
          </div>
          
          {/* Messages area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: 'smooth' }}>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                timestamp={message.timestamp}
                isSentByMe={message.sender === 'me'}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message input */}
          <Card className="p-3 flex gap-2 items-center">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-grow text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} size="icon" className="h-10 w-10">
              <Send size={20} />
            </Button>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Messaging;
