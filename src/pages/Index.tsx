
import React from 'react';
import Header from '@/components/Header';
import VideoContainer from '@/components/VideoChat/VideoContainer';
import Footer from '@/components/Footer';
import MoodCheckIn from '@/components/MoodCheckIn/MoodCheckIn';
import GamesContainer from '@/components/Games/GamesContainer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <section className="text-center mb-8 animate-fade-in max-w-4xl mx-auto">
          <h1 className="page-title mb-4">Welcome to <span className="text-primary">GoldenChat</span></h1>
          <p className="text-lg max-w-3xl mx-auto mb-8 text-muted-foreground">
            A friendly place to meet and talk with others through simple video chats
          </p>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-display font-semibold text-center mb-6">Daily Mood Check-in</h2>
            <MoodCheckIn />
          </div>
          
          <div>
            <VideoContainer />
          </div>
        </div>
        
        <GamesContainer />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
