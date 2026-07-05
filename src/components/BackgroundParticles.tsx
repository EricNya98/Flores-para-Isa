import React, { useEffect, useRef } from 'react';
import { Particle } from '../types';

interface BackgroundParticlesProps {
  interactive?: boolean;
}

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxBackgroundParticles = 60;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize initial background particles
    for (let i = 0; i < maxBackgroundParticles; i++) {
      particles.push(createRandomParticle(true));
    }

    function createRandomParticle(isInitial = false): Particle {
      const size = Math.random() * 2.5 + 0.5;
      const x = Math.random() * canvas!.width;
      // If initial, distribute across height, else start from bottom
      const y = isInitial ? Math.random() * canvas!.height : canvas!.height + 20;
      
      return {
        x,
        y,
        size,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -(Math.random() * 0.6 + 0.2), // gentle upward float
        opacity: Math.random() * 0.7 + 0.1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`,
        type: Math.random() > 0.3 ? 'sparkle' : 'star',
      };
    }

    function createClickBurst(clickX: number, clickY: number) {
      // Spawn elegant petals and hearts
      const colors = [
        'rgba(255, 192, 203, 0.8)', // pink petal
        'rgba(255, 255, 255, 0.8)', // white rose petal
        'rgba(173, 216, 230, 0.8)', // baby blue hydrangea petal
        'rgba(255, 220, 220, 0.9)', // warm white
      ];

      for (let i = 0; i < 15; i++) {
        const size = Math.random() * 5 + 3;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        particles.push({
          x: clickX,
          y: clickY,
          size,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed - 1.0, // force slightly upward before falling
          opacity: 1.0,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: 'petal',
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
        });
      }
    }

    const handleCanvasClick = (e: MouseEvent) => {
      if (!interactive) return;
      createClickBurst(e.clientX, e.clientY);
    };

    window.addEventListener('click', handleCanvasClick);

    // Particle update and drawing loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update physics
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.type === 'petal') {
          // add gentle drift and gravity for petals
          p.speedY += 0.03; // gravity
          p.speedX += Math.sin(p.y * 0.02) * 0.02; // wind sway
          if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
            p.rotation += p.rotationSpeed;
          }
          p.opacity -= 0.008; // fade out petals as they fall
        } else {
          // sparkle / star breathing glow
          p.opacity += (Math.random() - 0.5) * 0.03;
          if (p.opacity < 0.1) p.opacity = 0.1;
          if (p.opacity > 0.9) p.opacity = 0.9;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.opacity;

        if (p.type === 'petal') {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation || 0);
          
          // Draw organic petal / leaf shape
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(p.size, -p.size, p.size, 0);
          ctx.quadraticCurveTo(p.size, p.size, 0, p.size);
          ctx.quadraticCurveTo(-p.size, p.size, -p.size, 0);
          ctx.quadraticCurveTo(-p.size, -p.size, 0, -p.size);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === 'star') {
          // Draw four-point star sparkle
          ctx.translate(p.x, p.y);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          for (let j = 0; j < 4; j++) {
            ctx.rotate(Math.PI / 2);
            ctx.lineTo(0, -p.size * 2.5);
            ctx.lineTo(p.size * 0.5, 0);
          }
          ctx.closePath();
          ctx.fill();

          // Gentle blur glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ffffff';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard soft circular spark
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 5;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
          ctx.fill();
        }

        ctx.restore();

        // Recycle background particles or remove dead ones
        if (p.type === 'petal') {
          if (p.y > canvas.height || p.opacity <= 0 || p.x < 0 || p.x > canvas.width) {
            particles.splice(i, 1);
          }
        } else {
          if (p.y < -10) {
            particles[i] = createRandomParticle(false);
          }
        }
      }

      // Maintain background count
      const currentBgCount = particles.filter(p => p.type !== 'petal').length;
      if (currentBgCount < maxBackgroundParticles) {
        particles.push(createRandomParticle(false));
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
