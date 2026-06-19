import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, Eye } from "lucide-react";
import { ShoeCategory } from "../types";

interface ThreeDCarouselProps {
  categories: ShoeCategory[];
  onSelectCategory: (category: ShoeCategory) => void;
}

export default function ThreeDCarousel({ categories, onSelectCategory }: ThreeDCarouselProps) {
  // Angle of standard rotation in degrees
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);

  // Total items in 3D circle
  const itemCount = categories.length;
  const anglePerItem = 360 / itemCount;

  // Auto-rotating tick
  useEffect(() => {
    if (!isHovered) {
      autoRotateRef.current = setInterval(() => {
        setRotationAngle((prev) => prev - 0.5); // slow smooth rotation (0.5 degree per tick)
      }, 45); // ~24fps incremental update
    } else {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    }

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [isHovered]);

  const handleNext = () => {
    setRotationAngle((prev) => prev - anglePerItem);
  };

  const handlePrev = () => {
    setRotationAngle((prev) => prev + anglePerItem);
  };

  return (
    <div id="rotating-showcase" className="relative py-16 px-4 overflow-hidden bg-[#000000] select-none border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto text-center mb-10 z-10 relative">
        <span className="text-[#ff6b00] font-mono text-sm tracking-widest uppercase block mb-2">
          ★ The Interactive Showcase ★
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 italic uppercase">
          Unveil Tohana's Finest
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-light">
          Hover over categories to pause the rotation, and tap to explore available collections inside the Naya Bazar store.
        </p>
      </div>

      {/* 3D viewport container */}
      <div 
        className="relative w-full h-[380px] md:h-[460px] flex items-center justify-center"
        style={{ perspective: "1100px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Revolving stage */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotationAngle}deg)`,
          }}
        >
          {categories.map((cat, index) => {
            // Angle of this card in the circle
            const cardAngle = index * anglePerItem;
            // Radius of 3D cylinder. Responsive width adjustments.
            // On small mobile screens we orbit tighter, on desktop we orbit spacious.
            const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
            const radius = screenWidth < 640 ? 250 : screenWidth < 1024 ? 380 : 450;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className="absolute w-[200px] h-[280px] md:w-[260px] md:h-[340px] rounded-2xl bg-[#111111] border border-white/10 shadow-2xl overflow-hidden cursor-pointer group select-none transition-all duration-300 hover:border-gold hover:shadow-[0_0_30px_rgba(255,107,0,0.35)]"
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "visible",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Product Card Image */}
                <div className="relative w-full h-2/3 overflow-hidden bg-black">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ease-out"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                  {/* Hot Badge */}
                  {cat.badge && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 bg-[#ff6b00] text-white rounded-full shadow-lg font-mono uppercase tracking-wider animate-pulse">
                      {cat.badge}
                    </span>
                  )}
                  
                  {/* Action Peek overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 duration-300">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6b00] text-white font-bold text-xs transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                      <Eye className="w-3.5 h-3.5" />
                      View Collection
                    </div>
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-4 flex flex-col justify-between h-1/3 bg-[#111111]/95">
                  <div>
                    <h3 className="text-white text-base md:text-lg font-bold group-hover:text-gold transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-1 mt-0.5 font-light">
                      {cat.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <span className="text-xs text-gold font-extrabold font-mono">
                      {cat.count} Items
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Naya Bazar, Tohana
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual click Orbits buttons */}
      <div className="flex items-center justify-center gap-6 mt-2 relative z-20">
        <button
          onClick={handlePrev}
          aria-label="Rotate Left"
          className="p-3 bg-[#111111] border border-white/10 rounded-full text-white hover:bg-[#ff6b00] hover:border-[#ff6b00] hover:text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/40"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-xs font-mono text-gray-500 select-none tracking-widest uppercase">
          Drag / Click to Orbit
        </span>
        <button
          onClick={handleNext}
          aria-label="Rotate Right"
          className="p-3 bg-[#111111] border border-white/10 rounded-full text-white hover:bg-[#ff6b00] hover:border-[#ff6b00] hover:text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/40"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* 3D Stage Floor shadow effect */}
      <div className="absolute left-1/2 bottom-12 -translate-x-1/2 w-[80%] h-[20px] bg-[#ff6b00]/10 blur-2xl rounded-full select-none pointer-events-none" />
    </div>
  );
}
