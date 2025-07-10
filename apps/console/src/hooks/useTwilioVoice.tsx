import { useState } from "react";
import { Call, Device } from "@twilio/voice-sdk";

type IncomingCall = {
  from: string;
  call: Call; //Connection;
};

export const useTwilioVoice = () => {
  const [started, setStarted] = useState(false);
  const [identity, setIdentity] = useState<string>();

  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [callDuration, setCallDuration] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);

  const doTheThing = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("🎤 Got audio stream:", stream);

    stream.getTracks().forEach((track) => track.stop());
  };

  function addDeviceListeners(device) {
    device.on("registered", function () {
      console.log("Twilio.Device Ready to make and receive calls!");
    });

    device.on("error", function (error) {
      console.log("Twilio.Device Error: " + error.message);
      setError(error.message);
    });

    device.on("incoming", (call) => {
      console.log(`Incoming call from ${call.parameters.From}`);
      const from = call.parameters.From || "Unknown";
      setIncomingCall({ from, call });
    });
  }

  const start = async () => {
    setStarted(true);
    const res = await fetch(`https://12fd9066851a.ngrok-free.app/token`);
    const { token, identity } = await res.json();
    console.log("🟢 Got Twilio token:", token, identity);
    setIdentity(identity);

    try {
      const device = new Device(token, {
        // edge: ["sydney"],
        logLevel: 1,
        // codecPreferences: ["opus", "pcmu"],
      });

      addDeviceListeners(device);
      // Device must be registered in order to receive incoming calls
      device.register();
    } catch (e) {
      console.error("Failed to initialize device:", e);
    }
  };

  const acceptCall = () => {
    console.log("Accepting call from:", incomingCall?.from);
    incomingCall?.call?.accept();
    setIncomingCall(null);

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Clear the timer when the call ends
    incomingCall?.call?.on("disconnect", () => {
      clearInterval(timer);
      setCallDuration(0);
    });
  };

  const rejectCall = () => {
    incomingCall?.call?.reject();
    setIncomingCall(null);
  };

  const callStatus = incomingCall?.call.status();

  return {
    callStatus,
    callDuration,
    identity,
    start,
    started,
    error,
    incomingCall,
    acceptCall,
    rejectCall,
  };
};
