"use client";

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkle: number;
}

interface StarfieldProps {
  density?: number;
  speed?: number;
  twinkleSpeed?: number;
  className?: string;
}

export default function Starfield({ 
  density = 0.5, 
  speed = 0.5, 
  twinkleSpeed = 0.02,
  className = ""
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      const stars: Star[] = [];
      const numStars = Math.floor((canvas.width * canvas.height * density) / 10000);
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * speed + 0.1,
          opacity: Math.random() * 0.8 + 0.2,
          twinkle: Math.random() * Math.PI * 2
        });
      }
      
      starsRef.current = stars;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      starsRef.current.forEach((star, index) => {
        // Update star position
        star.y += star.speed;
        star.twinkle += twinkleSpeed;
        
        // Reset star position if it goes off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        
        // Calculate twinkling opacity
        const twinkleOpacity = (Math.sin(star.twinkle) + 1) / 2;
        const finalOpacity = star.opacity * (0.3 + twinkleOpacity * 0.7);
        
        // Draw star
        ctx.save();
        ctx.globalAlpha = finalOpacity;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = star.size * 2;
        ctx.shadowColor = '#60A5FA';
        
        // Draw star with different shapes based on size
        if (star.size > 1.5) {
          // Larger stars - draw a cross shape
          ctx.fillRect(star.x - star.size/2, star.y - star.size/6, star.size, star.size/3);
          ctx.fillRect(star.x - star.size/6, star.y - star.size/2, star.size/3, star.size);
        } else {
          // Smaller stars - draw a circle
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createStars();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createStars();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [density, speed, twinkleSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}
