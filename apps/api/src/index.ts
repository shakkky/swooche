import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import { createContext } from "./context";

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

// STORY - I should be able to create a new account
// this includes creating a new supabase user
// creating a new account record
// creating a new user record
// create a new device record - just name them via UUID
// creating a new twilioNumber record

// we get the user's devices linked to that account
// each user has an array of "devices"

// STORY - I want to be able to play recordings of voice calls
// An account is created for each user.
// there may be multiple users per account.
// each account has a name, phone number, and email address.
// let's store the twilioNumber record in it's own table.
// when a call comes in, we look up which account the number belongs to
// we get user linked to that account
// we get the user's devices linked to that account
// each user has an array of "devices"
// We the clientName of the user's device
// connect the call using that clientName
// store that call in the database, set a statusCallbackUrl
// a "Call" model, which has an "accountId"
// I need to store these calls somewhere
// I want to be able to play recordings of voice calls

// what can i hardcode for now?
// lets create an empty account record just so we have an accountId
// then also an empty user record just so we have a userId, devices and deviceIds
// log the call under that deviceId, userId and accountId?

// STORY - I want to be able to send and receive texts

app.use(
  cors({
    // todo: add only localhost if running locally
    origin: ["http://localhost:*", "https://*.swooche.com", "*"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(bodyParser.json());

// tRPC middleware with authentication context
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
