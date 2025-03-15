"use client";
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



const TRANSLATE_RANGE = 0.33;

const NeumorphismButton = () => {

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
    const tX = (mouseX / width - 0.5) * width * TRANSLATE_RANGE;
    const tY = (mouseY / height - 0.5) * height * TRANSLATE_RANGE;

    x.set(tX);
    y.set(tY);
    theta.set((tX * 0.1) * 35.0)
  };

  const handleMouseLeave = () => {
      x.set(0);  // Reset rotations on mouse leave
      y.set(0);
  };

  const navigateToGames = () => {window.open('https://itch.io/profile/brendan-a', '_blank')};

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={navigateToGames}
      style={{
        transformStyle: "preserve-3d",
        transform: useMotionTemplate`translateX(${xSpring}px) translateY(${ySpring}px)`,
        willChange: "transform",
      }} className="w-full h-full"
    >
      <div className="w-full h-full flex items-center justify-center">
        <motion.button 
          initial={{ scale: 1.5 }}
          whileHover={{ scale: 2.1 }}
          whileTap={{ scale: 0.80 }} // Slightly shrinks when clicked
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={() => window.open('https://itch.io/profile/brendan-a', '_blank')} 
          className="flex flex-col items-center justify-center h-[min(25vw,25vh)] w-[min(25vw,25vh)]"
        >
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
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
              
              src="https://aeriab.github.io/poker_chip.png"
              // src="/official_profile_picture.SVG" 
              alt="Protein Logo" 
              className="w-full h-full object-contain"
              width={10} // Specify the width of the image (or use a value based on your layout)
              height={10} // Specify the height of the image (or use a value based on your layout)
            />
            {/* <img src="/official_profile_picture.svg" alt="Globe Logo" className="w-full h-full"/> */}
          </motion.div>

          <motion.p
            className="absolute z-10 text-[min(5vw,5vh)] text-[#2f00ff] font-bold lexend"
            style={{
              zIndex: 0, // Behind the original text
              filter: 'blur(10px)', // Optional, for a shadow-like effect
            }}
          >
            GAMES
          </motion.p>

          {/* Original Text */}
          <motion.p 
            className="text-[min(5vw,5vh)] absolute z-10 text-[#ffffff] font-bold lexend"
            style={{
              zIndex: 1, // Behind the original text
            }}
          >
            GAMES
          </motion.p>

          
          {/* <p className="text-xl absolute z-10 text-[#ffffff] lexend">GAMES</p> */}
        </motion.button>
      </div>
      
    </motion.div>
    
  );
};

export default ButtonWrapper;
