export function formatTime(unixTimeMs) {
  const msFromYearOneToUnixEpoch = Date.UTC(1970, 0, 1); // ≈ 62135596800000
  const absoluteTime = unixTimeMs + msFromYearOneToUnixEpoch;

  const date = new Date(absoluteTime);

  const pad = (num, size = 2) => String(num).padStart(size, "0");
  const padMs = (num) => String(num).padStart(3, "0");

  const day = pad(date.getUTCDate());
  const month = pad(date.getUTCMonth() + 1);
  const year = date.getUTCFullYear();

  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const milliseconds = padMs(date.getUTCMilliseconds());

  const datePart = `${day}/${month}/${year}`;
  const timePart = `${hours}:${minutes}:${seconds}:${milliseconds}`;

  return [datePart, timePart];
}
