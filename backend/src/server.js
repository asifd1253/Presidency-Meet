import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { inngest, functions } from "./config/inngest.js";
import { serve } from "inngest/express";

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(clerkMiddleware); //req auth will be available in the request object

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => {
  res.send("Hello world 123");
});

// const startServer = async () => {
//   try {
//     await connectDB();
//     if (ENV.NODE_ENV !== "production") {
//       app.listen(ENV.PORT, () => {
//         console.log(`Server running on port ${ENV.PORT}`);
//       });
//     }
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1); // Exit the process with an error code
//   }
// };

// startServer(); // Start the server

// Connect DB once when app is initialized
connectDB();

// ✅ Local development only: run app.listen
if (ENV.NODE_ENV !== "production") {
  const PORT = ENV.PORT || 5000; // default to 5000 locally
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on http://localhost:${PORT}`);
  });
}

export default app;
