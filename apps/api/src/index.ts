import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import { createContext } from "./context";

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
