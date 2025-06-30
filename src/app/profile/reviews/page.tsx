"use client";

import { useGetReviewsByUserIdQuery } from "@/lib/review/reviewApi";
import { useAppSelector } from "@/lib/store/hooks";
import { Review } from "@/types/reivew";
import React from "react";

const ReviewsPage = () => {
  const { data: reviews, isLoading, isError } = useGetReviewsByUserIdQuery();
  const nickname = useAppSelector((state) => state.auth.user?.nickname);
  return (
    <div>
      <h1>{nickname}'s Reviews</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading reviews</p>}
      {reviews && reviews.length === 0 && <p>No reviews found</p>}
      {reviews && reviews.length > 0 && (
        <ul>
          {reviews.map((review: Review) => (
            <li key={review.id}>
              <span>{review.user?.nickname}</span>
              <p>{review.rating} / 5</p>
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsPage;
