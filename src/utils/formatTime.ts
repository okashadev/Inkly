export function formatTimeAgo(dateString?: string | Date): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const secondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsPast < 60) {
    return "Just now";
  }

  const minutesPast = Math.floor(secondsPast / 60);
  if (minutesPast < 60) {
    return `${minutesPast} ${minutesPast === 1 ? "minute" : "minutes"} ago`;
  }

  const hoursPast = Math.floor(minutesPast / 60);
  if (hoursPast < 24) {
    return `${hoursPast} ${hoursPast === 1 ? "hour" : "hours"} ago`;
  }

  const daysPast = Math.floor(hoursPast / 24);
  if (daysPast < 30) {
    return `${daysPast} ${daysPast === 1 ? "day" : "days"} ago`;
  }

  const monthsPast = Math.floor(daysPast / 30);
  if (monthsPast < 12) {
    return `${monthsPast} ${monthsPast === 1 ? "month" : "months"} ago`;
  }

  const yearsPast = Math.floor(daysPast / 365);
  return `${yearsPast} ${yearsPast === 1 ? "year" : "years"} ago`;
}
