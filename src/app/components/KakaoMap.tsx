"use client";

import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  onLocationChange: (lat: number, lng: number, address: string) => void;
}

const KakaoMap = ({ onLocationChange }: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => initMap();
    document.head.appendChild(script);

    function initMap() {
      if (!window.kakao) return; // kakao 객체가 없으면 실행하지 않음

      window.kakao.maps.load(() => {
        var container = mapRef.current; // 지도를 표시할 div
        if (!container) return; // container가 없으면 실행하지 않음

        var options = {
          //지도를 생성할 때 필요한 기본 옵션
          center: new window.kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
          level: 3, //지도의 레벨(확대, 축소 정도)
        };

        const map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
        const geocoder = new window.kakao.maps.services.Geocoder();

        const marker = new window.kakao.maps.Marker({
          position: map.getCenter(),
          map: map,
        });

        window.kakao.maps.event.addListener(
          map,
          "click",
          function (mouseEvent: any) {
            const latlng = mouseEvent.latLng; // 클릭한 위치의 좌표
            marker.setPosition(latlng); // 마커 위치 변경

            const lat = latlng.getLat(); // 위도
            const lng = latlng.getLng(); // 경도

            geocoder.coord2Address(lat, lng, (result: any, status: any) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const address = result[0].address.address_name; // 주소
                onLocationChange(lat, lng, address); // 부모 컴포넌트로 좌표와 주소 전달
              } else {
                console.error("주소 변환 실패:", status);
              }
            });
          }
        );
      });
    }
  }, [onLocationChange]);

  return (
    <>
      <Script
        strategy="beforeInteractive"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`}
      />
      <div
        ref={mapRef}
        className="w-full"
        style={{ width: "100%", height: "400px", border: "1px solid red" }}
      />
    </>
  );
};

export default KakaoMap;
