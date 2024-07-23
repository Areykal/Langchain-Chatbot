# Sophia Chatbot Technical Documentation

## Table of Contents

1. Project Overview
2. Architecture
3. Dependencies
4. File Structure
5. Core Components
   5.1 Server (server.js)
   5.2 Chatbot Logic (chatbot.js)
   5.3 Frontend (index.html, styles.css, client.js)
6. API Endpoints
7. Data Flow
8. Environment Variables
9. Redis Usage
10. CSV Data Format
11. Customization and Extension
12. Performance Considerations
13. Security Considerations
14. Testing
15. Deployment
16. Known Limitations and Future Improvements

## 1. Project Overview

Sophia is an AI-powered chatbot built using Node.js, Express, and the LangChain library. It uses Google's Generative AI (Gemini model) for natural language processing and Upstash Redis for session management and chat history storage.

## 2. Architecture

The project follows a client-server architecture:

- Backend: Node.js with Express
- AI Processing: LangChain with Google Generative AI
- Database: Upstash Redis
- Frontend: HTML, CSS, and JavaScript

## 3. Dependencies

Main dependencies include:

- @langchain/google-genai: For AI model integration
- @langchain/core: Core LangChain functionalities
- @upstash/redis: Redis client for Upstash
- express: Web server framework
- dotenv: Environment variable management

For a complete list, refer to the `package.json` file.

## 4. File Structure

```
project_root/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── client.js
├── server.js
├── chatbot.js
├── bitextDataset.csv
├── .env
├── package.json
└── README.md
```

## 5. Core Components

### 5.1 Server (server.js)

The server is built using Express and serves as the entry point for the application. It handles static file serving and API requests.

Key features:

- Serves static files from the `public` directory
- Defines the `/api/chat` endpoint for chatbot interactions
- Initializes the server on the specified port

### 5.2 Chatbot Logic (chatbot.js)

This file contains the core logic for the chatbot, including AI model initialization, context loading, and chat processing.

Key functions:

- `generateSessionId()`: Creates unique session IDs
- `storeChatHistory()`: Saves chat messages to Redis
- `getSessionHistory()`: Retrieves chat history from Redis
- `loadContext()`: Loads and processes the CSV data
- `runChatbot()`: Main function for processing chat inputs and generating responses

### 5.3 Frontend (index.html, styles.css, client.js)

The frontend provides a user interface for interacting with the chatbot.

- `index.html`: Defines the structure of the chat widget
- `styles.css`: Contains all styling for the chat interface
- `client.js`: Handles user interactions and communicates with the server

## 6. API Endpoints

- POST `/api/chat`
  - Request body: `{ message: string, sessionId: string | null }`
  - Response: `{ message: string, sessionId: string }`

## 7. Data Flow

1. User sends a message through the frontend
2. Client sends a POST request to `/api/chat`
3. Server receives the request and calls `runChatbot()`
4. `runChatbot()` processes the message:
   - Loads context from CSV
   - Retrieves chat history from Redis
   - Generates a response using the AI model
   - Stores the interaction in Redis
5. Server sends the response back to the client
6. Client updates the UI with the bot's response

## 8. Environment Variables

- `MODEL_NAME`: The Google AI model to use
- `TEMPERATURE`: Controls randomness in AI responses
- `CSV_FILE_PATH`: Path to the context data CSV file
- `SYSTEM_PROMPT`: Initial prompt for the AI model
- `REDIS_URL`: Upstash Redis connection URL
- `REDIS_TOKEN`: Upstash Redis authentication token
- `PORT`: Server port number

## 9. Redis Usage

Redis is used for:

- Storing chat history for each session
- Maintaining session persistence

Key format: `chat:{sessionId}`
Value: List of chat messages

## 10. CSV Data Format

The CSV file should contain the context data for the chatbot. Each row represents a piece of information. The file should have at least one column, which will be used as the context.

Example:

```
question,answer
What are your hours?,Our hours are 9 AM to 5 PM, Monday through Friday.
How do I reset my password?,You can reset your password by clicking the "Forgot Password" link on the login page.
```

## 11. Customization and Extension

- Modify `SYSTEM_PROMPT` in `.env` to change the chatbot's personality or base knowledge
- Update `bitextDataset.csv` to alter the chatbot's specific knowledge
- Extend `chatbot.js` to add new features or integrate with other services
- Modify frontend files to change the UI/UX of the chat widget

## 12. Performance Considerations

- The chatbot uses streaming responses for faster initial response times
- Chat history is limited to the last 50 messages per session to manage memory usage
- Consider implementing caching mechanisms for frequently asked questions

## 13. Security Considerations

- Ensure all sensitive data (API keys, Redis credentials) are stored securely and not exposed in client-side code
- Implement rate limiting to prevent abuse
- Sanitize user inputs to prevent injection attacks
- Use HTTPS in production to encrypt data in transit

## 14. Testing

Currently, the project does not have automated tests. Consider implementing:

- Unit tests for individual functions in `chatbot.js`
- Integration tests for the API endpoint
- End-to-end tests simulating user interactions

## 15. Deployment

For deployment:

1. Choose a hosting platform (e.g., Heroku, AWS, DigitalOcean)
2. Set up environment variables on the hosting platform
3. Ensure the chosen platform supports Node.js
4. Set up a production-ready Redis instance (e.g., Upstash Redis production plan)
5. Configure your domain and SSL certificate

## 16. Known Limitations and Future Improvements

- The chatbot's knowledge is limited to the provided CSV data
- No user authentication or multi-user support
- Responses may be inconsistent due to the nature of AI language models
- Consider implementing:
  - User authentication
  - Multi-language support
  - Integration with external APIs for real-time data
  - Advanced analytics and conversation logging

This documentation provides a comprehensive overview of the technical aspects of the Sophia chatbot project. It should serve as a valuable resource for developers working on maintaining or extending the project.
