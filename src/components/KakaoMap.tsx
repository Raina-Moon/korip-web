"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  onLocationChange: (lat: number, lng: number, address: string) => void;
  initialPosition?: {
    lat: number;
    lng: number;
    address: string;
  };
  viewOnly?: boolean;
}

const KakaoMap = ({
  onLocationChange,
  initialPosition,
  viewOnly = false,
}: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [placeService, setPlaceService] = useState<any>(null);
  const [infowindow, setInfowindow] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [listOpen, setListOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

        const centerLat = initialPosition?.lat || 33.450701;
        const centerLng = initialPosition?.lng || 126.570667;

        const center = new window.kakao.maps.LatLng(centerLat, centerLng);

        const options = {
          center,
          level: 3,
        };

        const createdMap = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
        const geocoder = new window.kakao.maps.services.Geocoder();

        const markerInstance = new window.kakao.maps.Marker({
          position: center,
          map: createdMap,
        });

        const places = new window.kakao.maps.services.Places();
        const info = new window.kakao.maps.InfoWindow({ zIndex: 1 });

        setMap(createdMap);
        setMarker(markerInstance);
        setPlaceService(places);
        setInfowindow(info);

        if (initialPosition) {
          geocoder.coord2Address(
            centerLng,
            centerLat,
            (result: any, status: any) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const address =
                  result[0].road_address?.address_name ||
                  result[0].address.address_name;
                onLocationChange(centerLat, centerLng, address);
              } else {
                console.error("주소 변환 실패:", status);
              }
            }
          );
        }

        if (!viewOnly) {
          window.kakao.maps.event.addListener(
            createdMap,
            "click",
            function (mouseEvent: any) {
              const latlng = mouseEvent.latLng; // 클릭한 위치의 좌표
              markerInstance.setPosition(latlng); // 마커 위치 변경

              const lat = latlng.getLat(); // 위도
              const lng = latlng.getLng(); // 경도

              geocoder.coord2Address(lng, lat, (result: any, status: any) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  const address =
                    result[0].road_address?.address_name ||
                    result[0].address.address_name;
                  onLocationChange(lat, lng, address); // 부모 컴포넌트로 좌표와 주소 전달
                } else if (
                  status === window.kakao.maps.services.Status.ZERO_RESULT
                ) {
                  onLocationChange(lat, lng, "주소 없음");
                  console.warn("주소가 없는 지역입니다.");
                } else {
                  console.error("주소 변환 실패:", status);
                }
              });
            }
          );
        }
      });
    }
  }, [onLocationChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        listOpen &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setListOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [listOpen]);

  const handleSearch = () => {
    const keyword = inputRef.current?.value;
    if (!keyword || keyword.trim() === "") {
      alert("검색어를 입력해주세요.");
      return;
    }

    placeService.keywordSearch(keyword, (data: any[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(data);
        setListOpen(true);

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
      {!viewOnly && (
        <div ref={wrapperRef} className="mb-2 relative">
          <div className="flex gap-2">
            <input
              type="text"
              ref={inputRef}
              placeholder="장소를 검색하세요"
              className="border px-2 py-1 rounded w-full focus:border-blue-500 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              검색
            </button>
          </div>

          {listOpen && (
            <ul className="absolute top-14 z-10 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((place, idx) => (
                <li
                  key={idx}
                  className="cursor-pointer hover:bg-gray-100 p-2 border-b"
                  onClick={() => {
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

                    setListOpen(false);
                  }}
                >
                  <strong>{place.place_name}</strong>
                  <span className="text-sm text-gray-600">
                    {place.road_address_name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div
        ref={mapRef}
        style={{ width: "100%", height: "400px", border: "1px solid red" }}
      />
    </>
  );
};

export default KakaoMap;
