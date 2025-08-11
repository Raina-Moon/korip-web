"use client";

import { useSearchParams } from "next/navigation";
import { useGetAvailableTicketQuery } from "@/lib/ticket/ticketApi";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useLocale } from "@/utils/useLocale";
import { useTranslation } from "react-i18next";
import { LodgeWithTickets } from "@/types/ticket";
import TicketSearchBox from "@/components/ticket/TicketReservationSearckBox";
import { useLoadingRouter } from "@/utils/useLoadingRouter";
import {
  getLocalizedLodgeNameFromLodgeWithTickets,
  getLocalizedTicketName,
} from "@/utils/getLocalizedTicketName";

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
  const router = useLoadingRouter();
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
    <div className="relative min-h-screen bg-gray-50 py-10 px-3 sm:px-6 lg:px-8">
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

        <div className="mb-6">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("title")} {lodgesWithTickets ? lodgesWithTickets.length : 0}
            </h1>

            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="sort" className="sr-only">
                {t("sortLabel")}
              </label>
              <select
                id="sort"
                value={selectedSort}
                onChange={handleSortChange}
                aria-label={t("sortLabel")}
                className={`
                  h-9 text-sm border border-gray-300 rounded-lg
                  px-2 md:px-3 bg-white text-gray-700
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  w-auto min-w-[9.5rem] md:min-w-[14rem]
                `}
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
        </div>

        {lodgesWithTickets?.length === 0 ? (
          <p className="text-base sm:text-lg text-gray-600 text-center">
            {t("noResults")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {lodgesWithTickets?.map((lodge: LodgeWithTickets) => (
              <article
                key={lodge.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-primary-500"
              >
                <div className="w-full text-left">
                  <div className="relative w-full overflow-hidden bg-gray-100">
                    <div className="aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/9]">
                      {lodge.images?.[0]?.imageUrl ? (
                        <img
                          src={lodge.images[0].imageUrl}
                          alt={lodge.name}
                          loading="lazy"
                          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                          {t("noImage")}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2">
                      {getLocalizedLodgeNameFromLodgeWithTickets(lodge, locale)}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-yellow-600">
                        ⭐ {lodge.averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-600">
                        {t("reviewsCount", { count: lodge.reviewCount })}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {lodge.address}
                    </p>

                    {lodge.ticketTypes?.length ? (
                      <div className="space-y-2">
                        {lodge.ticketTypes.map((ticket) => (
                          <button
                            key={ticket.id}
                            type="button"
                            className="w-full text-left border border-gray-200 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                            onClick={() => handleTicketClick(ticket.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handleTicketClick(ticket.id);
                            }}
                            aria-label={t("selectTicket", {
                              name: ticket.name,
                            })}
                          >
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {getLocalizedTicketName(ticket, locale)}
                            </p>
                            <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-600">
                              <p>
                                {t("adultPrice", {
                                  price: ticket.adultPrice.toLocaleString(),
                                })}
                              </p>
                              <p>
                                {t("childPrice", {
                                  price: ticket.childPrice.toLocaleString(),
                                })}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
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
