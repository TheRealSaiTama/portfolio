"use client";

import React, { useRef, useEffect, useState } from "react";
import { useMousePosition } from "@/utils/mouse";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
}

export default function Particles({
  className = "",
  quantity = 50,
  staticity = 50,
  ease = 50,
  refresh = false,
}: ParticlesProps) {
  const pathname = usePathname();
  const isBlogPost = pathname.startsWith("/blogs/") && pathname !== "/blogs";
  const { theme } = useTheme();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  // Neural network colors
  const colors = {
    dark: {
      primary: { r: 0, g: 212, b: 255 },    // Electric cyan
      secondary: { r: 147, g: 51, b: 234 },  // Purple
      tertiary: { r: 57, g: 255, b: 20 },    // Neon green
    },
    light: {
      primary: { r: 0, g: 170, b: 214 },
      secondary: { r: 124, g: 58, b: 237 },
      tertiary: { r: 34, g: 197, b: 94 },
    }
  };

  const connectionDistance = 150;

  useEffect(() => {
    if (isBlogPost) return;
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [isBlogPost]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  type Circle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
    colorType: 'primary' | 'secondary' | 'tertiary';
    pulsePhase: number;
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const size = Math.floor(Math.random() * 3) + 1;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.7 + 0.2).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.3;
    const dy = (Math.random() - 0.5) * 0.3;
    const magnetism = 0.1 + Math.random() * 4;
    const colorType = ['primary', 'secondary', 'tertiary'][Math.floor(Math.random() * 3)] as Circle['colorType'];
    const pulsePhase = Math.random() * Math.PI * 2;
    return {
      x,
      y,
      translateX,
      translateY,
      size,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
      colorType,
      pulsePhase,
    };
  };

  const getColor = (colorType: Circle['colorType']) => {
    const palette = theme === 'dark' ? colors.dark : colors.light;
    return palette[colorType];
  };

  const drawConnections = () => {
    if (!context.current) return;
    
    for (let i = 0; i < circles.current.length; i++) {
      for (let j = i + 1; j < circles.current.length; j++) {
        const c1 = circles.current[i];
        const c2 = circles.current[j];
        
        const x1 = c1.x + c1.translateX;
        const y1 = c1.y + c1.translateY;
        const x2 = c2.x + c2.translateX;
        const y2 = c2.y + c2.translateY;
        
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        
        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.4 * Math.min(c1.alpha, c2.alpha);
          const color1 = getColor(c1.colorType);
          const color2 = getColor(c2.colorType);
          
          // Create gradient line
          const gradient = context.current.createLinearGradient(x1, y1, x2, y2);
          gradient.addColorStop(0, `rgba(${color1.r}, ${color1.g}, ${color1.b}, ${opacity})`);
          gradient.addColorStop(1, `rgba(${color2.r}, ${color2.g}, ${color2.b}, ${opacity})`);
          
          context.current.beginPath();
          context.current.strokeStyle = gradient;
          context.current.lineWidth = 0.5;
          context.current.moveTo(x1, y1);
          context.current.lineTo(x2, y2);
          context.current.stroke();
        }
      }
    }
  };

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha, colorType, pulsePhase } = circle;
      const color = getColor(colorType);
      
      // Pulsing glow effect
      const pulseAmount = Math.sin(Date.now() * 0.003 + pulsePhase) * 0.3 + 0.7;
      const glowSize = size * (1.5 + pulseAmount * 0.5);
      
      context.current.translate(translateX, translateY);
      
      // Outer glow
      const gradient = context.current.createRadialGradient(x, y, 0, x, y, glowSize * 3);
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.5})`);
      gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.2})`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
      
      context.current.beginPath();
      context.current.arc(x, y, glowSize * 3, 0, 2 * Math.PI);
      context.current.fillStyle = gradient;
      context.current.fill();
      
      // Core particle
      context.current.beginPath();
      context.current.arc(x, y, size * pulseAmount, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
      context.current.fill();
      
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    
    // Draw connections first (behind particles)
    drawConnections();
    
    circles.current.forEach((circle: Circle, i: number) => {
      // Handle the alpha value
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx;
      circle.y += circle.dy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;
      
      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle);
      } else {
        drawCircle(
          {
            ...circle,
            x: circle.x,
            y: circle.y,
            translateX: circle.translateX,
            translateY: circle.translateY,
            alpha: circle.alpha,
          },
          true
        );
      }
    });
    window.requestAnimationFrame(animate);
  };

  if (isBlogPost) return null;

  return (
    <div
      className={cn(className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
