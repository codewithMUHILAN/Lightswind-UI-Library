"use client";

import React, { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export type NeuralInteraction = "router" | "pulse" | "gravity" | "none";

interface NeuralLinkProps {
  nodeColor?: string;      // Base node color (Hex or CSS)
  lineColor?: string;      // Base connection line color (Hex or CSS)
  packetColor?: string;    // Base packet color (Hex or CSS)
  nodeCount?: number;      // Number of floating nodes
  maxDistance?: number;    // Distance threshold to connect nodes
  interactionMode?: NeuralInteraction;
  interactive?: boolean;
  packetFrequency?: number; // Automatic packet spawn interval in ms (0 to disable)
  className?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseSpeed: number;
  pulseScale: number;
}

interface Packet {
  id: number;
  x: number;
  y: number;
  path: number[];
  pathIndex: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
}

const NeuralLinkBackground: React.FC<NeuralLinkProps> = ({
  nodeColor = "#a855f7", // default violet
  lineColor = "#cbd5e1", // slate-300
  packetColor = "#00f0ff", // cyan
  nodeCount = 100,
  maxDistance = 110,
  interactionMode = "router",
  interactive = true,
  packetFrequency = 2000,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isDarkModeRef = useRef(true);

  // Mouse tracking state
  const mouseRef = useRef({
    x: 0,
    y: 0,
    active: false,
    radius: 180,
    lastInjectedX: 0,
    lastInjectedY: 0,
  });

  // Monitor theme changes
  useEffect(() => {
    const checkTheme = () => {
      isDarkModeRef.current = document.documentElement.classList.contains("dark");
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let lastTime = performance.now();
    let packetIdCounter = 0;
    let autoSpawnTimer = 0;

    const createNode = (width: number, height: number): Node => {
      const angle = Math.random() * Math.PI * 2;
      const baseSpeed = 0.2 + Math.random() * 0.4;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed,
        radius: 1.5 + Math.random() * 2.5,
        baseSpeed,
        pulseScale: 1.0,
      };
    };

    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || window.innerWidth;
      const height = rect?.height || window.innerHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;

        // Initialize nodes
        nodes = [];
        for (let i = 0; i < nodeCount; i++) {
          nodes.push(createNode(width, height));
        }
        packets = [];
      }
    };

    resizeCanvas();

    // Helper: Find neighbors of a node
    const getNeighbors = (nodeIdx: number): number[] => {
      const neighbors: number[] = [];
      const n1 = nodes[nodeIdx];
      if (!n1) return neighbors;

      for (let i = 0; i < nodes.length; i++) {
        if (i === nodeIdx) continue;
        const n2 = nodes[i];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDistance) {
          neighbors.push(i);
        }
      }
      return neighbors;
    };

    // Helper: Spawn a path-hopping packet
    const spawnPacket = (startIdx: number, fromCursor = false) => {
      if (nodes.length === 0) return;
      
      // Build a random connected neighbor path
      const path: number[] = [startIdx];
      let currentIdx = startIdx;
      const maxHops = 4 + Math.floor(Math.random() * 3); // 4-6 hops

      for (let hop = 0; hop < maxHops; hop++) {
        const neighbors = getNeighbors(currentIdx).filter(n => !path.includes(n));
        if (neighbors.length === 0) break;
        // Pick random connected neighbor
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        path.push(next);
        currentIdx = next;
      }

      if (path.length > 1) {
        const speed = 0.04 + Math.random() * 0.03; // travel progress step per frame
        const size = 2.0 + Math.random() * 2.0;
        
        // If starting from cursor, animate it originating from mouse coordinates
        const mouse = mouseRef.current;
        const startX = fromCursor ? mouse.x : nodes[startIdx].x;
        const startY = fromCursor ? mouse.y : nodes[startIdx].y;

        packets.push({
          id: packetIdCounter++,
          x: startX,
          y: startY,
          path,
          pathIndex: 0,
          progress: 0.0,
          speed,
          size,
          color: packetColor,
        });

        // Trigger visual pulse on starting node
        nodes[startIdx].pulseScale = 2.5;
      }
    };

    // Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouse = mouseRef.current;
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      // In Router mode, inject packets on cursor movement
      if (interactionMode === "router" && nodes.length > 0) {
        const dx = mouse.x - mouse.lastInjectedX;
        const dy = mouse.y - mouse.lastInjectedY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 35) { // throttle spawn density
          // Find closest node to inject packet into
          let closestIdx = 0;
          let minDist = Infinity;
          for (let i = 0; i < nodes.length; i++) {
            const ndx = nodes[i].x - mouse.x;
            const ndy = nodes[i].y - mouse.y;
            const d = Math.sqrt(ndx * ndx + ndy * ndy);
            if (d < minDist) {
              minDist = d;
              closestIdx = i;
            }
          }

          if (minDist < mouse.radius) {
            spawnPacket(closestIdx, true);
            mouse.lastInjectedX = mouse.x;
            mouse.lastInjectedY = mouse.y;
          }
        }
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleClick = () => {
      if (!interactive || nodes.length === 0) return;
      const mouse = mouseRef.current;
      if (!mouse.active) return;

      // Pulse Mode: Surge multiple packets outward from closest nodes
      if (interactionMode === "pulse" || interactionMode === "router") {
        // Find top 4 closest nodes to the click coordinates
        const nodeDists = nodes.map((n, idx) => {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          return { idx, dist: Math.sqrt(dx * dx + dy * dy) };
        });

        nodeDists.sort((a, b) => a.dist - b.dist);
        const count = Math.min(4, nodeDists.length);
        for (let i = 0; i < count; i++) {
          if (nodeDists[i].dist < mouse.radius * 1.5) {
            spawnPacket(nodeDists[i].idx, true);
          }
        }
      }
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
      canvas.addEventListener("click", handleClick);
    }

    const render = () => {
      if (!isInView) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;

      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;

      const isDark = isDarkModeRef.current;

      // Theme-adaptive styling overrides
      const currentBgFill = isDark ? "rgba(0, 0, 0, 1.0)" : "rgba(255, 255, 255, 1.0)";
      
      // Node and synapse line styling adjustments
      const finalNodeColor = isDark ? nodeColor : "#4f46e5"; // indigo in light mode
      const finalLineStyle = isDark ? "255, 255, 255" : "79, 70, 229"; // white vs indigo
      const finalPacketColor = isDark ? packetColor : "#0d9488"; // deep teal in light mode

      // Clear transparently
      ctx.clearRect(0, 0, width, height);

      // Handle auto-spawning packets
      if (packetFrequency > 0) {
        autoSpawnTimer += dt;
        if (autoSpawnTimer >= packetFrequency) {
          autoSpawnTimer = 0;
          if (nodes.length > 0) {
            // Spawn packet at a random node
            const startIdx = Math.floor(Math.random() * nodes.length);
            spawnPacket(startIdx, false);
          }
        }
      }

      const mouse = mouseRef.current;

      // 1. Move and update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Gravitational drag interaction
        if (interactive && mouse.active && interactionMode === "gravity") {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const pull = (1.0 - dist / mouse.radius) * 0.15;
            n.vx += (dx / dist) * pull;
            n.vy += (dy / dist) * pull;
          }
        }

        // Apply friction & boundary wrap
        n.x += n.vx;
        n.y += n.vy;

        // Apply friction to velocities so they settle back to base speed
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > n.baseSpeed) {
          n.vx *= 0.95;
          n.vy *= 0.95;
        }

        if (n.x < 0) n.x = width;
        else if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        else if (n.y > height) n.y = 0;

        // Decay visual scale animations
        if (n.pulseScale > 1.0) {
          n.pulseScale -= 0.05;
        } else {
          n.pulseScale = 1.0;
        }
      }

      // 2. Draw connections (synapse lines)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1.0 - dist / maxDistance) * (isDark ? 0.14 : 0.08);
            ctx.strokeStyle = `rgba(${finalLineStyle}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        // Connection from cursor to nearby nodes
        if (interactive && mouse.active) {
          const dx = mouse.x - n1.x;
          const dy = mouse.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = (1.0 - dist / mouse.radius) * (isDark ? 0.22 : 0.14);
            ctx.strokeStyle = `rgba(${finalLineStyle}, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n1.x, n1.y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.fillStyle = finalNodeColor;

        // Render nodes with scale animation when data travels through
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * n.pulseScale, 0, Math.PI * 2);
        ctx.fill();

        // Extra outer halo for pulsing active nodes
        if (n.pulseScale > 1.1) {
          ctx.strokeStyle = finalNodeColor;
          ctx.lineWidth = 1.0;
          ctx.globalAlpha = (n.pulseScale - 1.0) / 1.5;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * n.pulseScale * 1.8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }

      // 4. Update and draw packets (hopping signals)
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        // If segment completed, hop to next
        if (p.progress >= 1.0) {
          p.progress = 0.0;
          p.pathIndex++;

          // If reached final node, terminate packet
          if (p.pathIndex >= p.path.length - 1) {
            packets.splice(i, 1);
            continue;
          }

          // Trigger pulse on the current hop node
          const reachedNodeIdx = p.path[p.pathIndex];
          if (nodes[reachedNodeIdx]) {
            nodes[reachedNodeIdx].pulseScale = 2.0;
          }
        }

        // Interpolate coordinates along the segment line
        const nodeA = nodes[p.path[p.pathIndex]];
        const nodeB = nodes[p.path[p.pathIndex + 1]];

        if (!nodeA || !nodeB) {
          packets.splice(i, 1);
          continue;
        }

        p.x = nodeA.x + (nodeB.x - nodeA.x) * p.progress;
        p.y = nodeA.y + (nodeB.y - nodeA.y) * p.progress;

        // Draw packet glowing dot
        ctx.shadowBlur = 8;
        ctx.shadowColor = finalPacketColor;
        ctx.fillStyle = finalPacketColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadows
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
        canvas.removeEventListener("click", handleClick);
      }
    };
  }, [nodeColor, lineColor, packetColor, nodeCount, maxDistance, interactionMode, interactive, packetFrequency, isInView]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{ pointerEvents: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          display: "block",
          pointerEvents: "auto",
        }}
      />
    </div>
  );
};

export default NeuralLinkBackground;
