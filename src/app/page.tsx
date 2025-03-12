"use client";

import { RotationProvider, useRotation } from "./rotateContext";
import ThreeDScene from "../../components/ThreeDScene";
import NameCard from "./nameCard";
import ReloadButton from "./ReloadButton";
import ProjectButton from "./ProjectButton";
import AboutButton from "./AboutButton";
import BlogButton from "./BlogButton";
import GamesButton from "./GamesButton";
import ResumeButton from "./ResumeButton";
import Head from "next/head";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function HomeContent() {
  const { rotate } = useRotation(); // Get state from RotationProvider
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Add mouse event handlers
  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

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
        className="absolute top-0 left-0 w-full h-full z-10"
        animate={{ 
          opacity: isMouseDown ? 0.0 : 1
        }}
        transition={{ 
          opacity: { duration: 3.14, ease: "linear" }
        }}
      >
        <motion.div
          className="p-[3vh] content-normal gap-[0vh] h-[99vh] grid grid-cols-3 grid-rows-3"
          animate={{ y: rotate ? "-150vh" : 0 }} // Slide elements when rotate is true
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

        <motion.div
          className="absolute top-10 left-10 z-20"
          animate={{ 
            y: rotate ? 0 : "150vh", 
            opacity: rotate ? (isMouseDown ? 0.05 : 1) : 0 
          }}
          transition={{ 
            y: { duration: 0.9, ease: "easeInOut" },
            opacity: { duration: 0.4, ease: "easeInOut" }
          }}
        >
          <ReloadButton />
          <h1>UNDER CONSTRUCTION</h1>
        </motion.div>
      </motion.div>
    </>
  );
}

export default function Home() {
  return (
    <RotationProvider>
      <HomeContent />
    </RotationProvider>
  );
}