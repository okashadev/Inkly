export default function calculateReadingTime(content: string): number {
  if (!content || !content.trim()) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
