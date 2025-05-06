
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Messaging = () => {
  const location = useLocation();
  const { state } = location;
  const { friend } = state || { 
    friend: { 
      id: '1', 
      name: 'Elizabeth', 
      image: 'https://images.unsplash.com/photo-1581579438747-104c53d7fbc0' 
    } 
  };
  
  const [messages, setMessages] = useState([
    { id: 1, content: "Hello there! How are you today?", sender: 'friend', timestamp: '10:05 AM' },
    { id: 2, content: "I'm doing well, thank you for asking! How about you?", sender: 'me', timestamp: '10:07 AM' },
    { id: 3, content: "I'm good too. Did you enjoy the book club yesterday?", sender: 'friend', timestamp: '10:10 AM' },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  
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
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] ${
                    message.sender === 'me' 
                      ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-none' 
                      : 'bg-secondary rounded-2xl rounded-tl-none'
                  } px-4 py-3 shadow-sm`}
                >
                  <p className="text-base mb-1">{message.content}</p>
                  <p className="text-xs opacity-70 text-right">{message.timestamp}</p>
                </div>
              </div>
            ))}
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
