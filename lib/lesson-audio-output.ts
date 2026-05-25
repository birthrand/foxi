import { callManager } from "@stream-io/video-react-native-sdk";
import { audioDeviceModuleEvents } from "@stream-io/react-native-webrtc";
import { Platform } from "react-native";

type AndroidAudioDeviceStatus = Awaited<
  ReturnType<typeof callManager.android.getAudioDeviceStatus>
>;

const INTERNAL_ANDROID_OUTPUTS = new Set(["Speaker", "Earpiece", "Unknown"]);
const IOS_BUILTIN_OUTPUT_PORTS = new Set(["Receiver", "Speaker", "N/A"]);

let lessonCallManagerStarted = false;

function isExternalAndroidAudioDevice(deviceName: string): boolean {
  return (
    deviceName === "Wired Headset" ||
    !INTERNAL_ANDROID_OUTPUTS.has(deviceName)
  );
}

function hasExternalAndroidAudioOutput(
  status: AndroidAudioDeviceStatus,
): boolean {
  return status.devices.some(isExternalAndroidAudioDevice);
}

function getPreferredExternalAndroidDevice(
  status: AndroidAudioDeviceStatus,
): string | null {
  if (status.devices.includes("Wired Headset")) {
    return "Wired Headset";
  }

  return (
    status.devices.find((device) => isExternalAndroidAudioDevice(device)) ??
    null
  );
}

function parseIosOutputPortFromAudioLog(log: string): string | null {
  const match = log.match(/^\s*Output Port:\s*(.+)$/m);
  return match?.[1]?.trim() ?? null;
}

function hasExternalIosAudioOutput(): boolean {
  const outputPort = parseIosOutputPortFromAudioLog(
    callManager.getAudioStateLog(),
  );

  return Boolean(outputPort && !IOS_BUILTIN_OUTPUT_PORTS.has(outputPort));
}

async function hasExternalAudioOutput(): Promise<boolean> {
  if (Platform.OS === "android") {
    const status = await callManager.android.getAudioDeviceStatus();
    return hasExternalAndroidAudioOutput(status);
  }

  if (Platform.OS === "ios") {
    return hasExternalIosAudioOutput();
  }

  return false;
}

async function applyLessonAudioRoute(): Promise<void> {
  const hasExternalOutput = await hasExternalAudioOutput();

  if (!lessonCallManagerStarted) {
    callManager.start({
      audioRole: "communicator",
      deviceEndpointType: hasExternalOutput ? "earpiece" : "speaker",
    });
    lessonCallManagerStarted = true;
  }

  callManager.speaker.setForceSpeakerphoneOn(!hasExternalOutput);

  if (Platform.OS === "android" && hasExternalOutput) {
    const status = await callManager.android.getAudioDeviceStatus();
    const preferredDevice = getPreferredExternalAndroidDevice(status);

    if (preferredDevice) {
      callManager.android.selectAudioDevice(preferredDevice);
    }
  }
}

/** Route lesson audio to speaker only when no headphones/Bluetooth are connected. */
export async function routeLessonAudioOutput(): Promise<void> {
  await applyLessonAudioRoute();
}

export function resetLessonAudioOutputState(): void {
  lessonCallManagerStarted = false;
}

export function subscribeToLessonAudioOutputChanges(
  onChange: () => void,
): () => void {
  if (Platform.OS === "android") {
    return callManager.android.addAudioDeviceChangeListener(() => {
      onChange();
    });
  }

  if (Platform.OS === "ios") {
    audioDeviceModuleEvents.setupListeners();
    const subscription = audioDeviceModuleEvents.addDevicesUpdatedListener(
      () => {
        onChange();
      },
    );

    return () => subscription.remove();
  }

  return () => {};
}
