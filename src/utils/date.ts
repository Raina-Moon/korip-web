export const formattedDate = (dateString: string): string => {
  const utcDate = new Date(dateString);

  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

  const now = new Date();
  const nowKST = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  const diff = nowKST.getTime() - kstDate.getTime();
  const diffMins = Math.floor(diff / (1000 * 60));
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHrs < 24) return `${diffHrs}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffWeeks < 4) return `${diffWeeks}주 전`;

  return kstDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
