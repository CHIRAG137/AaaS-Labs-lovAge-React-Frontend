
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FriendCard from '@/components/Friends/FriendCard';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FindFriends = () => {
  const [activeTab, setActiveTab] = useState<'nearby' | 'all'>('nearby');
  const { toast } = useToast();
  
  // Mock data for demonstration purposes
  const nearbyFriends = [
    { id: '1', name: 'Martha', age: 72, distance: '2 miles away', interests: ['Gardening', 'Books'], image: 'https://images.unsplash.com/photo-1581579438747-104c53d7fbc0' },
    { id: '2', name: 'Robert', age: 75, distance: '5 miles away', interests: ['Chess', 'Walking'], image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d' },
    { id: '3', name: 'Eleanor', age: 68, distance: '3 miles away', interests: ['Cooking', 'Music'], image: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8' },
  ];
  
  const allFriends = [
    ...nearbyFriends,
    { id: '4', name: 'William', age: 70, distance: '20 miles away', interests: ['History', 'Movies'], image: 'https://images.unsplash.com/photo-1559963110-71b394e7494d' },
    { id: '5', name: 'Dorothy', age: 65, distance: '25 miles away', interests: ['Painting', 'Travel'], image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e' },
  ];
  
  const handleSendFriendRequest = (id: string, name: string) => {
    toast({
      title: "Friend request sent!",
      description: `You sent a friend request to ${name}. We'll notify you when they respond.`,
    });
  };
  
  const handleMessageFriend = (id: string, name: string) => {
    // In a real app, this would open a chat with this person
    toast({
      title: "Chat opened",
      description: `You can now start chatting with ${name}.`,
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <section className="text-center mb-8 animate-fade-in">
          <h1 className="page-title">Find New <span className="text-primary">Friends</span></h1>
          <p className="text-lg max-w-3xl mx-auto mb-6 text-muted-foreground">
            Discover friendly people who share your interests
          </p>
        </section>
        
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            size="lg" 
            variant={activeTab === 'nearby' ? 'default' : 'outline'}
            onClick={() => setActiveTab('nearby')}
            className="gap-2"
          >
            <MapPin size={20} />
            Nearby Friends
          </Button>
          
          <Button 
            size="lg" 
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
            className="gap-2"
          >
            <Search size={20} />
            All Friends
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'nearby' ? nearbyFriends : allFriends).map(friend => (
            <FriendCard 
              key={friend.id}
              friend={friend}
              onSendFriendRequest={() => handleSendFriendRequest(friend.id, friend.name)}
              onMessageFriend={() => handleMessageFriend(friend.id, friend.name)}
            />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button 
            size="lg"
            variant="default"
            className="text-base"
          >
            Find More Friends
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FindFriends;
