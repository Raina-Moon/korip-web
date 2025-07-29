"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useGetAvailableTicketQuery } from "@/lib/ticket/ticketApi";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useLocale } from "@/utils/useLocale";
import { useTranslation } from "react-i18next";
import { Ticket } from "@/types/ticket";

const TicketListPage = () => {
  const { t } = useTranslation("list-ticket");
  const [selectedSort, setSelectedSort] = useState<string>("popularity");

  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const router = useRouter();

  const locale = useLocale();

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

  useEffect(() => {
    setSelectedSort(sort);
  }, [sort]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSort(e.target.value);

    const newQuery = new URLSearchParams({
      region,
      date,
      adults,
      children,
      sort: e.target.value,
    }).toString();

    router.push(`/${locale}/list/ticket?${newQuery}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-primary-900">
        {t("title")} {tickets ? tickets.length : 0}
      </h1>

      <select
        value={selectedSort}
        onChange={handleSortChange}
        className="border rounded-md p-2 my-4"
      >
        <option value="popularity">{t("sort.popularity")}</option>
        <option value="reviews">{t("sort.reviews")}</option>
        <option value="adult_price_asc">{t("sort.adult_price_asc")}</option>
        <option value="adult_price_desc">{t("sort.adult_price_desc")}</option>
        <option value="child_price_asc">{t("sort.child_price_asc")}</option>
        <option value="child_price_desc">{t("sort.child_price_desc")}</option>
      </select>

      {tickets?.length === 0 ? (
        <p className="text-lg text-gray-600">{t("noResults")}</p>
      ) : (
        tickets?.map((ticket:Ticket) => (
          <div
            key={ticket.id}
            className="flex border p-4 mb-4 rounded-lg hover:shadow transition cursor-pointer gap-4"
            onClick={() => {
              const query = new URLSearchParams({
                region,
                date,
                adults,
                children,
                sort,
              }).toString();
              router.push(`/${locale}/ticket/${ticket.id}?${query}`);
            }}
          >
            <div className="w-32 h-24 flex-shrink-0">
              {ticket.lodgeImage ? (
                <img
                  src={ticket.lodgeImage}
                  alt={ticket.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded">
                  No image
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-bold text-primary-900">
                {ticket.name}
              </h2>
              <div className="flex gap-2 text-sm text-yellow-600 mb-1">
                <span>⭐ {ticket.averageRating?.toFixed(1) ?? "0.0"}</span>
                <span className="text-gray-500">
                  {t("reviewsCount", { count: ticket.reviewCount || 0 })}
                </span>
              </div>

              <p className="text-gray-700">{t("region", { address: ticket.region })}</p>
              <p className="text-gray-700">
                {t("adultPrice", { price: ticket.adultPrice?.toLocaleString() })}
              </p>
              <p className="text-gray-700">
                {t("childPrice", { price: ticket.childPrice?.toLocaleString() })}
              </p>
              <p className="text-gray-700">
                {t("availableAdultTickets", { count: ticket.availableAdultTickets })}
              </p>
              <p className="text-gray-700">
                {t("availableChildTickets", { count: ticket.availableChildTickets })}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TicketListPage;