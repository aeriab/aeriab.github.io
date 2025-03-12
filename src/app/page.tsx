"use client";

import { NavigationProvider, useNavigation } from "./rotateContext";
import ThreeDScene from "../../components/ThreeDScene";
import NameCard from "./nameCard";
import ReloadButton from "./AnimatedButtons/ReloadButton";
import HomeButton from "./AnimatedButtons/HomeButton";
import ProjectButton from "./AnimatedButtons/ProjectButton";
import AboutButton from "./AnimatedButtons/AboutButton";
import BlogButton from "./AnimatedButtons/BlogButton";
import GamesButton from "./AnimatedButtons/GamesButton";
import ResumeButton from "./AnimatedButtons/ResumeButton";

import SocialMediaButtons from "./SocialButtons";

import Head from "next/head";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

function HomeContent() {
  const { currentView } = useNavigation();
  const isInProjectsView = currentView === "inProjects";
  const isInAboutView = currentView === "inAbout";
  
  const [isInArtMode, setIsInArtMode] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const mainDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    if (mainDivRef.current && isMouseDown) {
      mainDivRef.current.addEventListener('dragstart', preventDrag);
    }

    return () => {
      if (mainDivRef.current) {
        mainDivRef.current.removeEventListener('dragstart', preventDrag);
      }
    };
  }, [isMouseDown]);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div id="threeDContainer" className="absolute top-0 left-0 w-full h-full">
        <ThreeDScene />
      </div>
      <motion.div
        ref={mainDivRef}
        className="absolute top-0 left-0 w-full h-full z-10"
        animate={{
          opacity: isMouseDown ? 0.0 : 1,
          pointerEvents: isInArtMode ? "none" : "auto",
        }}
        transition={{
          opacity: { duration: 2.0, ease: "linear", delay: isMouseDown ? 0 : 1 },
        }}
        onUpdate={(latest) => {
          if (Number(latest.opacity) <= 0.2) {
            setIsInArtMode(true);
          } else {
            setIsInArtMode(false);
          }
        }}
      >
        {/* Projects View (Home) */}
        <motion.div
          className="p-[3vh] content-normal gap-[0vh] h-[99vh] grid grid-cols-3 grid-rows-3 select-none"
          animate={{ y: isInProjectsView ? 0 : "-150vh" }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <div className="big-style h-[var(--custom-top-height)] text-white lexend text-[100px] col-start-1 col-end-4 row-start-1 row-end-2"><NameCard /></div>
          <div className="big-style h-[var(--custom-middle-height)]"><ReloadButton /></div>
          <div className="big-style h-[var(--custom-middle-height)] z-11"><ProjectButton /></div>
          <div className="big-style h-[var(--custom-middle-height)]"><AboutButton /></div>
          <div className="big-style h-[var(--custom-bottom-height)]"><BlogButton /></div>
          <div className="big-style h-[var(--custom-bottom-height)]"><GamesButton /></div>
          <div className="big-style h-[var(--custom-bottom-height)]"><ResumeButton /></div>
        </motion.div>

        {/* About View */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full z-12 select-none"
          animate={{
            y: isInAboutView ? 0 : "150vh",
            opacity: isInAboutView ? (isMouseDown ? 0.05 : 1) : 0,
          }}
          transition={{
            y: { duration: 0.9, ease: "easeInOut" },
            opacity: { duration: 0.4, ease: "easeInOut" },
          }}
        >
          <div>
            <br />
            <br />
            <HomeButton />
            <br />
            <br />
            <br />
            <br />
            <SocialMediaButtons 
              github="https://github.com/aeriab"
              linkedin="https://linkedin.com/in/brendan-aeria-7494a7218/"
              instagram="https://instagram.com/brendan_aeria1622"
              twitter="https://x.com/BrendanAeria"
              youtube="https://youtube.com/@brendan3511/featured"
              className="mt-4"
            />
            <br />
            <br />
            <br />
            <h1 className="flex items-center justify-center text-xl">UNDER CONSTRUCTION</h1>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default function Home() {
  return (
    <NavigationProvider>
      <HomeContent />
    </NavigationProvider>
  );
}