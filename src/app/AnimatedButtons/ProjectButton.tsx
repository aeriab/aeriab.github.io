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

const TRANSLATE_RANGE = 0.33;

const NeumorphismButton = () => {
  const { navigateToProjects } = useNavigation();
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotation = useMotionValue(0);
  
  // Springs for smoother animation
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotationSpring = useSpring(rotation, { stiffness: 10, damping: 15 });

  // Transform templates
  const containerTransform = useMotionTemplate`translateX(${xSpring}px) translateY(${ySpring}px)`;
  const imageTransform = useMotionTemplate`rotateZ(${rotationSpring}deg)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate pointer position relative to the div
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    // Map pointer coordinates to translation range
    const tX = (pointerX / width - 0.5) * width * TRANSLATE_RANGE;
    const tY = (pointerY / height - 0.5) * height * TRANSLATE_RANGE;

    x.set(tX);
    y.set(tY);
    rotation.set(tX * 3.5); // Simplified rotation calculation
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
    rotation.set(0);
  };

  // Clean up function to reset values if touch is canceled
  const handlePointerCancel = () => {
    handlePointerLeave();
  };

  // Add event listeners for touch events
  useEffect(() => {
    const button = buttonRef.current;
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

  return (
    <motion.div
      ref={buttonRef}
      whileHover={{ scale: 3.1 }}
      whileTap={{ scale: 3.1 }} // Match the hover scale for touch
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      onTouchStart={navigateToProjects}
      style={{
        transformStyle: "preserve-3d",
        transform: containerTransform,
        willChange: "transform",
        touchAction: "none", // Prevent browser handling of all panning and zooming gestures
      }}
      className="w-full h-full"
    >
      <div className="w-full h-full flex items-center justify-center">
        <motion.button 
          whileHover={{ scale: 1.4 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={navigateToProjects}
          className="flex flex-col items-center justify-center h-[min(35vw,35vh)] w-[min(35vw,35vh)] relative"
        >
          {/* Image with rotation */}
          <motion.div
            style={{ 
              transformStyle: "preserve-3d", 
              transformOrigin: "center", 
              willChange: "transform", 
              transform: imageTransform,
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

          {/* Glow text (behind) */}
          <motion.p
            className="absolute text-[min(6vw,6vh)] text-[#2f00ff] font-bold lexend"
            style={{
              zIndex: 0,
              filter: 'blur(10px)',
            }}
          >
            PROJECTS
          </motion.p>

          {/* Main text (front) */}
          <motion.p 
            className="text-[min(6vw,6vh)] absolute text-[#ffffff] lexend"
            style={{
              zIndex: 1,
            }}
          >
            PROJECTS
          </motion.p>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ButtonWrapper;