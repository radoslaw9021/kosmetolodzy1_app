import React, { useState, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface PinContainerProps {
  children: ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}

export default function PinContainer({
  children,
  title,
  href,
  className,
  containerClassName,
}: PinContainerProps) {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg) scale(1)"
  );

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateX(30deg) scale(0.96)");
  };
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
  };

  return (
    <a
      className={cn(
        "relative group/pin z-50 cursor-pointer",
        containerClassName
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      href={href || "/"}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{
            transform: transform,
          }}
          className="absolute left-1/2 p-4 top-1/2 flex justify-start items-start rounded-2xl shadow-[0_8px_16px_rgb(0_0_0/0.4)] bg-[#181a24] border border-cyan-400/20 group-hover/pin:border-cyan-300/40 transition duration-700 overflow-hidden"
        >
          <div className={cn("relative z-50", className)}>{children}</div>
        </div>
      </div>
      <PinPerspective title={title} href={href} />
    </a>
  );
}

interface PinPerspectiveProps {
  title?: string;
  href?: string;
}

function PinPerspective({ title, href }: PinPerspectiveProps) {
  return (
    <div className="pointer-events-none w-80 h-64 flex items-center justify-center opacity-0 group-hover/pin:opacity-100 z-[60] transition duration-500">
      <div className="w-full h-full -mt-7 flex-none inset-0">
        <div className="absolute top-0 inset-x-0 flex justify-center">
          <a
            href={href}
            target="_blank"
            className="relative flex space-x-2 items-center z-10 rounded-full bg-[#181a24] py-0.5 px-4 ring-1 ring-cyan-400/20 "
          >
            <span className="relative z-20 text-cyan-200 text-xs font-bold inline-block py-0.5">
              {title}
            </span>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-cyan-400/0 via-cyan-400/90 to-cyan-400/0 transition-opacity duration-500 group-hover/btn:opacity-40"></span>
          </a>
        </div>
        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="absolute left-1/2 top-1/2 h-40 w-40 rounded-full bg-cyan-400/10 shadow-[0_8px_16px_rgb(0_0_0/0.4)] -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
        </div>
        <div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-cyan-500 translate-y-[14px] w-px h-20 group-hover/pin:h-32 blur-[2px]" />
        <div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-cyan-500 translate-y-[14px] w-px h-20 group-hover/pin:h-32" />
        <div className="absolute right-1/2 translate-x-[1.5px] bottom-1/2 bg-cyan-600 translate-y-[14px] w-[4px] h-[4px] rounded-full z-40 blur-[3px]" />
        <div className="absolute right-1/2 translate-x-[0.5px] bottom-1/2 bg-cyan-300 translate-y-[14px] w-[2px] h-[2px] rounded-full z-40" />
      </div>
    </div>
  );
} 