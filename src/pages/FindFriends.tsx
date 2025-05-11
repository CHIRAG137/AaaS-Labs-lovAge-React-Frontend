import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FriendCard from '@/components/Friends/FriendCard';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const FindFriends = () => {
  const [activeTab, setActiveTab] = useState<'nearby' | 'all'>('nearby');
  const { toast } = useToast();

  // State to store users fetched from the backend
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch all users excluding the authenticated user
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage

        if (!token) {
          setError('Authentication token not found.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
          },
        });

        setUsers(response.data); // Set the users excluding the authenticated user
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((friend) => (
              <FriendCard
                key={friend._id}
                friend={{
                  id: friend._id,
                  name: friend.name,
                  age: friend.age,
                  distance: 'Unknown', // You can adjust this logic
                  interests: [friend.hobbies], // Adjust as needed
                  image: 'https://via.placeholder.com/150', // Use real image URL if available
                }}
                onSendFriendRequest={() => handleSendFriendRequest(friend._id, friend.name)}
                onMessageFriend={() => handleMessageFriend(friend._id, friend.name)}
              />
            ))}
          </div>
        )}

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
