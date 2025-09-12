"use client";

import { useEffect, useRef, useState } from 'react';
import { 
  Code, 
  Zap, 
  Star, 
  Heart, 
  Sparkles, 
  Rocket,
  Shield,
  Target,
  Lightbulb,
  Cpu
} from 'lucide-react';

interface FloatingElement {
  id: number;
  icon: React.ComponentType<any>;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
}

export function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const icons = [Code, Zap, Star, Heart, Sparkles, Rocket, Shield, Target, Lightbulb, Cpu];

  useEffect(() => {
    const generateElements = () => {
      const newElements: FloatingElement[] = [];
      const container = containerRef.current;
      
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const numElements = 15;

      for (let i = 0; i < numElements; i++) {
        newElements.push({
          id: i,
          icon: icons[Math.floor(Math.random() * icons.length)],
          x: Math.random() * (containerRect.width - 40),
          y: Math.random() * (containerRect.height - 40),
          delay: Math.random() * 5,
          duration: 3 + Math.random() * 4,
          size: 16 + Math.random() * 8,
        });
      }

      setElements(newElements);
    };

    generateElements();
    
    const handleResize = () => generateElements();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {elements.map((element) => {
        const IconComponent = element.icon;
        return (
          <div
            key={element.id}
            className="absolute text-primary/20 animate-float"
            style={{
              left: `${element.x}px`,
              top: `${element.y}px`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          >
            <IconComponent 
              size={element.size} 
              className="animate-pulse"
              style={{
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
