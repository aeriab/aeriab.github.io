"use client";

import { RotationProvider, useRotation } from "./rotateContext";
import ThreeDScene from "../../components/ThreeDScene";
import NameCard from "./nameCard";
import ReloadButton from "./ReloadButton";
import ProjectButton from "./ProjectButton";
import AboutButton from "./AboutButton";
import BlogButton from "./BlogButton";
import GamesButton from "./GamesButton";
import Head from "next/head";
import { motion } from "framer-motion";

function HomeContent() {
  const { rotate } = useRotation(); // Get state from RotationProvider

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
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <motion.div
          className="p-[3vh] content-normal gap-[0vh] h-[99vh] grid grid-cols-3 grid-rows-3"
          animate={{ y: rotate ? "-150vh" : 0 }} // Slide elements when rotate is true
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <div className="big-style h-[var(--custom-top-height)] text-white lexend text-[100px] col-start-1 col-end-4 row-start-1 row-end-2"><NameCard /></div>
          <div className="big-style h-[var(--custom-middle-height)] z-11"><ReloadButton /></div>
          <div className="big-style h-[var(--custom-middle-height)]"><ProjectButton /></div>
          <div className="big-style h-[var(--custom-middle-height)]"><AboutButton /></div>
          <div className="big-style h-[var(--custom-bottom-height)]"><BlogButton /></div>
          <div className="big-style h-[var(--custom-bottom-height)]"><GamesButton /></div>
          <div className="big-style h-[var(--custom-bottom-height)]">Resume</div>
        </motion.div>

        {/* <div className="absolute top-10 left-10 z-20">
          <ReloadButton />
        </div> */}
        

        <motion.div
          className="absolute top-10 left-10 z-20"
          animate={{ y: rotate ? 0 : "150vh", opacity: rotate ? 1 : 0 }} // Fade in/out the home button
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <ReloadButton />
          <h1>UNDER CONSTRUCTION</h1>
          {/* <Image 
            unoptimized
            
            src="https://aeriab.github.io/under_construction.png"
            // src="/official_profile_picture.SVG"
            alt="Under Construction" 
            className="w-full h-full"
            width={10} // Specify the width of the image (or use a value based on your layout)
            height={10} // Specify the height of the image (or use a value based on your layout)
          /> */}
        </motion.div>
        {/* <motion.div
          className="absolute top-15 left-15 z-20"
          animate={{ y: rotate ? 0 : "150vh", opacity: rotate ? 1 : 0 }} // Fade in/out the home button
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          
        </motion.div> */}
      </div>
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
