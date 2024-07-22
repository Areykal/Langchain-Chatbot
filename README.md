# Chatbot Implementation Documentation

## API keys and tokens

- Google gemini api: https://aistudio.google.com/app/apikey
- Sign up for an Upstash account.
- Upstash Redis: https://upstash.com/docs/redis/overall/getstarted

## Overview

This code implements an interactive chatbot using the LangChain library, Google's Generative AI, and Redis for persistent storage. The chatbot, named Sophia, acts as a customer support agent and maintains conversation history across sessions.

## Dependencies

- @langchain/google-genai
- @langchain/core/prompts
- @langchain/community/document_loaders/fs/csv
- @langchain/core/output_parsers
- @upstash/redis
- uuid
- readline
- dotenv

## Configuration

The `config` object contains essential settings for the chatbot, now using environment variables:

- `modelName`: The Google AI model to use (default: "gemini-1.5-flash")
- `temperature`: Controls the randomness of the AI's responses (default: 0)
- `csvFilePath`: Path to the CSV file containing context data (default: "bitextDataset.csv")
- `systemPrompt`: The initial prompt that defines the chatbot's behavior
- `redisUrl` and `redisToken`: Credentials for Redis connection

## Environment Variables

The project now uses a .env file to manage configuration. Create a .env file in the project root with the following variables:

```
MODEL_NAME=gemini-1.5-flash
TEMPERATURE=0
CSV_FILE_PATH=bitextDataset.csv
SYSTEM_PROMPT="You are a customer support agent called Sophia. You should maintain normal conversation. Help the users with their needs using the following context: {context}."
REDIS_URL=your_redis_url
REDIS_TOKEN=your_redis_token
```

## Key Components

### 1. Redis Client

A Redis client is initialized using the URL and token from environment variables for storing chat history.

### 2. Session Management

- `generateSessionId()`: Creates a unique session ID using UUID
- `storeChatHistory()`: Stores chat messages in Redis, keeping the last 50 messages
- `getSessionHistory()`: Retrieves the chat history for a given session

### 3. Chatbot Core (runChatbot function)

This asynchronous function handles the core chatbot logic:

1. Initializes or continues a session
2. Sets up the AI model and loads context from a CSV file
3. Retrieves chat history
4. Constructs a prompt using the system prompt, chat history, and user input
5. Invokes the AI model to generate a response
6. Stores the interaction in the chat history
7. Returns the response and session ID

### 4. User Interface

- `getUserInput()`: Prompts the user for input using the readline interface
- `runInteractiveChatbot()`: Manages the interactive chat loop, allowing users to converse with the bot until they choose to exit

## Usage

To start the chatbot:

1. Ensure all dependencies are installed: `npm install`
2. Set up your .env file with the necessary configuration
3. Run the script: `node chatbot.js` (assuming the file is named chatbot.js)

The chatbot will initiate an interactive session where users can chat with Sophia until they type 'exit'.

## Error Handling

The implementation includes basic error handling, catching and logging errors that occur during the chatbot's operation.

## Scalability and Performance Considerations

- The chat history is limited to the last 50 messages per session to manage memory usage.
- The use of Redis allows for persistent storage and potential scalability across multiple instances.

## Security Notes

- Sensitive information (Redis URL and token, model settings) is now stored in environment variables.
- Ensure that the .env file is included in .gitignore to prevent accidental exposure of sensitive data.
- The CSV file path is configurable via environment variables; ensure proper file permissions.

## Version Control

When using version control (e.g., Git), ensure the following files are ignored:

- node_modules/
- .env
- Any log files (npm-debug.log, yarn-debug.log, etc.)
- Editor-specific files (.vscode/, .idea/, etc.)
- Operating system files (.DS_Store, Thumbs.db)
- The CSV data file (bitextDataset.csv)

A .gitignore file has been provided to handle these exclusions.

## Future Improvements

1. Implement more robust error handling and recovery mechanisms.
2. Add support for multi-turn conversations within a single API call.
3. Implement rate limiting to prevent abuse.
4. Add authentication for user sessions.
5. Enhance the context loading mechanism to support real-time updates.
6. Implement a configuration management system for easier deployment across different environments.
