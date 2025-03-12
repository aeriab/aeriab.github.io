import React from "react";
import { motion } from "framer-motion";
import { HiOutlineCursorArrowRays } from "react-icons/hi2"; // Using react-icons for pointer

const PointerSwipe: React.FC = () => {
  return (
    <motion.div
      initial={{ x: "-50%", y: "250%" }}
      animate={{ x: ["-50%", "50%", "-50%"] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <HiOutlineCursorArrowRays />
    </motion.div>
  );
};

export default PointerSwipe;
