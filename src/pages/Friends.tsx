
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Heart, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Friends = () => {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const { toast } = useToast();
  
  // Mock data
  const friendRequests = [
    { id: '1', name: 'Margaret', image: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8' },
    { id: '2', name: 'Thomas', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d' },
  ];
  
  const myFriends = [
    { id: '3', name: 'Elizabeth', image: 'https://images.unsplash.com/photo-1581579438747-104c53d7fbc0' },
    { id: '4', name: 'Richard', image: 'https://images.unsplash.com/photo-1559963110-71b394e7494d' },
    { id: '5', name: 'Susan', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e' },
  ];
  
  const acceptFriendRequest = (id: string, name: string) => {
    toast({
      title: "Friend request accepted!",
      description: `You are now friends with ${name}.`,
    });
  };
  
  const declineFriendRequest = (id: string, name: string) => {
    toast({
      title: "Friend request declined",
      description: `You declined ${name}'s friend request.`,
    });
  };
  
  const startChat = (id: string, name: string) => {
    toast({
      title: "Chat opened",
      description: `You can now start chatting with ${name}.`,
    });
  };
  
  const startVideoCall = (id: string, name: string) => {
    toast({
      title: "Video call",
      description: `Starting a video call with ${name}.`,
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <section className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">Your <span className="text-primary">Friends</span></h1>
          <p className="text-2xl max-w-3xl mx-auto">
            Connect with your friends through chat or video
          </p>
        </section>
        
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            size="lg" 
            variant={activeTab === 'friends' ? 'default' : 'outline'}
            onClick={() => setActiveTab('friends')}
            className="gap-2 text-xl"
          >
            <Users size={24} />
            My Friends ({myFriends.length})
          </Button>
          
          <Button 
            size="lg" 
            variant={activeTab === 'requests' ? 'default' : 'outline'}
            onClick={() => setActiveTab('requests')}
            className="gap-2 text-xl"
          >
            <Heart size={24} />
            Friend Requests ({friendRequests.length})
          </Button>
        </div>
        
        {activeTab === 'requests' ? (
          <div className="space-y-4">
            {friendRequests.length > 0 ? (
              friendRequests.map(request => (
                <Card key={request.id} className="card-elderly">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={request.image} alt={request.name} />
                        <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-2xl font-semibold">{request.name}</h3>
                        <p className="text-muted-foreground">Wants to be your friend</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => acceptFriendRequest(request.id, request.name)}
                        variant="default"
                        className="text-lg"
                      >
                        Accept
                      </Button>
                      <Button 
                        onClick={() => declineFriendRequest(request.id, request.name)}
                        variant="outline"
                        className="text-lg"
                      >
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-2xl text-muted-foreground">No friend requests at the moment</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {myFriends.length > 0 ? (
              myFriends.map(friend => (
                <Card key={friend.id} className="card-elderly">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={friend.image} alt={friend.name} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-2xl font-semibold">{friend.name}</h3>
                        <p className="text-muted-foreground">Friend</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => startVideoCall(friend.id, friend.name)}
                        variant="default"
                        className="text-lg gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m22 8-6 4 6 4V8Z"/>
                          <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
                        </svg>
                        Video Call
                      </Button>
                      <Button 
                        onClick={() => startChat(friend.id, friend.name)}
                        variant="outline"
                        className="text-lg gap-2"
                      >
                        <MessageSquare size={20} />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-2xl text-muted-foreground">You don't have any friends yet</p>
                <Button className="mt-4 text-xl" variant="default" onClick={() => window.location.href = "/find-friends"}>
                  Find Friends
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Friends;
