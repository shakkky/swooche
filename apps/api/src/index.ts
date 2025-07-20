import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./router";

const app = express();
const port = process.env.PORT || 3001;

/**
 * Each person is meant to get a single number.
 * - if they want text capabilities, they will have two numbers.
 *
 * The user flow is:
 * 1. They can sign up completely brand new through their device
 * 2. They are then asked some general questions:
 * - some questions are themselves questions
 * -- "what is your name?"
 * -- "what type of business are you running?"
 * - some questions about their business
 * -- "what is your business name?"
 * -- "would you like to have a mobile number? This lets you send and receive texts."
 * -- "do you want to have a landline number? This lets you share a professional number with your customers for calls."
 *
 **/

app.use(
  cors({
    // todo: add only localhost if running locally
    origin: ["http://localhost:*", "https://*.swooche.com", "*"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// tRPC middleware
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`🚀 tRPC server running at http://localhost:${port}`);
  console.log(`📡 tRPC endpoint: http://localhost:${port}/trpc`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
});
