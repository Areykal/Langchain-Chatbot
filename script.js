import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";
import readline from "readline";
import dotenv from "dotenv";

dotenv.config();

// Configuration object
const config = {
  modelName: process.env.MODEL_NAME || "gemini-1.5-flash",
  temperature: parseFloat(process.env.TEMPERATURE) || 0,
  csvFilePath: process.env.CSV_FILE_PATH || "bitextDataset.csv",
  systemPrompt:
    process.env.SYSTEM_PROMPT ||
    "You are a customer support agent called Sophia. You should maintain normal conversation. Help the users with their needs using the following context: {context}.",
  redisUrl: process.env.REDIS_URL,
  redisToken: process.env.REDIS_TOKEN,
};

// Initialize Redis client
const redis = new Redis({
  url: config.redisUrl,
  token: config.redisToken,
});

// ... rest of the code remains the same

// Function to generate a new session ID
function generateSessionId() {
  return uuidv4();
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

// Async function to initialize and run the chatbot
async function runChatbot(userInput, sessionId = null) {
  try {
    sessionId = sessionId || generateSessionId();

    const model = new ChatGoogleGenerativeAI({
      model: config.modelName,
      temperature: config.temperature,
    });

    const loader = new CSVLoader(config.csvFilePath);
    const docs = await loader.load();

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
      context: docs,
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

// Function to get user input (unchanged)
function getUserInput(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Main function to run the interactive chatbot
async function runInteractiveChatbot() {
  let sessionId = null;

  console.log("Welcome to the interactive chatbot!");
  console.log("Type 'exit' to end the conversation.");

  while (true) {
    const userInput = await getUserInput("\nYou: ");

    if (userInput.toLowerCase() === "exit") {
      console.log("Thank you for using the chatbot. Goodbye!");
      break;
    }

    try {
      const { response, sessionId: newSessionId } = await runChatbot(
        userInput,
        sessionId
      );
      sessionId = newSessionId;

      console.log(`\nSophia: ${response}`);
    } catch (error) {
      console.error("An error occurred:", error);
      console.log("Please try again.");
    }
  }
}

// Run the interactive chatbot
runInteractiveChatbot();
