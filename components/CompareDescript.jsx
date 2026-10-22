"use client";
import React from "react";
import ComparePage from "./ComparePage";

const ROWS = [
  { key: "approach", competitor: "neutral" },
  { key: "upload", highlight: true },
  { key: "cleanup", competitor: "yes" },
  { key: "wholeShoot", highlight: true, autoTrimImage: "export" },
  { key: "multicam", competitor: "yes" },
  { key: "extras", competitor: "yes" },
  { key: "pricing", highlight: true },
  { key: "bestFor", competitor: "neutral" },
];

const CompareDescript = () => (
  <ComparePage
    ns="compareDescript"
    competitorKey="descript"
    competitorName="Descript"
    rows={ROWS}
  />
);

export default CompareDescript;
