"use client";

import { useState } from "react";
import { DragOrderList } from "../lightswind/DragOrderList";
import { motion } from "framer-motion";

export const ProjectsSection = () => {
  const [projects] = useState([
    {
      id: 1,
      title: "AI-Powered Design Automation Platform",
      subtitle:
        "Developed an AI-driven platform that automates design workflows for global e-commerce brands...",
      date: "2024",
      link: "https://example.com/ai-platform",
      image:
        "https://images.pexels.com/photos/8294591/pexels-photo-8294591.jpeg",
    },
    {
      id: 2,
      title: "Enterprise Resource Planning (ERP) System",
      subtitle:
        "Led the development of a modular ERP system for a manufacturing conglomerate...",
      date: "2023",
      link: "https://example.com/erp",
      image:
        "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg",
    },
    {
      id: 3,
      title: "Blockchain-Based Supply Chain Tracker",
      subtitle:
        "Created a transparent and tamper-proof supply chain tracking system using Hyperledger Fabric...",
      date: "2022",
      link: "https://example.com/supplychain",
      image:
        "https://images.pexels.com/photos/6169673/pexels-photo-6169673.jpeg",
    },
    {
      id: 4,
      title: "Global E-Learning Platform",
      subtitle:
        "Designed and implemented a multi-language e-learning platform serving over 1.2 million students...",
      date: "2021",
      link: "https://example.com/elearning",
      image:
        "https://images.pexels.com/photos/15595050/pexels-photo-15595050.jpeg",
    },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ when: "beforeChildren", staggerChildren: 0.1 }}
    >
      <section className="max-w-7xl mx-auto px-6 py-12">
        <motion.h2
          className="text-3xl font-bold text-foreground mb-8 text-center"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Projects
        </motion.h2>
        <DragOrderList items={projects} />
      </section>
    </motion.div>
  );
};
