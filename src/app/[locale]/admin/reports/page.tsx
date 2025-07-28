"use client";
export const runtime = 'edge';

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  deleteReportedReview,
  deleteReviewOnly,
  fetchReports,
  hideReportReview,
} from "@/lib/admin/reports/reportsThunk";
import {
  fetchTicketReports,
  deleteTicketReportedReview,
  deleteTicketReviewOnly,
  hideTicketReportReview,
} from "@/lib/admin/reports/ticketReportsThunk";
import { showConfirm } from "@/utils/showConfirm";
import { ReviewReport } from "@/types/ReviewReport";
import { TicketReport } from "@/types/ticketReport";

type CombinedReport = ReviewReport | TicketReport;

export default function ReportReviewsPage() {
  const [filter, setFilter] = useState<"all" | "lodges" | "tickets">("all");

  const dispatch = useAppDispatch();

  const lodgeReports = useAppSelector((state) => state["admin/reports"]);
  const ticketReports = useAppSelector((state) => state["admin/ticketReports"]);

  const lodgePage = lodgeReports?.page ?? 1;
  const ticketPage = ticketReports?.page ?? 1;
  const limit = lodgeReports?.limit ?? 10;

  useEffect(() => {
    if (filter === "lodges" || filter === "all") {
      dispatch(fetchReports({ page: lodgePage, limit }));
    }
    if (filter === "tickets" || filter === "all") {
      dispatch(fetchTicketReports({ page: ticketPage, limit }));
    }
  }, [dispatch, filter, lodgePage, ticketPage, limit]);

  const handleDeleteFromReports = (reviewId: number, isTicket: boolean) => {
    showConfirm({
      message: "이 신고를 처리하시겠습니까? 신고내역이 삭제됩니다.",
      confirmLabel: "신고 해결",
      cancelLabel: "취소",
      onConfirm: () => {
        if (isTicket) {
          dispatch(deleteTicketReportedReview(reviewId));
        } else {
          dispatch(deleteReportedReview(reviewId));
        }
      },
    });
  };

  const handleHide = (
    reviewId: number,
    isHidden: boolean,
    isTicket: boolean
  ) => {
    showConfirm({
      message: "리뷰를 숨기거나 표시하시겠습니까?",
      confirmLabel: isHidden ? "숨기기" : "표시하기",
      cancelLabel: "취소",
      onConfirm: () => {
        if (isTicket) {
          dispatch(hideTicketReportReview({ reviewId, isHidden }));
        } else {
          dispatch(hideReportReview({ reviewId, isHidden }));
        }
      },
    });
  };

  const handleDeleteReview = (reviewId: number, isTicket: boolean) => {
    showConfirm({
      message: "리뷰를 정말 삭제하시겠습니까?",
      confirmLabel: "삭제",
      cancelLabel: "취소",
      onConfirm: () => {
        if (isTicket) {
          dispatch(deleteTicketReviewOnly(reviewId));
        } else {
          dispatch(deleteReviewOnly(reviewId));
        }
      },
    });
  };

  const combinedList: CombinedReport[] =
    filter === "all"
      ? [
          ...lodgeReports.list.map((r) => ({ ...r, isTicket: false as const })),
          ...ticketReports.list.map((r) => ({ ...r, isTicket: true as const })),
        ]
      : filter === "lodges"
      ? lodgeReports.list.map((r) => ({ ...r, isTicket: false as const }))
      : ticketReports.list.map((r) => ({ ...r, isTicket: true as const }));

  const loading =
    lodgeReports.state === "loading" || ticketReports.state === "loading";
  const error = lodgeReports.error || ticketReports.error;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">신고된 댓글 관리</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          전체 보기
        </button>
        <button
          onClick={() => setFilter("lodges")}
          className={`px-4 py-2 rounded ${
            filter === "lodges" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          숙소 리뷰
        </button>
        <button
          onClick={() => setFilter("tickets")}
          className={`px-4 py-2 rounded ${
            filter === "tickets" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          티켓 리뷰
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && combinedList.length === 0 && <p>No reports found.</p>}

      <div className="space-y-4">
        {combinedList
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((report) => (
            <div
              key={`${report.isTicket ? "ticket" : "lodge"}-${report.id}`}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="mb-2">
                <strong>신고 사유:</strong> {report.reason}
              </div>
              <div className="mb-2">
                <strong>신고자:</strong> {report.user.nickname}
              </div>
              <div className="mb-2">
                <strong>신고된 댓글:</strong> {report.review.comment}
              </div>
              <div className="mb-2">
                <strong>댓글 작성자:</strong>{" "}
                {report.review.user?.nickname ?? "알 수 없음"}
              </div>
              {report.isTicket ? (
                <div className="mb-2">
                  <strong>티켓 타입:</strong>{" "}
                  {report.review.ticketType?.name ?? "알 수 없음"}
                </div>
              ) : (
                <div className="mb-2">
                  <strong>숙소명:</strong>{" "}
                  {report.review.lodge?.name ?? "알 수 없음"}
                </div>
              )}
              <div className="mb-2">
                <strong>숨김처리:</strong>{" "}
                {report.review.isHidden ? "Yes" : "No"}
              </div>

              <div className="flex space-x-2 mt-4">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() =>
                    handleDeleteFromReports(report.review.id, report.isTicket)
                  }
                >
                  신고 해결
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() =>
                    handleDeleteReview(report.review.id, report.isTicket)
                  }
                >
                  리뷰 삭제
                </button>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  onClick={() =>
                    handleHide(
                      report.review.id,
                      !report.review.isHidden,
                      report.isTicket
                    )
                  }
                >
                  {report.review.isHidden ? "표시하기" : "숨기기"}
                </button>
              </div>
            </div>
          ))}

        {/* 페이지네이션 */}
        {filter !== "all" && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              disabled={
                (filter === "lodges" && lodgePage <= 1) ||
                (filter === "tickets" && ticketPage <= 1)
              }
              onClick={() =>
                filter === "lodges"
                  ? dispatch(fetchReports({ page: lodgePage - 1, limit }))
                  : dispatch(
                      fetchTicketReports({ page: ticketPage - 1, limit })
                    )
              }
              className={`px-4 py-2 rounded ${
                (filter === "lodges" && lodgePage <= 1) ||
                (filter === "tickets" && ticketPage <= 1)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } transition`}
            >
              ← 이전
            </button>

            <span className="text-gray-700 font-medium">
              Page {filter === "lodges" ? lodgePage : ticketPage} /{" "}
              {filter === "lodges"
                ? Math.max(1, Math.ceil(lodgeReports.total / limit))
                : Math.max(1, Math.ceil(ticketReports.total / limit))}{" "}
              ({filter === "lodges" ? lodgeReports.total : ticketReports.total}{" "}
              건)
            </span>

            <button
              disabled={
                (filter === "lodges" &&
                  lodgePage >= Math.ceil(lodgeReports.total / limit)) ||
                (filter === "tickets" &&
                  ticketPage >= Math.ceil(ticketReports.total / limit))
              }
              onClick={() =>
                filter === "lodges"
                  ? dispatch(fetchReports({ page: lodgePage + 1, limit }))
                  : dispatch(
                      fetchTicketReports({ page: ticketPage + 1, limit })
                    )
              }
              className={`px-4 py-2 rounded ${
                (filter === "lodges" &&
                  lodgePage >= Math.ceil(lodgeReports.total / limit)) ||
                (filter === "tickets" &&
                  ticketPage >= Math.ceil(ticketReports.total / limit))
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } transition`}
            >
              다음 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
