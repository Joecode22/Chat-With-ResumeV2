document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", async () => {
    const resultText = document.getElementById("resultText");
    resultText.innerText = "Loading...";

    const prompt = document.getElementById("promptInput").value;
    const eventSource = new EventSource(`/api/generate?prompt=${encodeURIComponent(prompt)}`);

    let messageBuffer = '';

    eventSource.onmessage = (event) => {
      messageBuffer += event.data;

      // Try to parse the accumulated data
      try {
        const data = JSON.parse(messageBuffer);

        if (!Array.isArray(data.choices) || data.choices.length === 0) {
          console.error("Unexpected response format from server:", data);
          return;
        }

        for (const choice of data.choices) {
          const { message } = choice;
          if (typeof message !== "object" || typeof message.content !== "string") {
            console.error("Unexpected message format:", message);
            continue;
          }
          const { content } = message;
          // Update the UI with the new content
          if (content) {
            resultText.innerText += content;
          }
        }

        // Clear the message buffer after successful parsing
        messageBuffer = '';
      } catch (error) {
        // If parsing fails, just wait for more data
      }
    };

    eventSource.onerror = (event) => {
      console.error("Error from server:", event);
      resultText.innerText = "Error from server. See console for details.";
    };
  });
});