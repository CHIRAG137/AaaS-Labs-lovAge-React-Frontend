
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GamesContainer from '@/components/Games/GamesContainer';

const Games = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <section className="text-center mb-8 animate-fade-in max-w-4xl mx-auto">
          <h1 className="page-title mb-4">Mental Stimulation <span className="text-primary">Games</span></h1>
          <p className="text-lg max-w-3xl mx-auto mb-8 text-muted-foreground">
            Enjoy these games designed to keep your mind active and engaged
          </p>
        </section>
        
        <GamesContainer />
      </main>
      
      <Footer />
    </div>
  );
};

export default Games;
