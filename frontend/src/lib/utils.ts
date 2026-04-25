export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getStatusStyle(status: "strong" | "partial" | "missing") {
  if (status === "strong")  return { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Strong Match" };
  if (status === "partial") return { color: "text-amber-500",   bg: "bg-amber-500/10",   border: "border-amber-500/20",   label: "Partial Match" };
  return                           { color: "text-rose-500",    bg: "bg-rose-500/10",    border: "border-rose-500/20",    label: "Missing" };
}

export function getPriorityStyle(priority: "high" | "medium" | "low") {
  if (priority === "high")   return { color: "text-rose-500",    bg: "bg-rose-500/10",    label: "High Priority" };
  if (priority === "medium") return { color: "text-amber-500",   bg: "bg-amber-500/10",   label: "Medium Priority" };
  return                            { color: "text-blue-500",    bg: "bg-blue-500/10",    label: "Low Priority" };
}

export function getMatchColor(score: number) {
  if (score >= 75) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-rose-500";
}
