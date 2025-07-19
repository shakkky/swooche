import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
} from "react";
import { Call, Device } from "@twilio/voice-sdk";
import { Alert } from "react-native";

// Configure your server URL here
const SERVER_URL = __DEV__
  ? "http://192.168.8.131:3001"
  : "https://api.swooche.com";

type IncomingCall = {
  from: string;
  call: Call;
};

type State = {
  identity?: string;
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
      const res = await fetch(`${SERVER_URL}/token`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const { token, identity } = await res.json();
      setIdentity(identity);

      console.log("📱 Creating Twilio Device with identity:", identity);
      const device = new Device(token, {
        logLevel: 1,
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
      await fetch(`${SERVER_URL}/agent/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity, status }),
      });
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
