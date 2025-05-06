
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FontSizeIcon } from './icons/FontSizeIcon';
import { useToast } from '@/components/ui/use-toast';
import { Link, useLocation } from 'react-router-dom';
import { Users, MessageSquare, Settings, Menu, UserPlus, LogIn, Gamepad } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const { toast } = useToast();
  const location = useLocation();
  
  // Mock authenticated state - in a real app, this would come from your auth context/provider
  // For testing purposes, change this to true/false to see the different navigation states
  const isAuthenticated = false;
  
  const increaseFontSize = () => {
    // Get the current font size
    const currentSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    // Increase by 2px
    document.documentElement.style.fontSize = `${currentSize + 2}px`;
    
    toast({
      title: "Font size increased",
      description: "The text is now larger for better readability."
    });
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="w-full px-4 md:px-6 py-3 flex items-center justify-between bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-primary">GoldenChat</h1>
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-5">
        <Link to="/" className={`text-base font-medium flex items-center gap-2 transition-colors ${isActive('/') ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
          <MessageSquare size={18} />
          Video Chat
        </Link>
        <Link to="/find-friends" className={`text-base font-medium flex items-center gap-2 transition-colors ${isActive('/find-friends') ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
          <Users size={18} />
          Find Friends
        </Link>
        <Link to="/games" className={`text-base font-medium flex items-center gap-2 transition-colors ${isActive('/games') ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
          <Gamepad size={18} />
          Games
        </Link>
        {isAuthenticated && (
          <Link to="/friends" className={`text-base font-medium flex items-center gap-2 transition-colors ${isActive('/friends') ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
            <Users size={18} />
            My Friends
          </Link>
        )}
        {isAuthenticated && (
          <Link to="/settings" className={`text-base font-medium flex items-center gap-2 transition-colors ${isActive('/settings') ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
            <Settings size={18} />
            Settings
          </Link>
        )}
        {!isAuthenticated && (
          <>
            <Link to="/login" className="ml-2">
              <Button variant="outline" className="flex items-center gap-2">
                <LogIn size={18} />
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="flex items-center gap-2">
                <UserPlus size={18} />
                Join Now
              </Button>
            </Link>
          </>
        )}
        <Button 
          variant="outline" 
          className="flex items-center gap-1 ml-3" 
          onClick={increaseFontSize}
          size="sm"
        >
          <FontSizeIcon className="w-4 h-4" />
          <span>Larger Text</span>
        </Button>
      </nav>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[350px]">
            <nav className="flex flex-col gap-6 mt-8">
              <Link to="/" className={`text-lg font-medium flex items-center gap-2 ${isActive('/') ? 'text-primary' : 'hover:text-primary'}`}>
                <MessageSquare size={20} />
                Video Chat
              </Link>
              <Link to="/find-friends" className={`text-lg font-medium flex items-center gap-2 ${isActive('/find-friends') ? 'text-primary' : 'hover:text-primary'}`}>
                <Users size={20} />
                Find Friends
              </Link>
              <Link to="/games" className={`text-lg font-medium flex items-center gap-2 ${isActive('/games') ? 'text-primary' : 'hover:text-primary'}`}>
                <Gamepad size={20} />
                Games
              </Link>
              {isAuthenticated && (
                <Link to="/friends" className={`text-lg font-medium flex items-center gap-2 ${isActive('/friends') ? 'text-primary' : 'hover:text-primary'}`}>
                  <Users size={20} />
                  My Friends
                </Link>
              )}
              {isAuthenticated && (
                <Link to="/settings" className={`text-lg font-medium flex items-center gap-2 ${isActive('/settings') ? 'text-primary' : 'hover:text-primary'}`}>
                  <Settings size={20} />
                  Settings
                </Link>
              )}
              {!isAuthenticated && (
                <>
                  <Link to="/login" className={`text-lg font-medium flex items-center gap-2 ${isActive('/login') ? 'text-primary' : 'hover:text-primary'}`}>
                    <LogIn size={20} />
                    Log In
                  </Link>
                  <Link to="/register" className="mt-2">
                    <Button className="flex items-center justify-center gap-2 w-full">
                      <UserPlus size={20} />
                      Join Now
                    </Button>
                  </Link>
                </>
              )}
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 w-full mt-4" 
                onClick={increaseFontSize}
              >
                <FontSizeIcon className="w-5 h-5" />
                <span>Larger Text</span>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
