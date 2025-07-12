"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center">
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 z-10 hover:bg-gray-600"
        >
          <ArrowLeft />
        </button>

        <Image
          src={images[currentIndex]}
          alt="modal preview"
          layout="fill"
          objectFit="contain"
          className="rounded-md"
          priority
        />

        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 z-10 hover:bg-gray-600"
        >
          <ArrowRight />
        </button>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold z-20"
        >
          ×
        </button>
      </div>

      <div className="flex gap-2 mt-6 overflow-x-auto max-w-full px-4">
        {images.map((url, idx) => (
          <div
            key={idx}
            className={`w-24 h-16 relative cursor-pointer ${
              idx === currentIndex ? "ring-4 ring-blue-400" : ""
            }`}
            onClick={() => setCurrentIndex(idx)}
          >
            <Image
              src={url}
              alt={`thumbnail-${idx}`}
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
