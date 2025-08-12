"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  address: string;
}

const KakaoMapModal = ({
  isOpen,
  onClose,
  lat,
  lng,
  address,
}: KakaoMapModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  const initMap = () => {
    if (!isOpen || !mapRef.current || !window.kakao) return;

    window.kakao.maps.load(() => {
      const center = new window.kakao.maps.LatLng(lat, lng);

      if (mapInstance.current) {
        mapInstance.current.setCenter(center);
        new window.kakao.maps.Marker({
          position: center,
          map: mapInstance.current,
        });
        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;max-width:240px;word-break:break-word;">${address}</div>`,
        });
        infoWindow.open(mapInstance.current);
        return;
      }

      const map = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 3,
      });
      mapInstance.current = map;

      new window.kakao.maps.Marker({ position: center, map });

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;max-width:240px;word-break:break-word;">${address}</div>`,
      });
      infoWindow.open(map, new window.kakao.maps.Marker({ position: center }));
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    if (window.kakao?.maps) {
      initMap();
    }
  }, [isOpen, lat, lng, address]);

  if (!isOpen) return null;

  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-3 sm:px-4 py-4"
        onClick={onBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kakao-map-title"
      >
        <div
          className="w-full max-w-md sm:max-w-xl md:max-w-2xl
                     bg-white rounded-t-2xl sm:rounded-2xl shadow-xl
                     overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end px-4 sm:px-5 py-3 border-b">
            <button
              onClick={onClose}
              aria-label="Close"
              className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="px-4 sm:px-5 py-2">
            <p className="text-xs sm:text-sm text-gray-600 break-words">
              {address}
            </p>
          </div>

          <div
            ref={mapRef}
            className="w-full h-[50vh] sm:h-[60vh] md:h-[500px]"
            aria-label="Kakao map"
          />

          <div className="px-4 sm:px-5 py-3 border-t">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              닫기
            </button>
          </div>
        </div>
      </div>

      <Script
        id="kakao-map-sdk"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
        strategy="afterInteractive"
        onReady={() => {
          if (isOpen) initMap();
        }}
      />
    </>
  );
};

export default KakaoMapModal;
