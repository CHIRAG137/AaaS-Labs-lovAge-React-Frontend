
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Settings as SettingsIcon, Save, RefreshCcw } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [fontSize, setFontSize] = useState<number>(16);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [simplifiedUI, setSimplifiedUI] = useState<boolean>(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('goldenchat-font-size');
    const savedHighContrast = localStorage.getItem('goldenchat-high-contrast');
    const savedSimplifiedUI = localStorage.getItem('goldenchat-simplified-ui');
    
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedHighContrast) setHighContrast(savedHighContrast === 'true');
    if (savedSimplifiedUI) setSimplifiedUI(savedSimplifiedUI === 'true');
  }, []);

  // Apply font size to HTML root element
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // Apply high contrast mode
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Apply simplified UI
  useEffect(() => {
    if (simplifiedUI) {
      document.documentElement.classList.add('simplified-ui');
    } else {
      document.documentElement.classList.remove('simplified-ui');
    }
  }, [simplifiedUI]);

  const saveSettings = () => {
    localStorage.setItem('goldenchat-font-size', fontSize.toString());
    localStorage.setItem('goldenchat-high-contrast', highContrast.toString());
    localStorage.setItem('goldenchat-simplified-ui', simplifiedUI.toString());
    
    toast({
      title: "Settings saved",
      description: "Your accessibility preferences have been saved."
    });
  };

  const resetSettings = () => {
    setFontSize(16);
    setHighContrast(false);
    setSimplifiedUI(false);
    
    localStorage.removeItem('goldenchat-font-size');
    localStorage.removeItem('goldenchat-high-contrast');
    localStorage.removeItem('goldenchat-simplified-ui');
    
    document.documentElement.style.fontSize = '16px';
    document.documentElement.classList.remove('high-contrast');
    document.documentElement.classList.remove('simplified-ui');
    
    toast({
      title: "Settings reset",
      description: "All settings have been restored to defaults."
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon size={32} className="text-primary" />
            <h1 className="text-4xl font-display font-bold">Settings</h1>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8">
            Customize lovAge to make it more comfortable for your needs.
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Text Size</CardTitle>
              <CardDescription>Adjust the size of text throughout the website</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Smaller</span>
                  <span className="text-sm">Larger</span>
                </div>
                <Slider
                  value={[fontSize]}
                  min={12}
                  max={24}
                  step={1}
                  onValueChange={(values) => setFontSize(values[0])}
                  className="py-4"
                />
                <div className="flex justify-between">
                  <span className="text-xs">12px</span>
                  <span>Current: {fontSize}px</span>
                  <span className="text-xs">24px</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-6">
                <p className="text-base font-medium mb-1">Preview:</p>
                <p style={{ fontSize: `${fontSize}px` }} className="border p-3 rounded-md bg-muted/30">
                  This is how your text will appear across the website.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Visual Settings</CardTitle>
              <CardDescription>Change how lovAge looks to improve readability</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast" className="text-base">High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">Increases contrast for better visibility</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="simplified-ui" className="text-base">Simplified Interface</Label>
                  <p className="text-sm text-muted-foreground">Reduces animations and simplifies the design</p>
                </div>
                <Switch
                  id="simplified-ui"
                  checked={simplifiedUI}
                  onCheckedChange={setSimplifiedUI}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="gap-2"
            >
              <RefreshCcw size={18} />
              Reset to Default
            </Button>
            
            <Button
              onClick={saveSettings}
              className="gap-2"
            >
              <Save size={18} />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
