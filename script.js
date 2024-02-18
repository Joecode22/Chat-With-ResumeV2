document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", async () => {
    const resultText = document.getElementById("resultText");
    resultText.innerText = "Loading...";

    const prompt = document.getElementById("promptInput").value;

    try {
      const response = await fetch(`/api/generate?prompt=${encodeURIComponent(prompt)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      // Read the streaming response
      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        // Decode the response and update the UI
        const chunk = decoder.decode(value);
        resultText.innerText += chunk;

        // Yield control back to the browser
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    } catch (error) {
      console.error("Error from server:", error);
      resultText.innerText = "Error from server. See console for details.";
    }
  });
});