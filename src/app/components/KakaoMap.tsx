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
  const inputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [placeService, setPlaceService] = useState<any>(null);
  const [infowindow, setInfowindow] = useState<any>(null);

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

        const createdMap = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
        const geocoder = new window.kakao.maps.services.Geocoder();

        const markerInstance = new window.kakao.maps.Marker({
          position: createdMap.getCenter(),
          map: createdMap,
        });

        const places = new window.kakao.maps.services.Places();
        const info = new window.kakao.maps.InfoWindow({ zIndex: 1 });

        setMap(createdMap);
        setMarker(markerInstance);
        setPlaceService(places);
        setInfowindow(info);

        window.kakao.maps.event.addListener(
          createdMap,
          "click",
          function (mouseEvent: any) {
            const latlng = mouseEvent.latLng; // 클릭한 위치의 좌표
            markerInstance.setPosition(latlng); // 마커 위치 변경

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

  const handleSearch = () => {
    const keyword = inputRef.current?.value;
    if (!keyword || keyword.trim() === "") {
      alert("검색어를 입력해주세요.");
      return;
    }

    placeService.keywordSearch(keyword, (data: any[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const place = data[0];
        const lat = parseFloat(place.y);
        const lng = parseFloat(place.x);

        const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
        map.setCenter(moveLatLng); // 지도 중심 이동
        marker.setPosition(moveLatLng); // 마커 위치 변경
        infowindow.setContent(
          `<div style="padding:5px;">${place.place_name}</div>`
        );
        infowindow.open(map, marker); // 인포윈도우 열기

        onLocationChange(lat, lng, place.address_name); // 부모 컴포넌트로 좌표와 주소 전달
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };

  return (
    <>
      <Script
        strategy="beforeInteractive"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`}
      />
      <div className="mb-2 flex gap-2">
        <input
          type="text"
          ref={inputRef}
          placeholder="장소를 검색하세요"
          className="border px-2 py-1 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          검색
        </button>
      </div>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "400px", border: "1px solid red" }}
      />
    </>
  );
};

export default KakaoMap;
