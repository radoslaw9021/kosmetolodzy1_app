"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function MovingBorder({
  children,
  borderRadius = "1.5rem",
  className,
  containerClassName,
  duration = 8,
}: {
  children: React.ReactNode;
  borderRadius?: string;
  className?: string;
  containerClassName?: string;
  duration?: number;
}) {
  return (
    <div
      className={cn(
        "relative z-0 flex items-center justify-center",
        containerClassName
      )}
      style={{ borderRadius }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
        className="absolute inset-0 z-10 bg-pink-500/60 blur-2xl border-4 border-pink-400"
        style={{ borderRadius }}
      />
      <div
        className={cn(
          "relative z-20 border border-white/[0.1] bg-[#181022] px-6 py-4",
          className
        )}
        style={{ borderRadius }}
      >
        {children}
      </div>
    </div>
  );
} 