export function scoreLabel(score: number) {
  if (score >= 85) return "strong";
  if (score >= 70) return "watch";
  return "needs-work";
}