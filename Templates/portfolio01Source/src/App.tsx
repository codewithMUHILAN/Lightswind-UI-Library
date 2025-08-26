// App.jsx
import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import { HeroSection } from "./components/HeroSection/HeroSection";
import StripedBackground from "./components/lightswind/StripedBackground";
import { AboutSection } from "./components/AboutSection/AboutSection";
import { ProjectsSection } from "./components/ProjectsSection/ProjectsSection";
import { EducationSection } from "./components/EducationSection/EducationSection";
import { CareerTimeline } from "./components/CareerSection/CareerTimeline";
import ReactLenis from "lenis/react";
import Dock from "./components/lightswind/dock";
import {
  Home,
  User,
  GraduationCap,
  Briefcase,
  FolderKanban,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [showDock, setShowDock] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // scrolling down -> show Dock
        setShowDock(true);
      } else {
        // scrolling up -> hide Dock
        setShowDock(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Helper for smooth scroll
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Dock items
  const dockItems = [
    {
      icon: <Home size={24} />,
      label: "Home",
      onClick: () => scrollToSection("home"),
    },
    {
      icon: <User size={24} />,
      label: "About",
      onClick: () => scrollToSection("about"),
    },
    {
      icon: <GraduationCap size={24} />,
      label: "Education",
      onClick: () => scrollToSection("education"),
    },
    {
      icon: <Briefcase size={24} />,
      label: "Career",
      onClick: () => scrollToSection("career"),
    },
    {
      icon: <FolderKanban size={24} />,
      label: "Projects",
      onClick: () => scrollToSection("projects"),
    },
  ];

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <StripedBackground className={"fixed z-0 blur-xs"} />

      <ReactLenis root>
        <Header />

        <div
          className="w-full bg-transparent max-w-5xl px-4 my-30
          flex items-center justify-center 
          lg:rounded-3xl backdrop-blur-xl border-gray-100 dark:border-gray-900"
        >
          <div className="z-10">
            {/* Give IDs to sections */}
            <div id="home">
              <HeroSection />
            </div>
            <div id="about">
              <AboutSection />
            </div>
            <div id="education">
              <EducationSection />
            </div>
            <div id="career">
              <CareerTimeline />
            </div>
            <div id="projects">
              <ProjectsSection />
            </div>
          </div>
        </div>

        {/* Dock with smooth show/hide animation */}
        <AnimatePresence>
          {showDock && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999]"
            >
              <Dock
                items={dockItems}
                position="bottom"
                magnification={70}
                baseItemSize={50}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ReactLenis>

      {/* <SmoothCursor /> */}
    </div>
  );
}

export default App;
