"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";

interface KakaoMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  address: string;
}

const KakaoMapModal = ({ isOpen, onClose, lat, lng, address }: KakaoMapModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (!window.kakao) return;

      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const center = new window.kakao.maps.LatLng(lat, lng);
        const map = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: 3,
        });

        const marker = new window.kakao.maps.Marker({
          position: center,
          map,
        });

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;">${address}</div>`,
        });

        infoWindow.open(map, marker);
      });
    };

    document.head.appendChild(script);
  }, [isOpen, lat, lng, address]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl overflow-hidden shadow-xl max-w-2xl w-full"
        >
          <div className="p-4 border-b font-semibold">지도 보기</div>
          <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
          <button
            onClick={onClose}
            className="w-full py-2 bg-red-500 text-white font-semibold"
          >
            닫기
          </button>
        </div>
      </div>
      <Script
        strategy="beforeInteractive"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
      />
    </>
  );
};

export default KakaoMapModal;
