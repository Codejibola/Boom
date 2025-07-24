import React from "react";
import { motion } from "framer-motion";

export default function Loader() {
  // Generate random stars
  const stars = Array.from({ length: 25 }).map((_, i) => {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const delay = Math.random() * 5;

    return (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full opacity-70"
        style={{
          top: `${randomY}vh`,
          left: `${randomX}vw`,
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
          delay,
        }}
      />
    );
  });

  return (
    <div className="relative flex justify-center items-center h-screen w-screen bg-black overflow-hidden">
      {/* Stars background */}
      {stars}

      {/* Clean "B" without glow */}
      <div className="text-8xl font-bold text-blue-600 relative z-10">
        B
      </div>
    </div>
  );
}
