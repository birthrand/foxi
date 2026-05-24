export type StreamAudioLessonStatus =
  | "idle"
  | "loading"
  | "connecting"
  | "joined"
  | "muted"
  | "error"
  | "ended";

export type VisionAgentStatus = "idle" | "connecting" | "connected" | "failed";
