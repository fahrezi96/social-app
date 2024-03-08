export function summary(text: string, n: number = 10) {
  if (text.length <= n) return text;
  return text.substring(0, n) + '...';
}
