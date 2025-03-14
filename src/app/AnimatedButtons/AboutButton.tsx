"use client";

import { useNavigation } from '../navigateContext';
import { useRef, useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from 'next/image';

import { Lexend } from 'next/font/google';

const roboto = Lexend({
  weight: ['500'], // Specify the weights you want to load
  subsets: ['latin'], // Define the character subsets
});

const ButtonWrapper = () => {
  return (
    <div className="w-full h-full">
      <NeumorphismButton />
    </div>
  );
};

const TRANSLATE_RANGE = 150.0;

const NeumorphismButton = () => {
  const { navigateToAbout } = useNavigation();

  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const theta = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotationDegree = useSpring(theta, { stiffness: 10, damping: 15});

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate pointer position relative to the div
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    // Map pointer coordinates to translation range
    const tX = (pointerX / width - 0.5) * TRANSLATE_RANGE;
    const tY = (pointerY / height - 0.5) * TRANSLATE_RANGE;

    x.set(tX);
    y.set(tY);
    theta.set((tX * 0.1) * 35.0)
  };

  const handlePointerLeave = () => {
    x.set(0);  // Reset rotations on pointer leave
    y.set(0);
  };
  
  const handlePointerCancel = () => {
    handlePointerLeave();
  };

  const handleTouchStart = () => {
    x.set(0);
    y.set(0);
  };

  // Add event listeners for touch events
  useEffect(() => {
    const button = ref.current;
    if (!button) return;
  
    button.addEventListener("touchstart", handleTouchStart);
    return () => {
      button.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      onTouchStart={navigateToAbout} // Ensure touch interactions are captured
      onTouchEnd={navigateToAbout} // Trigger navigation on tap
      style={{
        transformStyle: "preserve-3d",
        transform: useMotionTemplate`translateX(${xSpring}px) translateY(${ySpring}px)`,
        willChange: "transform",
        touchAction: "manipulation", // Allow taps while preventing zoom
      }} 
      className="w-full h-full"
    >
      <div className="w-full h-full flex items-center justify-center">
        <motion.button 
          whileHover={{ scale: 2.8 }}
          whileTap={{ scale: 0.80 }} // Slightly shrinks when clicked
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={navigateToAbout}
          className="flex flex-col items-center justify-center h-[min(17vw,17vh)] w-[min(17vw,17vh)]"
        >
          <motion.div
            style={{ 
              transformStyle: "preserve-3d", 
              transformOrigin: "center", 
              willChange: "transform", 
              transform: useMotionTemplate`rotateZ(${rotationDegree}deg)` 
            }}
            className="w-full h-full"
          >
            <Image 
              unoptimized
              src="https://aeriab.github.io/goofy_selfie(4).png"
              alt="Protein Logo" 
              className="w-full h-full"
              width={20}
              height={20}
            />
          </motion.div>

          <motion.p
            className="absolute z-10 text-[min(3vw,3vh)] text-[#2f00ff] font-bold lexend"
            style={{
              zIndex: 0,
              filter: 'blur(10px)',
            }}
          >
            ABOUT
          </motion.p>

          <motion.p 
            className={`${roboto.className} font-[500] text-[min(3vw,3vh)] absolute z-10 text-[#ffffff]`}
            style={{
              zIndex: 1,
            }}
          >
            ABOUT
          </motion.p>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ButtonWrapper;