
import React, { useEffect, useState } from 'react';

type Bubble = {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
};

const BubbleBackground: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate random bubbles
    const newBubbles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 50 + 10, // Random size between 10px and 60px
      left: Math.random() * 100, // Random horizontal position
      delay: Math.random() * 15, // Random delay for animation start
      duration: Math.random() * 10 + 10, // Random duration between 10s and 20s
    }));
    
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble absolute rounded-full bg-white/20"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            bottom: `-${bubble.size}px`,
            animation: `bubble-rise ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default BubbleBackground;
