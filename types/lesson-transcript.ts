export type LessonTranscriptMessage = {
  id: string;
  role: "ai" | "user";
  text: string;
};
