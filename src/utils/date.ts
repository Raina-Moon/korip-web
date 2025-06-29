export const formattedDate = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const diffMins = Math.floor(diff / (1000 * 60));
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if(diffMins < 1) return "방금 전";
    if(diffMins < 60) return `${diffMins}분 전`;
    if(diffHrs < 24) return `${diffHrs}시간 전`;
    if(diffDays < 7) return `${diffDays}일 전`;
    if(diffWeeks < 4) return `${diffWeeks}주 전`;

    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}