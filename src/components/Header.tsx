
import React from 'react';
import { Button } from '@/components/ui/button';
import { FontSizeIcon } from './icons/FontSizeIcon';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Heart, MapPin } from 'lucide-react';

const Header: React.FC = () => {
  const { toast } = useToast();
  
  const increaseFontSize = () => {
    document.documentElement.style.fontSize = 'larger';
    toast({
      title: "Font size increased",
      description: "The text is now larger for better readability."
    });
  };
  
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <Link to="/">
          <h1 className="text-3xl font-bold text-primary">GoldenChat</h1>
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-xl font-medium hover:text-primary flex items-center gap-2">
          <MessageSquare size={20} />
          Video Chat
        </Link>
        <Link to="/find-friends" className="text-xl font-medium hover:text-primary flex items-center gap-2">
          <MapPin size={20} />
          Find Friends
        </Link>
        <Link to="/friends" className="text-xl font-medium hover:text-primary flex items-center gap-2">
          <Users size={20} />
          My Friends
        </Link>
      </nav>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2 text-lg" 
        onClick={increaseFontSize}
      >
        <FontSizeIcon className="w-6 h-6" />
        <span>Larger Text</span>
      </Button>
    </header>
  );
};

export default Header;
