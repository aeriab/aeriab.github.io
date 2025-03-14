"use client";

import { NavigationProvider, useNavigation } from "./navigateContext";
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
import PointerSwipe from "./PointerSwipe";

import Head from "next/head";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

function HomeContent() {
  const { currentView } = useNavigation();
  const isInProjectsView = currentView === "inProjects";
  const isInAboutView = currentView === "inAbout";
  const isInHomeView = currentView === "inHome";
  
  const [isInArtMode, setIsInArtMode] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const mainDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handlePointerDown = () => setIsPointerDown(true);
    const handlePointerUp = () => setIsPointerDown(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  useEffect(() => {
    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    if (mainDivRef.current && (isMouseDown || isPointerDown)) {
      mainDivRef.current.addEventListener('dragstart', preventDrag);
    }

    return () => {
      if (mainDivRef.current) {
        mainDivRef.current.removeEventListener('dragstart', preventDrag);
      }
    };
  }, [isMouseDown, isPointerDown]);

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
          opacity: (isMouseDown || isPointerDown) ? 0.0 : 1,
          pointerEvents: isInArtMode ? "none" : "auto",
        }}
        transition={{
          opacity: { duration: 2.0, ease: "linear", delay: (isMouseDown || isPointerDown) ? 0 : 1 },
        }}
        onUpdate={(latest) => {
          if (Number(latest.opacity) <= 0.2) {
            setIsInArtMode(true);
          } else {
            setIsInArtMode(false);
          }
        }}
      >

        {/* Home */}
        <motion.div
          className="p-[3vh] content-normal gap-[0vh] h-[99vh] grid grid-cols-3 grid-rows-3 select-none"
          animate={{ y: isInHomeView ? 0 : "-150vh" }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <div className="big-style h-0 text-white lexend text-[min(8vw,8vh)] col-start-1 col-end-2 row-start-1 row-end-2 z-13">
            <PointerSwipe />
          </div>
          <div className="big-style h-[var(--custom-top-height)] text-white lexend col-start-1 col-end-4 row-start-1 row-end-2">
            <NameCard />
          </div>
          <div className="big-style h-[var(--custom-middle-height)]"><ReloadButton /></div>
          <div className="big-style h-[var(--custom-middle-height)] z-11"><ProjectButton /></div>
          <div className="big-style h-[var(--custom-middle-height)]"><AboutButton /></div>
          <div className="big-style h-[var(--custom-bottom-height)]"><BlogButton /></div>
          <div className="big-style h-[var(--custom-bottom-height)]"><GamesButton /></div>
          <div className="big-style h-[var(--custom-bottom-height)]"><ResumeButton /></div>
        </motion.div>

        {/* Projects */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full z-12 select-none"
          initial={{ y: "150vh", opacity: 0 }}
          animate={{
            y: isInProjectsView ? 0 : "150vh",
            opacity: isInProjectsView ? ((isMouseDown || isPointerDown) ? 0.05 : 1) : 0,
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
            <h1 className="flex items-center justify-center text-xl">PROJECTS</h1>
            <h1 className="flex items-center justify-center text-xl">UNDER CONSTRUCTION</h1>
          </div>
        </motion.div>

        {/* About View */}
        <motion.div
          className="grid gap-8 border-3 absolute top-0 left-0 right-0"
          initial={{ y: "150vh", opacity: 0 }}
          animate={{
            y: !isInAboutView ? "150vh" : 0,
            opacity: !isInAboutView ? 0 : ((isMouseDown || isPointerDown) ? 0.05 : 1),
          }}
          transition={{
            y: { duration: 0.9, ease: "easeInOut" },
            opacity: { duration: 0.4, ease: "easeInOut" },
          }}
        >
          <div className="flex flex-col gap-4">
            {/* First row with two columns */}
            <div className="flex-1 p-4 border border-gray-300 rounded-lg flex items-center justify-center">
              <h1 className="text-[min(5vw,5vh)] text-[#000000] font-bold lexend text-center">Brendan Aeria</h1>
              <SocialMediaButtons
                github="https://github.com/aeriab"
                linkedin="https://linkedin.com/in/brendan-aeria-7494a7218/"
                instagram="https://instagram.com/brendan_aeria1622"
                twitter="https://x.com/BrendanAeria"
                youtube="https://youtube.com/@brendan3511/featured"
                className="mt-8" // Increased margin
              />
            </div>
            
            
            {/* Second row (single column) */}
            <div className="flex flex-row gap-4 h-1/4">
              {/* First column */}
              <div className="flex-1 p-4 border border-gray-300 rounded-lg flex items-center justify-center">
                <img src="https://aeriab.github.io/PowayPark_Profile_Pic.jpg" alt="Picture" className="w-[min(30vw,30vh)] rounded-lg" />
              </div>
              
              {/* Second column */}
              <div className="flex-1 p-4 border border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[min(1.8vw,1.8vh)] text-[#000000] font-bold lexend mt-4 mb-2">
                    Computation and Systems Biology Undergraduate · UCLA class of 2027
                  </p>
                  <p className="text-[min(2vw,2vh)] text-[#000000] font-bold lexend mt-8 leading-relaxed max-w-[50vw] text-left">
                    As the research coordinator for CruX UCLA, I lead the development of Brain Computer Interface software and contribute to research publications on EEG/EMG transfer learning. My experience extends to game development, where I have won two university-wide game jams and serve as the Game Jam Officer for ACM Studio UCLA. Additionally, I have internship experience in AI content development and machine learning model engineering.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full h-1/4 p-4 border border-gray-300 rounded-lg flex items-center justify-center">
              <p>Third Row Content</p>
            </div>
          </div>
          {/* <div className="flex justify-center items-center">
            <img src="https://aeriab.github.io/PowayPark_Profile_Pic.jpg" alt="Picture" className="w-[min(30vw,30vh)] rounded-lg" />
            <h1 className="text-[min(5vw,5vh)] text-[#000000] font-bold lexend text-center">Brendan Aeria</h1>
            <SocialMediaButtons
              github="https://github.com/aeriab"
              linkedin="https://linkedin.com/in/brendan-aeria-7494a7218/"
              instagram="https://instagram.com/brendan_aeria1622"
              twitter="https://x.com/BrendanAeria"
              youtube="https://youtube.com/@brendan3511/featured"
              className="mt-8" // Increased margin
            />
          </div>
          <div>
            <p className="text-[min(1.8vw,1.8vh)] text-[#000000] font-bold lexend text-center mt-4 mb-2">
              Computation and Systems Biology Undergraduate · UCLA class of 2027
            </p>
            <br />
            <p className="text-[min(2vw,2vh)] text-[#000000] font-bold lexend mt-8 leading-relaxed max-w-[50vw]">
              As the research coordinator for CruX UCLA, I lead the development of Brain Computer Interface software and contribute to research publications on EEG/EMG transfer learning. My experience extends to game development, where I have won two university-wide game jams and serve as the Game Jam Officer for ACM Studio UCLA. Additionally, I have internship experience in AI content development and machine learning model engineering.
            </p>
          </div> */}
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