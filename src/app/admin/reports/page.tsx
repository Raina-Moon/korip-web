"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  deleteReportedReview,
  fetchReports,
  hideReportReview,
} from "@/lib/admin/reports/reportsThunk";
import { useDeleteReviewMutation } from "@/lib/review/reviewApi";

export default function ReportReviewsPage() {
  const dispatch = useAppDispatch();
  const { list, state, error } = useAppSelector(
    (state) => state["admin/reports"]
  );

  const [deleteReview] = useDeleteReviewMutation()

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

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
      await deleteReview(reviewId).unwrap();
      alert("리뷰가 성공적으로 삭제되었습니다.");
      dispatch(fetchReports());
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
                onClick={() => handleDeleteReview(report.review.id)}
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
      </div>
    </div>
  );
}
