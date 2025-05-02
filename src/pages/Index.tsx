
import React from 'react';
import Header from '@/components/Header';
import VideoContainer from '@/components/VideoChat/VideoContainer';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <section className="text-center mb-10 animate-fade-in max-w-4xl mx-auto">
          <h1 className="page-title mb-6">Welcome to <span className="text-primary">GoldenChat</span></h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-muted-foreground">
            A friendly place to meet and talk with others through simple video chats
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link to="/find-friends">
              <Button className="btn-primary flex items-center gap-2">
                <Users size={20} />
                Find Friends Nearby
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings size={20} />
                Settings
              </Button>
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
