import express from "express";
import bodyParser from "body-parser";
import { jwt } from "twilio";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

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

const AGENT_IDENTITY = "Shakeel"; // This might come from a model or something

type AgentStatus = "ready" | "offline" | "in-call" | "error";

// Temporary in-memory store. Swap with Redis or DB in production.
const agentStatusMap = new Map<string, AgentStatus>();

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
