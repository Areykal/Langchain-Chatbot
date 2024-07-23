import express from "express";
import { runChatbot } from "./chatbot.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to log static file requests
app.use((req, res, next) => {
  console.log(`Static file request: ${req.url}`);
  next();
});

app.use(express.static("public"));
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const { response, sessionId: newSessionId } = await runChatbot(
      message,
      sessionId
    );
    res.json({ message: response, sessionId: newSessionId });
  } catch (error) {
    console.error("Error in chat API:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

// Catch-all route to serve index.html for any unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
