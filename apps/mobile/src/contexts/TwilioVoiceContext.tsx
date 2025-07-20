import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
} from "react";
import { Call, Device } from "@twilio/voice-sdk";
import { Alert, Platform } from "react-native";
import { Audio } from "expo-av";

// Import WebRTC polyfills for React Native
import "../utils/webrtc-polyfill";
// Import tRPC client
import { trpc } from "../utils/trpc";

type IncomingCall = {
  from: string;
  call: Call;
};

type LinkedNumber = {
  id: string;
  number: string;
  capabilities: ("calls" | "texts")[];
};

type State = {
  identity?: string;
  numbers?: LinkedNumber[];
  started: boolean;
  error: string | null;
  incomingCall: IncomingCall | null;
  callDuration: number;
  callStatus: Call.State | undefined;
  deviceState: Device.State | undefined;
  start: () => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
};

const TwilioVoiceContext = createContext<State | undefined>(undefined);

export const useTwilioVoice = (): State => {
  const ctx = useContext(TwilioVoiceContext);
  if (!ctx) throw new Error("useTwilioVoice must be used inside Provider");
  return ctx;
};

export const TwilioVoiceProvider = ({ children }: { children: ReactNode }) => {
  const [started, setStarted] = useState(false);
  const [identity, setIdentity] = useState<string>();
  const [numbers, setNumbers] = useState<LinkedNumber[]>();
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [callStatus, setCallStatus] = useState<Call.State | undefined>();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const deviceRef = useRef<Device | null>(null);

  const deviceState = device?.state;

  const acceptCall = () => {
    const call = incomingCall?.call;
    if (!call) return;

    console.log("✅ Accepting call from:", incomingCall?.from);
    call.accept();
  };

  const rejectCall = () => {
    incomingCall?.call?.reject();
    setIncomingCall(null);
  };

  const start = async () => {
    try {
      setStarted(true);
      setError(null);

      console.log("🔄 Starting Twilio Voice device...");

      // Request audio permissions first
      if (Platform.OS !== "web") {
        console.log("🎤 Requesting audio permissions...");
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Audio permission not granted");
        }

        // Set audio mode for voice calls
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log("✅ Audio permissions granted and mode set");
      }

      const { token, identity, numbers } = await trpc.getToken.query();
      console.log("Token response:", {
        token: token ? "exists" : "null",
        identity,
        numbers,
      });
      setIdentity(identity);
      setNumbers(numbers);

      console.log("📱 Creating Twilio Device with identity:", identity);
      const device = new Device(token, {
        logLevel: 1,
        // Disable getUserMedia for React Native since we handle it with polyfills
        getUserMedia:
          Platform.OS === "web" ? undefined : () => Promise.resolve({} as any),
      });

      await device.register();
      deviceRef.current = device;
      bindListeners();

      console.log("✅ Twilio Voice device started successfully");
    } catch (err) {
      console.error("❌ Error starting Twilio Voice device:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setStarted(false);
    }
  };

  const reportStatus = async (
    status: "ready" | "offline" | "in-call" | "error"
  ) => {
    if (!identity) return;

    try {
      console.log("📊 Reporting agent status:", status);
      await trpc.updateAgentStatus.mutate({ identity, status });
    } catch (err) {
      console.warn("⚠️ Failed to report agent status:", err);
    }
  };

  const bindListeners = () => {
    if (!deviceRef.current) return;
    const device = deviceRef.current;

    device.on("registered", async () => {
      console.log("🟢 Twilio.Device registered");
      await reportStatus("ready");
    });

    device.on("incoming", (call) => {
      console.log("📞 Incoming call from:", call.parameters.From);
      setIncomingCall({ from: call.parameters.From, call });

      // Show alert for incoming call
      Alert.alert("Incoming Call", `Call from ${call.parameters.From}`, [
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            call.reject();
            setIncomingCall(null);
          },
        },
        {
          text: "Accept",
          onPress: () => {
            call.accept();
          },
        },
      ]);

      const events = ["accept", "reject", "disconnect", "cancel"];
      events.forEach((event) => {
        call.on(event, async () => {
          setCallStatus(call.status());

          if (["reject", "disconnect", "cancel"].includes(event)) {
            await reportStatus("ready");
          }

          if (event === "cancel") {
            setIncomingCall(null);
          }

          if (event === "reject") {
            console.log("❌ Call rejected");
            setIncomingCall(null);
          }

          if (event === "disconnect") {
            console.log("❌ Call disconnected");
            clearInterval(timerRef.current!);
            setCallDuration(0);
          }

          if (event === "accept") {
            console.log("✅ Call accepted");
            setIncomingCall(null);
            await reportStatus("in-call");
            timerRef.current = setInterval(() => {
              setCallDuration((prev) => prev + 1);
            }, 1000);
          }
        });
      });
    });

    device.on("error", async (err) => {
      console.error("❌ Twilio.Device error", err);

      // Handle specific getUserMedia errors
      if (
        err.message.includes("getUserMedia") ||
        err.message.includes("NotSupportedError")
      ) {
        console.log(
          "🔧 getUserMedia error detected, this might be expected in React Native"
        );
        // Don't set this as a fatal error since we have polyfills
        return;
      }

      setError(err.message);
      await reportStatus("error");
    });

    deviceRef.current = device;
    setDevice(device);
  };

  const endCall = async () => {
    if (deviceRef.current) {
      deviceRef.current.disconnectAll();
      clearInterval(timerRef.current!);
      setCallDuration(0);
      await reportStatus("ready");
    }
  };

  return (
    <TwilioVoiceContext.Provider
      value={{
        identity,
        numbers,
        started,
        error,
        incomingCall,
        callDuration,
        callStatus,
        deviceState,
        start,
        acceptCall,
        rejectCall,
        endCall,
      }}
    >
      {children}
    </TwilioVoiceContext.Provider>
  );
};
