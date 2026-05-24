import {
  StreamCall,
  StreamVideo,
  type Call,
  type StreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import type { ReactNode } from "react";

type LessonStreamSessionProps = {
  client: StreamVideoClient | null;
  call: Call | null;
  children: ReactNode;
};

export function LessonStreamSession({
  client,
  call,
  children,
}: LessonStreamSessionProps) {
  if (!client || !call) {
    return children;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>{children}</StreamCall>
    </StreamVideo>
  );
}
