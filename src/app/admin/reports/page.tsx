"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  deleteReportedReview,
  deleteReviewOnly,
  fetchReports,
  hideReportReview,
} from "@/lib/admin/reports/reportsThunk";
// import { useDeleteReviewMutation } from "@/lib/review/reviewApi";

export default function ReportReviewsPage() {
  const dispatch = useAppDispatch();
  const { list, state, error, total, page, limit } = useAppSelector(
    (state) => state["admin/reports"]
  );

  // const [deleteReview] = useDeleteReviewMutation()

  useEffect(() => {
    dispatch(fetchReports({ page, limit }));
  }, [dispatch, page, limit]);

  const handleDeleteFromReports = (reviewId: number) => {
    dispatch(deleteReportedReview(reviewId));
  };

  const handleHide = (reviewId: number, isHidden: boolean) => {
    if (confirm("리뷰를 숨기거나 표시하시겠습니까?")) {
      dispatch(hideReportReview({ reviewId, isHidden }));
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      dispatch(deleteReviewOnly(reviewId));
      alert("리뷰가 성공적으로 삭제되었습니다.");
      dispatch(fetchReports({ page, limit }));
    } catch (error) {
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">신고된 댓글</h1>

      {state === "loading" && <p>Loading...</p>}
      {state === "failed" && <p className="text-red-500">{error}</p>}
      {state === "succeeded" && list.length === 0 && <p>No reports found.</p>}

      <div className="space-y-4">
        {list.map((report) => (
          <div
            key={report.id}
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
              <strong>댓글 작성자:</strong> {report.review.user.nickname}
            </div>
            <div className="mb-2">
              <strong>숙소명:</strong> {report.review.lodge.name}
            </div>
            <div className="mb-2">
              <strong>숨김처리:</strong> {report.review.isHidden ? "Yes" : "No"}
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDeleteFromReports(report.review.id)}
              >
                신고 해결
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => {
                  if (report?.review?.id !== null) {
                    handleDeleteReview(report.review.id);
                  } else {
                    alert("리뷰 ID가 없습니다.");
                  }
                }}
              >
                리뷰 삭제
              </button>
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                onClick={() =>
                  handleHide(report.review.id, !report.review.isHidden)
                }
              >
                {report.review.isHidden ? "표시하기" : "숨기기"}
              </button>
            </div>
          </div>
        ))}

        {state === "succeeded" && total > 0 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              disabled={page <= 1}
              onClick={() => dispatch(fetchReports({ page: page - 1, limit }))}
              className={`px-4 py-2 rounded ${
                page <= 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } transition`}
            >
              ← 이전
            </button>

            <span className="text-gray-700 font-medium">
              Page {page} / {Math.max(1, Math.ceil(total / limit))} ({total} 건)
            </span>

            <button
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => dispatch(fetchReports({ page: page + 1, limit }))}
              className={`px-4 py-2 rounded ${
                page >= Math.ceil(total / limit)
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
