"use client";
import React from "react";
import ComparePage from "./ComparePage";

const ROWS = [
  { key: "workflow", highlight: true, autoTrimImage: "session" },
  { key: "silences", competitor: "yes" },
  { key: "hesitations", competitor: "yes" },
  { key: "output", highlight: true, autoTrimImage: "export" },
  { key: "multicam", competitor: "neutral" },
  { key: "otherNles" },
  { key: "pricing", competitor: "neutral" },
  { key: "bestFor", competitor: "neutral" },
];

const ComparePremiere = () => (
  <ComparePage
    ns="comparePremiere"
    competitorKey="premiere"
    competitorName="Premiere Pro"
    rows={ROWS}
  />
);

export default ComparePremiere;
