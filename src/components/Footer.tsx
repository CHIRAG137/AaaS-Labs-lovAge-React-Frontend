
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-8 bg-white border-t border-border">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-0">
          <div>
            <h2 className="text-xl font-display font-bold text-primary mb-4">lovAge</h2>
            <p className="text-muted-foreground">Connecting seniors through friendly conversations</p>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Video Chat</Link></li>
              <li><Link to="/find-friends" className="text-muted-foreground hover:text-primary transition-colors">Find Friends</Link></li>
              <li><Link to="/friends" className="text-muted-foreground hover:text-primary transition-colors">My Friends</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link to="/settings" className="text-muted-foreground hover:text-primary transition-colors">Settings</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help & Support</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Accessibility</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Use</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} lovAge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
