document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generate").addEventListener("click", async () => {
    const resultText = document.getElementById("result");
    resultText.innerText = "Loading...";

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: document.getElementById("prompt").value }),
    });

    if (!response.ok) {
      console.error("Error from server:", response.status, response.statusText);
      resultText.innerText = "Error from server. See console for details.";
      return;
    }

    const data = await response.json();

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
  });
});
