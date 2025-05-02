
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 py-6 bg-white border-t border-border">
      <div className="container max-w-6xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">GoldenChat</h2>
          <p className="text-lg mb-6">Connecting seniors through friendly conversations</p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link to="/" className="text-lg hover:text-primary hover:underline">Video Chat</Link>
            <Link to="/find-friends" className="text-lg hover:text-primary hover:underline">Find Friends</Link>
            <Link to="/friends" className="text-lg hover:text-primary hover:underline">My Friends</Link>
            <a href="#" className="text-lg hover:text-primary hover:underline">About Us</a>
            <a href="#" className="text-lg hover:text-primary hover:underline">Help & Support</a>
            <a href="#" className="text-lg hover:text-primary hover:underline">Privacy Policy</a>
            <a href="#" className="text-lg hover:text-primary hover:underline">Terms of Use</a>
            <a href="#" className="text-lg hover:text-primary hover:underline">Contact</a>
          </div>
          
          <p className="text-muted-foreground">© 2025 GoldenChat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
