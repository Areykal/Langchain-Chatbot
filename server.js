import express from "express";
import { runChatbot } from "./chatbot.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
