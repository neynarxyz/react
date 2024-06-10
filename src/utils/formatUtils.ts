export function formatToReadableNumber(num: number): string {
  // Cap the number to 1 billion
  const cappedNum = Math.min(num, 1_000_000_000);
  if (cappedNum >= 1_000_000_000) {
    return Math.floor(cappedNum / 100_000_000) / 10 + "B";
  }
  if (cappedNum >= 1_000_000) {
    return Math.floor(cappedNum / 100_000) / 10 + "M";
  }
  if (cappedNum >= 1_000) {
    return Math.floor(cappedNum / 100) / 10 + "K";
  }
  return cappedNum.toString();
}
