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
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Messaging = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Check if friend data is available in the location state
  const friendData = location.state?.friend;

  useEffect(() => {
    if (!friendData) {
      navigate('/friends');
    }
  }, [friendData, navigate]);

  const friend = friendData || {
    _id: '1',
    name: 'Elizabeth',
    image: 'https://images.unsplash.com/photo-1581579438747-104c53d7fbc0'
  };

  const [messages, setMessages] = useState<any[]>([]);  // Fetch messages from the API
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Fetch current user ID using the authToken
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(response.data._id); // Set current user's ID
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch messages from the backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/messages/${friend._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [friend._id]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      recipientId: friend._id,
      content: newMessage,
      sender: currentUserId, // Make sure to include the sender's ID
    };

    try {
      // Send the message via API
      const response = await axios.post(`${API_URL}/messages/send`, newMsg, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      // Update the messages list
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...newMsg,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setNewMessage(''); // Clear input field
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send the message.',
        variant: 'destructive',
      });
    }
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
                key={message._id} // Use message _id as key
                content={message.content}
                timestamp={message.timestamp}
                isSentByMe={message.sender._id === currentUserId}  // Check if message is from the current user
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
