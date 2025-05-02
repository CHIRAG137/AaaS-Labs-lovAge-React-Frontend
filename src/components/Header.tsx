
import React from 'react';
import { Button } from '@/components/ui/button';
import { FontSizeIcon } from './icons/FontSizeIcon';
import { useToast } from '@/components/ui/use-toast';

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
        <h1 className="text-3xl font-bold text-primary">GoldenChat</h1>
      </div>
      
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
