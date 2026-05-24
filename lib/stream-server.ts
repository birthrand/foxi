import { StreamClient } from "@stream-io/node-sdk";

import { STREAM_AUDIO_CALL_TYPE } from "@/lib/stream";

const STREAM_API_KEY = process.env.STREAM_API_KEY ?? "";
const STREAM_API_SECRET = process.env.STREAM_API_SECRET ?? "";

export { STREAM_AUDIO_CALL_TYPE };

export function getStreamServerConfigError(): string | null {
  if (!STREAM_API_KEY || !STREAM_API_SECRET) {
    return "Stream API credentials are not configured on the server.";
  }

  return null;
}

export function getStreamServerClient(): StreamClient {
  const configError = getStreamServerConfigError();
  if (configError) {
    throw new Error(configError);
  }

  return new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);
}
