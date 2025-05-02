
import React from 'react';
import Header from '@/components/Header';
import VideoContainer from '@/components/VideoChat/VideoContainer';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <section className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">Welcome to <span className="text-primary">GoldenChat</span></h1>
          <p className="text-2xl max-w-3xl mx-auto">
            A friendly place to meet and talk with others through simple video chats
          </p>
        </section>
        
        <VideoContainer />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
