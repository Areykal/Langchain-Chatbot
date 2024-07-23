# Sophia Chatbot User Guide

# IMPORTANT: For this chatbot to work in the context of your company, create a csv file consisting of user inputs and expected chatbot output.
# Accounts needed:
- Google account to access `GOOGLE_API_KEY` from https://aistudio.google.com/app/apikey
- Upstash Redis account to access `REDIS_URL` and `REDIS_TOKEN` for the database at https://console.upstash.com

## Table of Contents
1. Introduction
2. Prerequisites
3. Installation
4. Configuration
5. Running the Chatbot
6. Using the Chatbot
7. Customization
8. Troubleshooting
9. Maintenance

## 1. Introduction

Sophia is an AI-powered chatbot designed to provide customer support. This guide will walk you through the process of setting up, configuring, and using the Sophia chatbot on your website.

## 2. Prerequisites

Before you begin, ensure you have the following:

- Node.js (version 14 or higher) installed on your system
- A Google AI API key for the Gemini model
- An Upstash Redis database set up
- Basic knowledge of JavaScript and web development

## 3. Installation

1. Clone the repository or download the project files to your local machine.

2. Open a terminal and navigate to the project directory.

3. Run the following command to install the required dependencies:
   ```
   npm install
   ```

## 4. Configuration

1. Create a `.env` file in the root directory of the project.

2. Add the following environment variables to the `.env` file:
   ```
   MODEL_NAME=gemini-1.5-flash
   TEMPERATURE=0
   CSV_FILE_PATH=bitextDataset.csv
   SYSTEM_PROMPT="You are a customer support agent called Sophia. You should maintain normal conversation. Help the users with their needs using the following context: {context}."
   REDIS_URL=your_redis_url
   REDIS_TOKEN=your_redis_token
   PORT=3000
   ```

   Replace `your_redis_url` and `your_redis_token` with your actual Upstash Redis credentials.

3. Prepare your context data:
   - Create a CSV file named `bitextDataset.csv` (or use the name you specified in `CSV_FILE_PATH`).
   - Add your context data to this CSV file. Each row should represent a piece of information that Sophia can use to answer questions.

## 5. Running the Chatbot

1. Start the server by running the following command in the terminal:
   ```
   node server.js
   ```

2. You should see a message indicating that the server is running, typically on `http://localhost:3000`.

## 6. Using the Chatbot

1. Open a web browser and navigate to `http://localhost:3000` (or the appropriate address if you've configured a different port or are hosting it elsewhere).

2. You'll see a chat button in the lower right corner of the page.

3. Click on the chat button to open the chat interface.

4. Type your message in the input field and press Enter or click the Send button to interact with Sophia.

5. Sophia will respond based on the context provided in your CSV file and her training.

6. To close the chat interface, click the 'X' button in the top right corner of the chat window.

## 7. Customization

You can customize the appearance of the chatbot by modifying the following files:

- `public/styles.css`: Adjust colors, sizes, and layout of the chat interface.
- `public/index.html`: Modify the structure of the chat widget.
- `public/client.js`: Change the behavior of the chat interface.

To modify Sophia's behavior or knowledge:

- Update the `SYSTEM_PROMPT` in the `.env` file.
- Modify the contents of your `bitextDataset.csv` file.

## 8. Troubleshooting

If you encounter issues:

1. Check the console output for any error messages.
2. Ensure all environment variables are correctly set in the `.env` file.
3. Verify that your Redis database is accessible and the credentials are correct.
4. Make sure your CSV file is properly formatted and accessible.

## 9. Maintenance

To keep your chatbot running smoothly:

1. Regularly update your Node.js and npm packages to the latest versions.
2. Keep your context data (`bitextDataset.csv`) up to date with the latest information.
3. Monitor the chatbot's performance and user feedback to identify areas for improvement.
4. Regularly backup your configuration and context data.

For any additional help or feature requests, please refer to the project's documentation or contact the development team.
