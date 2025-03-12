"use client";
import { useEffect, useRef } from "react";

import { 
    motion,
    useMotionTemplate,
    useMotionValue,
    useSpring,
} from "framer-motion";

const ROTATION_RANGE = 6.0;

const NameCard = () => {
    const ref = useRef<HTMLDivElement | null>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Calculate mouse position relative to the div
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Map mouse coordinates to rotation range
        // const rX = Math.max(Math.min((mouseY / height - 0.5) * -2 * ROTATION_RANGE * 0.5,1),-1);
        const rX = Math.max(Math.min((mouseY / height - 0.5) * -2 * ROTATION_RANGE * 0.5,45),-45);
        const rY = Math.max(Math.min((mouseX / width - 0.5) * 2 * ROTATION_RANGE * 1.8,45),-45);

        x.set(rX);  // Set motion values
        y.set(rY);
        };

        // Add event listener for mouse movement globally
        window.addEventListener("mousemove", handleMouseMove);

        // Cleanup on unmount
        return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const handleMouseLeave = () => {
        x.set(0);  // Reset rotations on mouse leave
        y.set(0);
    };

    return (
        <motion.div
        ref={ref}
        onMouseLeave={handleMouseLeave}
        style={{
            transformStyle: "preserve-3d",
            transform,
            userSelect: "none",
            WebkitUserSelect: "none",
            pointerEvents: "none",
            cursor: "default"
        }}
        className="width-full height-full position-absolute top-0 left-0"
        >
            <div 
                style={{
                    transform: "translateZ(10vh)",
                    transformStyle: "preserve-3d",
                    paddingLeft: "1vh",
                    paddingTop: "1vh",
                    paddingRight: "1vh",
                    paddingBottom: "1vh",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    pointerEvents: "none",
                    cursor: "default"
                }}
                className="big-style rounded-xl bg-[#88d6fa] shadow-lg"
            >
                <div 
                    style={{
                        transform: "translateZ(3vh)",
                        userSelect: "none",
                        WebkitUserSelect: "none",
                        pointerEvents: "none",
                        cursor: "default"
                    }}
                    className="mx-auto text-4xl bg-[#d4f0fc] rounded-xl shadow-lg h-[80%]"
                >
                    <p 
                        style={{
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            pointerEvents: "none",
                            cursor: "default"
                        }}
                        className="width-full height-full position-absolute top-0 left-0 text-[#01313f] lexend text-[10vh] text-center"
                    >
                        Brendan Aeria
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default NameCard;