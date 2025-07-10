import { useTwilioVoice } from "./hooks/useTwilioVoice";
import { Call } from "@twilio/voice-sdk";
import "./IncomingCall.css"; // Optional for styling

export const IncomingCallUI = () => {
  const {
    identity,
    callStatus,
    callDuration,
    incomingCall,
    acceptCall,
    rejectCall,
    error,
    start,
    started,
  } = useTwilioVoice();

  // when the call is connected, we want to show how long the call has been going on
  // and allow the user to end the call

  if (callStatus === Call.State.Open) {
    return (
      <div className="call-status">
        {callStatus}
        <h3>📞 Call Connected</h3>
        <p>
          Duration: {Math.floor(callDuration / 60)}:{callDuration % 60}
        </p>
        <button onClick={rejectCall}>❌ End Call</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  if (incomingCall) {
    return (
      <div className="incoming-call-popup">
        {callStatus}
        <h3>📞 Incoming Call</h3>
        <p>From: {incomingCall.from}</p>
        <div className="actions">
          <button onClick={acceptCall}>✅ Answer</button>
          <button onClick={rejectCall}>❌ Decline</button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  if (identity) {
    return (
      <div className="call-status">
        {callStatus}
        <h3>🔓 Phone System Ready</h3>
        <p>Identity: {identity}</p>
        <p>Status: {callStatus}</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      {!started && <button onClick={start}>🔓 Start Phone System</button>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};
