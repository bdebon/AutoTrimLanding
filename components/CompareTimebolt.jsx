"use client";
import React from "react";
import ComparePage from "./ComparePage";

const ROWS = [
  {
    key: "importWorkflow",
    highlight: true,
    autoTrimImage: "session",
    competitorImage: "/assets/img/Timebolt/import.jpg",
  },
  {
    key: "processing",
    highlight: true,
    competitorImage: "/assets/img/Timebolt/one-file-at-a-time.jpg",
  },
  { key: "finalOutput", highlight: true, autoTrimImage: "export" },
  { key: "hesitations", competitor: "yes" },
  { key: "multicam" },
  { key: "preview", competitor: "yes" },
  { key: "pricing", competitor: "neutral" },
  { key: "bestFor", competitor: "neutral" },
];

const CompareTimebolt = () => (
  <ComparePage
    ns="compareTimebolt"
    competitorKey="timebolt"
    competitorName="TimeBolt"
    rows={ROWS}
  />
);

export default CompareTimebolt;
