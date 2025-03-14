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

const ButtonWrapper = () => {
  return (
    <div className="w-full h-full">
      <NeumorphismButton />
    </div>
  );
};

const TRANSLATE_RANGE = 150.0;

const NeumorphismButton = () => {
  const { navigateToHome } = useNavigation();

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

  // Add event listeners for touch events
  useEffect(() => {
    const button = ref.current;
    if (!button) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Prevent default to avoid scrolling when interacting with the button
      e.preventDefault();
    };

    button.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    return () => {
      button.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  const handleTouchStart = () => {
    x.set(0);
    y.set(0);
  };

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
      onTouchStart={navigateToHome}
      onTouchEnd={navigateToHome}
      style={{
        transformStyle: "preserve-3d",
        transform: useMotionTemplate`translateX(${xSpring}px) translateY(${ySpring}px)`,
        willChange: "transform",
        touchAction: "none", // Prevent browser handling of all panning and zooming gestures
      }} 
      className="w-full h-full"
    >
      <div className="w-full h-full flex items-center justify-center">
        <motion.button 
          whileHover={{ scale: 1.4 }}
          whileTap={{ scale: 0.95 }} // Slightly shrinks when clicked
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={navigateToHome}
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
              src="https://aeriab.github.io/official_profile_picture.svg"
              alt="Protein Logo" 
              className="w-full h-full"
              width={10}
              height={10}
            />
          </motion.div>

          <motion.p
            className="absolute z-10 text-[min(3vw,3vh)] text-[#2f00ff] font-bold lexend"
            style={{
              zIndex: 0,
              filter: 'blur(10px)',
            }}
          >
            HOME
          </motion.p>

          <motion.p 
            className="text-[min(3vw,3vh)] absolute z-10 text-[#ffffff] font-bold lexend"
            style={{
              zIndex: 1,
            }}
          >
            HOME
          </motion.p>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ButtonWrapper;