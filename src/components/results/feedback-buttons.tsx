"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const options = [
  "Dit is het juiste product",
  "Dit is niet hetzelfde product",
  "Kortingscode werkte",
  "Kortingscode werkte niet",
  "Prijs klopt niet",
  "Product is uitverkocht",
];

export function FeedbackButtons() {
  const [sent, setSent] = useState<string | null>(null);

  if (sent) {
    return (
      <p className="text-sm font-medium text-dl-green" role="status">
        Bedankt voor je feedback: “{sent}”. Dit helpt ons toekomstige resultaten te verbeteren.
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm font-semibold text-dl-text">Klopt dit resultaat?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((label) => (
          <Button key={label} size="sm" variant="outline" onClick={() => setSent(label)}>
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
