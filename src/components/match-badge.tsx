import { Badge } from "@/components/ui/badge";
import { matchLabelText, type MatchLabel } from "@/lib/types";

const toneMap: Record<MatchLabel, "green" | "blue" | "amber" | "gray"> = {
  exact: "green",
  probable: "blue",
  alternative: "amber",
  other_color: "amber",
  other_size: "amber",
  used: "gray",
  refurbished: "gray",
};

export function MatchBadge({ label, className }: { label: MatchLabel; className?: string }) {
  return (
    <Badge tone={toneMap[label]} className={className}>
      {matchLabelText[label]}
    </Badge>
  );
}
