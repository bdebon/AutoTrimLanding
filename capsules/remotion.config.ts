import { Config } from "@remotion/cli/config";

// H.264 in a yuv420p MP4 plays everywhere (X, LinkedIn, YouTube, Slack, iMessage).
// crf 16 keeps the hatch and the thin bars clean through the platforms' re-encode.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setCrf(16);
Config.setOverwriteOutput(true);
