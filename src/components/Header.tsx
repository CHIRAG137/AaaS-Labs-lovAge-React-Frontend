
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FontSizeIcon } from './icons/FontSizeIcon';
import { useToast } from '@/components/ui/use-toast';
import { Link, useLocation } from 'react-router-dom';
import { Users, MessageSquare, Settings, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const { toast } = useToast();
  const location = useLocation();
  
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
        <Link to="/friends" className={`text-base font-medium flex items-center gap-2 transition-colors ${isActive('/friends') ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
          <Users size={18} />
          My Friends
        </Link>
        <Link to="/settings" className={`text-base font-medium flex items-center gap-2 transition-colors ${isActive('/settings') ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
          <Settings size={18} />
          Settings
        </Link>
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
              <Link to="/friends" className={`text-lg font-medium flex items-center gap-2 ${isActive('/friends') ? 'text-primary' : 'hover:text-primary'}`}>
                <Users size={20} />
                My Friends
              </Link>
              <Link to="/settings" className={`text-lg font-medium flex items-center gap-2 ${isActive('/settings') ? 'text-primary' : 'hover:text-primary'}`}>
                <Settings size={20} />
                Settings
              </Link>
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
