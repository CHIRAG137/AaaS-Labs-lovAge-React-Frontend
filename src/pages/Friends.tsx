import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Heart, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Friends = () => {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the token from localStorage and get the current user's ID
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data._id); // Set the current user's ID
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      // Fetch the list of friends with 'accepted' status
      fetch(`${API_URL}/friends/accepted-friends/${userId}`)
        .then((response) => response.json())
        .then((data) => setFriends(data));

      // Fetch friend requests with 'sent' status
      fetch(`${API_URL}/friends/friend-requests/${userId}`)
        .then((response) => response.json())
        .then((data) => setFriendRequests(data));
    }
  }, [userId]);

  const acceptFriendRequest = async (id: string, name: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to accept friend requests.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await axios.post(
        `${API_URL}/friends/accept-request/${id}`, // Use 'id' directly here for the requester's ID
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: 'Friend request accepted!',
        description: `You are now friends with ${name}.`,
      });

    } catch (err: any) {
      toast({
        title: 'Failed to accept request',
        description: err.response?.data?.error || 'Try again later.',
        variant: 'destructive',
      });
    }
  };

  const declineFriendRequest = async (id: string, name: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to decline friend requests.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await axios.post(
        `${API_URL}/friends/decline-request/${id}`, // Use 'id' directly here for the requester's ID
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: 'Friend request declined',
        description: `You declined ${name}'s friend request.`,
      });

    } catch (err: any) {
      toast({
        title: 'Failed to decline request',
        description: err.response?.data?.error || 'Try again later.',
        variant: 'destructive',
      });
    }
  };

  const startChat = (friend: { _id: string; name: string; image: string }) => {
    console.log('Starting chat with:', friend);
    navigate('/messaging', { state: { friend }, replace: false });
  };

  const startVideoCall = (id: string, name: string) => {
    toast({
      title: 'Video call',
      description: `Starting a video call with ${name}.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <section className="text-center mb-8 animate-fade-in">
          <h1 className="page-title">Your <span className="text-primary">Friends</span></h1>
          <p className="text-lg max-w-3xl mx-auto mb-6 text-muted-foreground">
            Connect with your friends through chat or video
          </p>
        </section>
        <div className="flex justify-center gap-4 mb-8">
          <Button
            size="lg"
            variant={activeTab === 'friends' ? 'default' : 'outline'}
            onClick={() => setActiveTab('friends')}
            className="gap-2"
          >
            <Users size={20} />
            My Friends ({friends.length})
          </Button>
          <Button
            size="lg"
            variant={activeTab === 'requests' ? 'default' : 'outline'}
            onClick={() => setActiveTab('requests')}
            className="gap-2"
          >
            <Heart size={20} />
            Friend Requests ({friendRequests.length})
          </Button>
        </div>

        {activeTab === 'requests' ? (
          <div className="space-y-4">
            {friendRequests.length > 0 ? (
              friendRequests.map((request) => (
                <Card key={request._id} className="card-elderly">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={request.image} alt={request.name} />
                        <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{request.name}</h3>
                        <p className="text-muted-foreground">Wants to be your friend</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => acceptFriendRequest(request._id, request.name)}
                        variant="default"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => declineFriendRequest(request._id, request.name)}
                        variant="outline"
                      >
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-xl text-muted-foreground">No friend requests at the moment</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <Card key={friend._id} className="card-elderly">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={friend.image} alt={friend.name} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{friend.name}</h3>
                        <p className="text-muted-foreground">Friend</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => startVideoCall(friend._id, friend.name)}
                        variant="default"
                        className="gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m22 8-6 4 6 4V8Z" />
                          <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                        </svg>
                        Video Call
                      </Button>
                      <Button
                        onClick={() => startChat(friend)}
                        variant="outline"
                        className="gap-2"
                      >
                        <MessageSquare size={18} />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-xl text-muted-foreground">You don't have any friends yet</p>
                <Button className="mt-4" variant="default" onClick={() => window.location.href = '/find-friends'}>
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
