"use client";

import { RotationProvider, useRotation } from "./rotateContext";
import ThreeDScene from "../../components/ThreeDScene";
import NameCard from "./nameCard";
import ReloadButton from "./ReloadButton";
import HomeButton from "./HomeButton";
import ProjectButton from "./ProjectButton";
import AboutButton from "./AboutButton";
import BlogButton from "./BlogButton";
import GamesButton from "./GamesButton";
import ResumeButton from "./ResumeButton";
import Head from "next/head";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

function HomeContent() {
  const { rotate } = useRotation();
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

        onUpdate={(latest) => { // Added onUpdate callback
          if (Number(latest.opacity) <= 0.2) {
            setIsInArtMode(true);
          } else {
            setIsInArtMode(false);
          }
        }}
      >
        <motion.div
          className="p-[3vh] content-normal gap-[0vh] h-[99vh] grid grid-cols-3 grid-rows-3"
          animate={{ y: rotate ? "-150vh" : 0 }}
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
          className="absolute top-0 left-0 w-full h-full z-12"
          animate={{
            y: !rotate ? "150vh" : 0,
            opacity: !rotate ? 0 : (isMouseDown ? 0.05 : 1),
          }}
          transition={{
            y: { duration: 0.9, ease: "easeInOut" },
            opacity: { duration: 0.4, ease: "easeInOut" },
          }}
        >
          <div>
            <h1>UNDER CONSTRUCTION</h1>
            <HomeButton />
          </div>
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