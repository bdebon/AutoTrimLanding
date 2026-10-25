"use client";
import React from "react";
import ComparePage from "./ComparePage";

const ROWS = [
  { key: "platform", highlight: true },
  { key: "workflow", highlight: true, autoTrimImage: "export" },
  { key: "cleanup", competitor: "yes" },
  { key: "multicam", competitor: "yes" },
  { key: "preview", competitor: "neutral", autoTrimImage: "session" },
  { key: "otherExports" },
  { key: "pricing", highlight: true },
  { key: "bestFor", competitor: "neutral" },
];

const CompareAutocut = () => (
  <ComparePage
    ns="compareAutocut"
    competitorKey="autocut"
    competitorName="AutoCut"
    rows={ROWS}
  />
);

export default CompareAutocut;
