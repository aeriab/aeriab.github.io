"use client";

import React from "react";
// import Link from "next/link";
import { motion } from "framer-motion";

interface SocialButtonProps {
  url: string;
  ariaLabel: string;
  children: React.ReactNode;
}

const SocialButton: React.FC<SocialButtonProps> = ({ url, ariaLabel, children }) => {
  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent default to ensure consistent behavior
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="mx-2"
    >
      <button
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
        aria-label={ariaLabel}
        className="block p-3 rounded-full bg-white hover:bg-gray-100 transition-colors"
      >
        {children}
      </button>
    </motion.div>
  );
};

const SocialMediaButtons: React.FC<{
  github?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  className?: string;
}> = ({ github, linkedin, instagram, twitter, youtube, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {github && (
        <SocialButton url={github} ariaLabel="GitHub Profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[min(4vw,4vh)] h-[min(4vw,4vh)] text-black"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </SocialButton>
      )}

      {linkedin && (
        <SocialButton url={linkedin} ariaLabel="LinkedIn Profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[min(4vw,4vh)] h-[min(4vw,4vh)] text-black"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </SocialButton>
      )}

      {instagram && (
        <SocialButton url={instagram} ariaLabel="Instagram Profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[min(4vw,3vh)] h-[min(4vw,3vh)] text-black"
          >
            <path d="M16 11.37A4 4 0 1 1 12.63 8.37 4 4 0 0 1 16 11.37z" />
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M17.5 6.5h.01" />
          </svg>
        </SocialButton>
      )}

      {twitter && (
        <SocialButton url={twitter} ariaLabel="X (Twitter) Profile">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-[min(4vw,4vh)] h-[min(4vw,4vh)] text-black"
          >
            <path d="M18 3L5 21" />
            <path 
              d="M5 3l13 18" 
              strokeWidth="4" 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <path 
              d="M5 3l13 18" 
              strokeWidth="1" 
              stroke="white" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </SocialButton>
      )}

      {youtube && (
        <SocialButton url={youtube} ariaLabel="YouTube Channel">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[min(4vw,4vh)] h-[min(4vw,4vh)] text-black"
          >
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2 29 29 0 0 0-.46 5.25 29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
            <path d="M9.75 15.02v-6.54l6.5 3.27-6.5 3.27z" />
          </svg>
        </SocialButton>
      )}
    </div>
  );
};

export default SocialMediaButtons;
