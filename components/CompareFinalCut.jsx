"use client";
import React from "react";
import ComparePage from "./ComparePage";

const ROWS = [
  { key: "silences", highlight: true },
  { key: "hesitations", highlight: true },
  { key: "wholeShoot", highlight: true, autoTrimImage: "export" },
  { key: "multicam", competitor: "neutral" },
  { key: "control", competitor: "yes", autoTrimImage: "session" },
  { key: "plugin", competitor: "neutral" },
  { key: "pricing", competitor: "neutral" },
  { key: "bestFor", competitor: "neutral" },
];

const CompareFinalCut = () => (
  <ComparePage
    ns="compareFinalCut"
    competitorKey="finalCut"
    competitorName="Final Cut Pro"
    rows={ROWS}
    howTo
  />
);

export default CompareFinalCut;
