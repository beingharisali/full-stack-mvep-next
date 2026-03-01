"use client";

import { useEffect, useRef } from "react";

const ParticlesBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particleCount = 50;
    const particles: HTMLDivElement[] = [];

    container.innerHTML = "";

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      const size = Math.random() * 6 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      particle.style.left = `${Math.random() * 100}%`;

      const duration = Math.random() * 15 + 15;
      particle.style.animationDuration = `${duration}s`;

      particle.style.animationDelay = `${Math.random() * 10}s`;

      particle.style.opacity = `${Math.random() * 0.3 + 0.1}`;

      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach((particle) => {
        if (particle.parentNode) {
          particle.remove();
        }
      });
    };
  }, []);

  return <div id="particles-container" ref={containerRef} className="responsive-particles" />;
};

export default ParticlesBackground;
