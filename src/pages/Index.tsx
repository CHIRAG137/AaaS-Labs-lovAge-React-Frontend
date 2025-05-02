
import React from 'react';
import Header from '@/components/Header';
import VideoContainer from '@/components/VideoChat/VideoContainer';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Users, MapPin } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <section className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">Welcome to <span className="text-primary">GoldenChat</span></h1>
          <p className="text-2xl max-w-3xl mx-auto mb-6">
            A friendly place to meet and talk with others through simple video chats
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Link to="/find-friends" className="flex items-center gap-2 text-xl font-medium px-6 py-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors">
              <MapPin size={24} />
              Find Friends Nearby
            </Link>
            <Link to="/friends" className="flex items-center gap-2 text-xl font-medium px-6 py-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors">
              <Users size={24} />
              My Friends
            </Link>
          </div>
        </section>
        
        <VideoContainer />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
