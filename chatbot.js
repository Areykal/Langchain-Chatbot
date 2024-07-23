import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

// Configuration object
const config = {
  modelName: process.env.MODEL_NAME || "gemini-1.5-flash",
  temperature: parseFloat(process.env.TEMPERATURE) || 0,
  csvFilePath: process.env.CSV_FILE_PATH || "bitextDataset.csv",
  systemPrompt:
    process.env.SYSTEM_PROMPT ||
    "You are a customer support agent called Sophia. You should maintain greetings. You must only answer the user questions based on this context: {context}.",
  redisUrl: process.env.REDIS_URL,
  redisToken: process.env.REDIS_TOKEN,
};

// Initialize Redis client
const redis = new Redis({
  url: config.redisUrl,
  token: config.redisToken,
});

// Function to generate a new session ID
function generateSessionId() {
  const date = new Date();
  const timestamp = date.toISOString().slice(0, 10).replace(/-/g, "");
  const sequence = String(
    date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
  ).padStart(5, "0");
  return `${timestamp}-${sequence}`;
}

// Simplified function to store chat history
async function storeChatHistory(sessionId, message) {
  const key = `chat:${sessionId}`;
  await redis.rpush(key, message);
  await redis.ltrim(key, -50, -1); // Keep only the last 50 messages for this session
}

// Simplified function to retrieve chat history for a session
async function getSessionHistory(sessionId) {
  const key = `chat:${sessionId}`;
  return await redis.lrange(key, 0, -1);
}

// Function to load and process the CSV data
async function loadContext() {
  const loader = new CSVLoader(config.csvFilePath);
  const docs = await loader.load();
  return docs.map((doc) => doc.pageContent).join("\n");
}

// Async function to initialize and run the chatbot
export async function runChatbot(userInput, sessionId = null) {
  try {
    sessionId = sessionId || generateSessionId();

    const model = new ChatGoogleGenerativeAI({
      model: config.modelName,
      temperature: config.temperature,
    });

    const context = await loadContext();
    const history = await getSessionHistory(sessionId);

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", config.systemPrompt],
      ...history.map((message, index) => [
        index % 2 === 0 ? "human" : "ai",
        message,
      ]),
      ["human", "{input}"],
    ]);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    const response = await chain.invoke({
      context: context,
      input: userInput,
    });

    await storeChatHistory(sessionId, userInput);
    await storeChatHistory(sessionId, response);

    return { response, sessionId };
  } catch (error) {
    console.error("Error running chatbot:", error);
    throw error;
  }
}
