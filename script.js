document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", async () => {
    const resultText = document.getElementById("resultText");
    resultText.innerText = "Loading...";

    const prompt = document.getElementById("promptInput").value;
    const eventSource = new EventSource(`/api/generate?prompt=${encodeURIComponent(prompt)}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (typeof data !== "object" || typeof data.content !== "string") {
        console.error("Unexpected message format:", data);
        return;
      }

      const { content } = data;
      // Update the UI with the new content
      if (content) {
        resultText.innerText += content;
      }
    };

    eventSource.onerror = (event) => {
      console.error("Error from server:", event);
      resultText.innerText = "Error from server. See console for details.";
    };
  });
});