"use client";

import { NavigationProvider, useNavigation } from "./navigateContext";
import ThreeDScene from "../../components/ThreeDScene";
import NameCard from "./nameCard";
import ReloadButton from "./AnimatedButtons/ReloadButton";
import HomeButton from "./AnimatedButtons/HomeButton";
// import ProjectButton from "./AnimatedButtons/ProjectButton";
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
  // const isInProjectsView = currentView === "inProjects";
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

  const isActive = isMouseDown || isPointerDown;

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
        className="fixed top-4 right-4 bg-white/80 text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-[min(3vh,3vw)] font-semibold"
        animate={!isActive ? "hidden" : "visible" }
        variants={{
          visible: { opacity: [1, 0.6, 1], transition: { duration: 1.5, repeat: Infinity } },
          hidden: { opacity: 0, transition: { duration: 1.3 } }
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ☁️ Cloud Drawing Mode Active
      </motion.div>


      <motion.div
        ref={mainDivRef}
        className="absolute top-0 left-0 w-full h-full z-10 p-[4%]"
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
          className="p-[3vh] content-normal gap-[0vh] h-[99vh] grid grid-cols-5 grid-rows-[1fr_1fr_2fr_2fr] select-none"
          animate={{ y: isInHomeView ? 0 : "-150vh" }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          {/* Row 1: Nameplate */}
          <div className="big-style h-0 text-white lexend text-[min(8vw,8vh)] col-start-5 col-end-6 row-start-1 row-end-2 z-13">
            <PointerSwipe />
          </div>
          <div className="big-style h-[var(--custom-top-height)] text-white lexend col-start-1 col-end-6 row-start-1 row-end-2">
            <NameCard />
          </div>
          
          {/* Row 2: Social Media Buttons */}
          <div className="big-style h-[var(--custom-tmiddle-height)] col-start-2 col-end-5 row-start-2 row-end-3">
            <SocialMediaButtons
              github="https://github.com/aeriab"
              linkedin="https://linkedin.com/in/brendan-aeria-7494a7218/"
              instagram="https://instagram.com/brendan_aeria1622"
              twitter="https://x.com/BrendanAeria"
              youtube="https://youtube.com/@brendan3511/featured"
              // className="mt-8"
            />
          </div>
          
          {/* Row 3: Refresh and About */}
          <div className="big-style h-[var(--custom-middle-height)] col-start-2 col-end-3 row-start-3 row-end-4">
            <ReloadButton />
          </div>
          <div className="big-style h-[var(--custom-middle-height)] col-start-4 col-end-5 row-start-3 row-end-4">
            <AboutButton />
          </div>
          
          {/* Row 4: Blog, Games, and Resume */}
          <div className="big-style h-[var(--custom-bottom-height)] col-start-1 col-end-2 row-start-4 row-end-5">
            <BlogButton />
          </div>
          <div className="big-style h-[var(--custom-bottom-height)] col-start-3 col-end-4 row-start-4 row-end-5">
            <GamesButton />
          </div>
          <div className="big-style h-[var(--custom-bottom-height)] col-start-5 col-end-6 row-start-4 row-end-5">
            <ResumeButton />
          </div>
        </motion.div>

        {/* About View */}
        <motion.div
          className="p-[6vh] content-normal gap-[0vh] h-[99vh] grid grid-cols-[1fr_8fr_1fr_8fr_1fr] grid-rows-[1fr_1fr_6fr_1fr_1fr_2fr] select-none"
          initial={{ y: "150vh", opacity: 0 }}
          animate={{
            // y: !isInAboutView ? "150vh" : 0,
            y: isInHomeView ? "50vh" : "-100vh",
            opacity: !isInAboutView ? 0 : ((isMouseDown || isPointerDown) ? 0.05 : 1),
          }}
          
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <div className="big-style col-start-1 col-end-6 row-start-1 row-end-2">
            <h1 className="text-[min(5vw,5vh)] text-[#000000] font-bold lexend text-center h-[5vh]">Brendan Aeria</h1>
          </div>
          <div className="big-style col-start-1 col-end-6 row-start-2 row-end-3 h-[min(15vh,15vw)]">
            <SocialMediaButtons
              github="https://github.com/aeriab"
              linkedin="https://linkedin.com/in/brendan-aeria-7494a7218/"
              instagram="https://instagram.com/brendan_aeria1622"
              twitter="https://x.com/BrendanAeria"
              youtube="https://youtube.com/@brendan3511/featured"
            />
          </div>

          <div className="big-style col-start-2 col-end-3 row-start-3 row-end-4">
            <motion.img 
              src="https://aeriab.github.io/PowayPark_Profile_Pic.jpg" 
              alt="Picture" 
              className="w-[min(30vw,30vh)] rounded-[min(100vh,100vw)]"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
          </div>
          <div className="big-style col-start-4 col-end-5 row-start-3 row-end-4">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p className="text-[min(3.2vw,3.2vh)] text-[#000000] font-bold lexend leading-[min(3.8vw,3.8vh)]">
                Computation and Systems Biology Undergraduate · UCLA class of 2027 <br />
              </p>
              <p className="text-[min(1.6vw,1.6vh)] text-[#000000] lexend text-left mt-[3.0vh] leading-[min(3.9vw,3.9vh)]">
                As the research coordinator for CruX UCLA, I lead the development of Brain Computer Interface software and contribute to research publications on EEG/EMG transfer learning. My experience extends to game development, where I have won two university-wide game jams and serve as the Game Jam Officer for ACM Studio UCLA. Additionally, I have internship experience in AI content development and machine learning model engineering.
              </p>
            </motion.div>
          </div>

          <motion.div 
            className="big-style col-start-1 col-end-6 row-start-5 row-end-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <HomeButton />
          </motion.div>
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