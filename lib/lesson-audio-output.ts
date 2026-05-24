import { callManager } from "@stream-io/video-react-native-sdk";

/** Route Foxi teacher audio through the device loudspeaker (not earpiece). */
export function routeLessonAudioToSpeaker(): void {
  callManager.start({
    audioRole: "communicator",
    deviceEndpointType: "speaker",
  });
  callManager.speaker.setForceSpeakerphoneOn(true);
}
