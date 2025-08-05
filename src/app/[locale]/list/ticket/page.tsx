"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useGetAvailableTicketQuery } from "@/lib/ticket/ticketApi";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useLocale } from "@/utils/useLocale";
import { useTranslation } from "react-i18next";
import { LodgeWithTickets } from "@/types/ticket";
import TicketSearchBox from "@/components/ticket/TicketReservationSearckBox";

const TicketListPage = () => {
  const { t } = useTranslation("list-ticket");
  const [selectedSort, setSelectedSort] = useState<string>("popularity");

  const searchParams = useSearchParams();

  const region = searchParams.get("region") || "전체";
  const date = searchParams.get("date") || "";
  const adults = searchParams.get("adults") || "1";
  const children = searchParams.get("children") || "0";
  const sort = searchParams.get("sort") || "popularity";

  const [newRegion, setNewRegion] = useState(region);
  const [newDate, setNewDate] = useState(date);
  const [newAdults, setNewAdults] = useState(Number(adults));
  const [newChildren, setNewChildren] = useState(Number(children));

  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  const { data: lodgesWithTickets, isLoading } = useGetAvailableTicketQuery({
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

  const handleRegionChange = (newRegion: string) => {
    setNewRegion(newRegion);
  };
  const handleDateChange = (newDate: string) => {
    setNewDate(newDate);
  };
  const handleAdultsChange = (newAdults: number) => {
    setNewAdults(newAdults);
  };
  const handleChildrenChange = (newChildren: number) => {
    setNewChildren(newChildren);
  };

  const handleSearch = () => {
    const newQuery = new URLSearchParams({
      region: newRegion,
      date: newDate,
      adults: newAdults.toString(),
      children: newChildren.toString(),
      sort: selectedSort,
    }).toString();
    router.push(`/${locale}/list/ticket?${newQuery}`);
  };

  const handleTicketClick = (ticketId: number) => {
    const query = new URLSearchParams({
      region,
      date,
      adults,
      children,
      sort,
    }).toString();
    router.push(`/${locale}/ticket/${ticketId}?${query}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="relative z-50">
          <TicketSearchBox
            region={newRegion}
            date={newDate}
            adults={newAdults}
            children={newChildren}
            setRegion={handleRegionChange}
            setDate={handleDateChange}
            setAdults={handleAdultsChange}
            setChildren={handleChildrenChange}
            handleSearch={handleSearch}
          />
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("title")} {lodgesWithTickets ? lodgesWithTickets.length : 0}
          </h1>
          <div className="flex flex-col">
            <label
              htmlFor="sort"
              className="text-sm font-medium text-gray-900 mb-1"
            >
              {t("sortLabel")}
            </label>
            <select
              id="sort"
              value={selectedSort}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
              aria-label={t("sortLabel")}
            >
              <option value="popularity">{t("sort.popularity")}</option>
              <option value="reviews">{t("sort.reviews")}</option>
              <option value="adult_price_asc">
                {t("sort.adult_price_asc")}
              </option>
              <option value="adult_price_desc">
                {t("sort.adult_price_desc")}
              </option>
              <option value="child_price_asc">
                {t("sort.child_price_asc")}
              </option>
              <option value="child_price_desc">
                {t("sort.child_price_desc")}
              </option>
            </select>
          </div>
        </div>

        {lodgesWithTickets?.length === 0 ? (
          <p className="text-lg text-gray-600 text-center">{t("noResults")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lodgesWithTickets?.map((lodge: LodgeWithTickets) => (
              <div
                key={lodge.id}
                className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-300"
                role="presentation"
                tabIndex={0}
                aria-label={t("selectLodge", { name: lodge.name })}
              >
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                  {lodge.images?.[0]?.imageUrl ? (
                    <img
                      src={lodge.images[0].imageUrl}
                      alt={lodge.name}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                      {t("noImage")}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-gray-900">
                    {lodge.name}
                  </h2>
                  <div className="flex gap-2 text-sm text-yellow-600">
                    <span>⭐ {lodge.averageRating.toFixed(1)}</span>
                    <span className="text-gray-600">
                      {t("reviewsCount", { count: lodge.reviewCount })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{lodge.address}</p>

                  {lodge.ticketTypes.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border border-gray-200 bg-gray-50 rounded-lg p-3 space-y-1 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleTicketClick(ticket.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={t("selectTicket", { name: ticket.name })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleTicketClick(ticket.id);
                        }
                      }}
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {ticket.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t("adultPrice", {
                          price: ticket.adultPrice.toLocaleString(),
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t("childPrice", {
                          price: ticket.childPrice.toLocaleString(),
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TicketListPage;
