import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const API_URL = 'http://localhost:5000/api';

interface Friend {
  id: string;
  name: string;
  age: number;
  distance: string;
  interests: string[];
  image: string;
  requestStatus: string;
}

interface FriendCardProps {
  friend: Friend;
  onMessageFriend: () => void;
}

const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  onMessageFriend
}) => {
  const [requestStatus, setRequestStatus] = useState(friend.requestStatus);

  const handleSendFriendRequest = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to send friend requests.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(
        `${API_URL}/friends/send-request/${friend.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Friend request sent!",
        description: `Request sent to ${friend.name}.`,
      });

      // 🔴 Update local state
      setRequestStatus('sent');

    } catch (err: any) {
      toast({
        title: "Failed to send request",
        description: err.response?.data?.error || "Try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="card-elderly overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-60">
        <img
          src={friend.image}
          alt={`${friend.name}'s profile`}
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="p-6">
        <h3 className="text-2xl font-semibold mb-1">{friend.name}, {friend.age}</h3>
        <p className="text-muted-foreground mb-3">{friend.distance}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {friend.interests.map(interest => (
            <Badge key={interest} variant="secondary" className="text-base py-1 px-3">
              {interest}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 justify-between">
          <Button
            onClick={handleSendFriendRequest}
            variant={requestStatus === 'sent' ? 'destructive' : 'secondary'}
            disabled={requestStatus === 'sent'}
            className="flex-1 gap-2"
          >
            <Heart size={20} />
            {requestStatus === 'sent' ? 'Request Sent' : 'Add Friend'}
          </Button>

          <Button
            onClick={onMessageFriend}
            variant="outline"
            className="flex-1 gap-2"
          >
            <MessageSquare size={20} />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendCard;
