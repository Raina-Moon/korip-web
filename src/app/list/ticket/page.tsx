"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useGetAvailableTicketQuery } from "@/lib/ticket/ticketApi";
import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";

const TicketListPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const router = useRouter();

  const region = searchParams.get("region") || "전체";
  const date = searchParams.get("date") || "";
  const adults = searchParams.get("adults") || "1";
  const children = searchParams.get("children") || "0";
  const sort = searchParams.get("sort") || "popularity";

  const { data: tickets, isLoading } = useGetAvailableTicketQuery({
    region,
    date,
    adults,
    children,
    sort,
  });

  useEffect(() => {
    if (isLoading) dispatch(showLoading());
    else dispatch(hideLoading());
  }, [isLoading, dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-primary-900">
        티켓 검색 결과 {tickets ? tickets.length : 0}
      </h1>

      {tickets?.length === 0 ? (
        <p className="text-lg text-gray-600">검색 결과가 없습니다.</p>
      ) : (
        tickets?.map((ticket) => (
          <div
            key={ticket.id}
            className="border p-4 mb-4 rounded-lg hover:shadow transition cursor-pointer"
            onClick={() => {
              const query = new URLSearchParams({
                region,
                date,
                adults,
                children,
                sort,
              }).toString();
              router.push(`/ticket/${ticket.id}?${query}`);
            }}
          >
            <h2 className="text-lg font-bold text-primary-900">
              {ticket.name}
            </h2>
            <p className="text-gray-700">지역: {ticket.region}</p>
            <p className="text-gray-700">이용 날짜: {ticket.date}</p>
            <p className="text-gray-700">설명: {ticket.description}</p>
            <p className="text-gray-700">
              성인 가격: {ticket.adultPrice?.toLocaleString()}원
            </p>
            <p className="text-gray-700">
              아동 가격: {ticket.childPrice?.toLocaleString()}원
            </p>
            <p className="text-gray-700">
              남은 성인 티켓: {ticket.availableAdultTickets}
            </p>
            <p className="text-gray-700">
              남은 아동 티켓: {ticket.availableChildTickets}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default TicketListPage;
