"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  setCurrentIndex: (index: number) => void;
}

export default function ImageModal({
  isOpen,
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  setCurrentIndex,
}: ImageModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || images.length === 0) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const onTouchStart: React.TouchEventHandler = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const onTouchEnd: React.TouchEventHandler = (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 40) onPrev();
    if (dx < -40) onNext();
    setTouchStartX(null);
  };

  const total = images.length;
  const idx = Math.min(Math.max(currentIndex, 0), total - 1);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 px-3 sm:px-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <div className="relative w-full max-w-5xl flex items-center justify-between text-white mb-2 sm:mb-3">
        <span className="text-xs sm:text-sm opacity-80">
          {idx + 1} / {total}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative w-full max-w-5xl h-[60vh] sm:h-[70vh] md:h-[80vh] flex items-center justify-center select-none"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          onClick={onPrev}
          aria-label="Previous image"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2
                     inline-flex items-center justify-center
                     w-10 h-10 sm:w-12 sm:h-12 rounded-full
                     bg-white/10 hover:bg-white/20 text-white
                     focus:outline-none focus:ring-2 focus:ring-white z-10"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="absolute inset-0">
          <Image
            src={images[idx]}
            alt={`image-${idx + 1}`}
            fill
            sizes="(max-width: 640px) 100vw, 90vw"
            className="object-contain rounded-md"
            priority
          />
        </div>

        <button
          onClick={onNext}
          aria-label="Next image"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2
                     inline-flex items-center justify-center
                     w-10 h-10 sm:w-12 sm:h-12 rounded-full
                     bg-white/10 hover:bg-white/20 text-white
                     focus:outline-none focus:ring-2 focus:ring-white z-10"
        >
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div
        className="mt-4 sm:mt-6 w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2 sm:gap-3 overflow-x-auto px-1 sm:px-2 snap-x snap-mandatory">
          {images.map((url, i) => {
            const active = i === idx;
            return (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`relative shrink-0 snap-start rounded-md overflow-hidden
                            ${
                              active
                                ? "ring-2 ring-offset-2 ring-blue-400 ring-offset-black/0"
                                : ""
                            }
                            focus:outline-none focus:ring-2 focus:ring-blue-400`}
                style={{ width: "5.5rem", height: "3.5rem" }} // ~ 88x56
              >
                <Image
                  src={url}
                  alt={`thumbnail-${i + 1}`}
                  fill
                  sizes="88px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
