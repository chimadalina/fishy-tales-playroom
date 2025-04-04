
import React from 'react';
import { Fish } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Fish className="w-8 h-8 text-redFish animate-float" />
      <span className="text-3xl font-bubblegum gradient-text bg-gradient-to-r from-redFish to-blueFish bg-clip-text text-transparent">
        Red Herring
      </span>
      <Fish className="w-8 h-8 text-blueFish animate-float" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default Logo;
