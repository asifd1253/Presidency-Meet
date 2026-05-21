import "../instrument.mjs"; // Must be the first import
import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { inngest, functions } from "./config/inngest.js";
import { serve } from "inngest/express";
import chatRoutes from "./routes/chat.route.js";

import cors from "cors";

import * as Sentry from "@sentry/node";

const app = express();
const allowedOrigins = [ENV.CLIENT_URL].filter(Boolean);

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(
  cors({
    origin(origin, callback) {
      const isLocalDevOrigin =
        ENV.NODE_ENV !== "production" && /^http:\/\/localhost:\d+$/.test(origin || "");

      if (!origin || allowedOrigins.includes(origin) || isLocalDevOrigin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
); // Enable CORS for all routes
app.use(clerkMiddleware()); //req auth will be available in the request object

app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

app.get("/", (req, res) => {
  res.send("Hello world 123");
});

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);

Sentry.setupExpressErrorHandler(app); // Sentry error handler

const startServer = async () => {
  if (ENV.NODE_ENV !== "production") {
    app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });
  }

  try {
    await connectDB();
  } catch (error) {
    console.error("Server is running, but MongoDB connection failed.");
  }
};

startServer(); // Start the server

export default app;
