import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const SpotlightCard = ({ children, className = '', color = '#a855f7' }) => {
  const ref = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: "-100%", y: "-100%" });

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setMousePosition({ 
          x: event.clientX - rect.left, 
          y: event.clientY - rect.top 
        });
      }
    };

    const currentRef = ref.current;
    currentRef.addEventListener("mousemove", handleMouseMove);

    return () => {
      currentRef.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`spotlight-glass-card ${className}`}
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
        '--spotlight-color': color,
      }}
      whileHover={{ scale: 1.025, boxShadow: "0 8px 40px 0 #a855f755" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div 
        className="spotlight-glass-bg"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color)33 0%, transparent 80%)`
        }}
      />
      {children}
    </motion.div>
  );
};

export default SpotlightCard; 