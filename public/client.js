let sessionId = null;

document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");

  sendButton.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
      addMessageToChat("user", message);
      userInput.value = "";
      fetchBotResponse(message);
    }
  }

  function addMessageToChat(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", `${sender}-message`);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function fetchBotResponse(message) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, sessionId }),
      });
      const data = await response.json();
      sessionId = data.sessionId;
      addMessageToChat("bot", data.message);
    } catch (error) {
      console.error("Error:", error);
      addMessageToChat(
        "bot",
        "Sorry, I encountered an error. Please try again."
      );
    }
  }
});
