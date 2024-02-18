document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", async () => {
    const resultText = document.getElementById("resultText");
    resultText.innerText = "Loading...";

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: document.getElementById("promptInput").value }),
    });

    if (!response.ok) {
      console.error("Error from server:", response.status, response.statusText);
      resultText.innerText = "Error from server. See console for details.";
      return;
    }

    const reader = response.body.getReader();
    let chunks = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks += new TextDecoder("utf-8").decode(value);
      let data;
      try {
        data = JSON.parse(chunks);
      } catch {
        // If the chunk is not a valid JSON, it means it's not complete yet. Continue to the next iteration.
        continue;
      }
      // Reset chunks for the next message
      chunks = '';
      if (!Array.isArray(data.choices) || data.choices.length === 0) {
        console.error("Unexpected response format from server:", data);
        resultText.innerText =
          "Unexpected response format from server. See console for details.";
        return;
      }

      resultText.innerText = "";

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
    }
  });
});
