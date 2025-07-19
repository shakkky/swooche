import express from "express";
import bodyParser from "body-parser";
import { twiml, Twilio, jwt } from "twilio";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    // todo: add only localhost if running locally
    origin: ["http://localhost:*", "https://*.swooche.com", "*"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

const { AccessToken } = jwt;
const { VoiceGrant } = AccessToken;

const BASE_URL = "https://52f199dbf8d3.ngrok-free.app";
const TWILIO_NUMBER = process.env.TWILIO_PHONE_NUMBER!;
const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const AGENT_IDENTITY = "Shakeel"; // This might come from a model or something

const { VoiceResponse } = twiml;
const CONFERENCE_NAME = "forwarded-call-room";

type AgentStatus = "ready" | "offline" | "in-call" | "error";

// Temporary in-memory store. Swap with Redis or DB in production.
const agentStatusMap = new Map<string, AgentStatus>();

// 🟢 STEP 1: Handle inbound PSTN call → join conference + call WebRTC agent
app.post("/voice", async (req, res) => {
  console.log("📡 TwiML App hit for WebRTC connection. To:", req.body.To);

  const response = new VoiceResponse();

  response.say("This call may be recorded for quality assurance.");
  response.pause({ length: 2 });

  //   const dial = response.dial({
  //     // record: "record-from-answer",
  //     // answerOnBridge: true,
  //     // recordingStatusCallback: `${BASE_URL}/twilio/call-ended`,
  //     // recordingStatusCallbackMethod: "POST",
  //   });

  //   dial.conference(
  //     {
  //       endConferenceOnExit: false,
  //     },
  //     CONFERENCE_NAME
  //   );

  response.dial().client(AGENT_IDENTITY);

  //   try {
  //     const call = await twilioClient.calls.create({
  //       to: "client:agent-1", // 🟢 CHANGED: call WebRTC client instead of mobile
  //       from: TWILIO_NUMBER,
  //       url: `${BASE_URL}/twilio/outbound-join`,
  //     });
  //     console.log("Outbound WebRTC call started:", call.sid);
  //   } catch (err) {
  //     console.error("Failed to start outbound call:", err);
  //   }

  res.type("text/xml").send(response.toString());
});

// 🟢 STEP 2: WebRTC agent joins the same conference after whisper
// app.post("/twilio/outbound-join", (req, res) => {
//   const response = new VoiceResponse();

//   response.say("You are receiving a forwarded call.");
//   const dial = response.dial({ answerOnBridge: true });

//   dial.conference(
//     {
//       endConferenceOnExit: true,
//     },
//     CONFERENCE_NAME
//   );

//   res.type("text/xml").send(response.toString());
// });

// ✅ STEP 3: Handle recording + SMS follow-ups
app.post("/call-ended", async (req, res) => {
  const fromNumber = req.body.From;
  const toNumber = req.body.To;
  const recordingUrl = req.body.RecordingUrl;

  if (fromNumber) {
    try {
      await twilioClient.messages.create({
        body: "Thank you for your call.",
        from: TWILIO_NUMBER,
        to: fromNumber,
      });
      console.log(`SMS sent to caller: ${fromNumber}`);
    } catch (err) {
      console.error("Failed to send SMS to caller:", err);
    }
  }

  if (toNumber) {
    try {
      await twilioClient.messages.create({
        body: "Hope you enjoyed the call.",
        from: TWILIO_NUMBER,
        to: toNumber,
      });
      console.log(`SMS sent to callee: ${toNumber}`);
    } catch (err) {
      console.error("Failed to send SMS to callee:", err);
    }
  }

  if (recordingUrl) {
    console.log("Call recording available at:", `${recordingUrl}.mp3`);
  }

  res.sendStatus(200);
});

// ✅ STEP 4: TwiML App Voice URL — for WebRTC calls via Device.connect() (if used)
app.post("/voice-old", (req, res) => {
  const response = new VoiceResponse();
  const to = req.body.To || CONFERENCE_NAME;

  const dial = response.dial();
  dial.conference(to);

  res.type("text/xml").send(response.toString());
});

// ✅ STEP 5: Token for React app
app.get("/token", (req, res) => {
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_API_KEY!,
    process.env.TWILIO_API_SECRET!,
    { identity: AGENT_IDENTITY.toString(), region: "au1" }
  );

  token.addGrant(
    new VoiceGrant({
      outgoingApplicationSid: process.env.TWIML_APP_SID!,
      incomingAllow: true,
    })
  );

  res.json({ token: token.toJwt(), identity: AGENT_IDENTITY });
});

app.post("/agent/status", (req, res) => {
  const { identity, status } = req.body;

  if (
    typeof identity !== "string" ||
    !["ready", "offline", "in-call", "error"].includes(status)
  ) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  agentStatusMap.set(identity, status);
  console.log(`📡 Agent status updated: ${identity} → ${status}`);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
