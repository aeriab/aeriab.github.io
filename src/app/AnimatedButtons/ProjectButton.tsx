"use client";

import { useNavigation } from '../navigateContext';
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
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
    rotation.set(tX * 3.5); // Simplified rotation calculation
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rotation.set(0);
  };

  return (
    <motion.div
      ref={buttonRef}
      whileHover={{ scale: 3.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform: containerTransform,
        willChange: "transform",
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