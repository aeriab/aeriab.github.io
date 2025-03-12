"use client";

import { useNavigation } from './rotateContext';
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from 'next/image';

const ButtonWrapper = () => {
  return (
    <div className="w-full h-full">
      <NeumorphismButton />
    </div>
  );
};



const TRANSLATE_RANGE = 150.0;

const NeumorphismButton = () => {

  const { currentView, toggleView } = useNavigation();

  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const theta = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotationDegree = useSpring(theta, { stiffness: 10, damping: 15});

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to the div
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Map mouse coordinates to translation range
    const tX = (mouseX / width - 0.5) * TRANSLATE_RANGE;
    const tY = (mouseY / height - 0.5) * TRANSLATE_RANGE;

    x.set(tX);
    y.set(tY);
    theta.set((tX * 0.1) * 35.0)
  };

  const handleMouseLeave = () => {
      x.set(0);  // Reset rotations on mouse leave
      y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform: useMotionTemplate`translateX(${xSpring}px) translateY(${ySpring}px)`,
        willChange: "transform",
      }} className="w-full h-full"
    >
      <div className="w-full h-full flex items-center justify-center">
        <motion.button 
          whileHover={{ scale: 1.4 }}
          whileTap={{ scale: 0.95 }} // Slightly shrinks when clicked
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={toggleView}
          className="flex flex-col items-center justify-center h-[min(17vw,17vh)] w-[min(17vw,17vh)]"
        >
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: "preserve-3d", transformOrigin: "center", willChange: "transform", transform: useMotionTemplate`rotateZ(${rotationDegree}deg)` }}
            className="w-full h-full"
          >
            <Image 
              unoptimized
              
              src="https://aeriab.github.io/official_profile_picture.svg"
              // src="/official_profile_picture.SVG" 
              alt="Protein Logo" 
              className="w-full h-full"
              width={10} // Specify the width of the image (or use a value based on your layout)
              height={10} // Specify the height of the image (or use a value based on your layout)
            />
            {/* <img src="/official_profile_picture.svg" alt="Globe Logo" className="w-full h-full"/> */}
          </motion.div>

          <motion.p
            className="absolute z-10 text-[min(3vw,3vh)] text-[#2f00ff] font-bold lexend"
            style={{
              zIndex: 0, // Behind the original text
              filter: 'blur(10px)', // Optional, for a shadow-like effect
            }}
          >
            HOME
          </motion.p>

          {/* Original Text */}
          <motion.p 
            className="text-[min(3vw,3vh)] absolute z-10 text-[#ffffff] font-bold lexend"
            style={{
              zIndex: 1, // Behind the original text
            }}
          >
            HOME
          </motion.p>



          {/* <p className="text-xl absolute z-10 text-[#ffffff] lexend">HOME</p> */}
        </motion.button>
      </div>
      
    </motion.div>
    
  );
};

export default ButtonWrapper;
