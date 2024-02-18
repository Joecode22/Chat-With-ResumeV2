document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", async () => {
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = "<p>Loading...</p>";

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

        // Decode the response and create a new paragraph element
        const chunk = decoder.decode(value);
        const paragraph = document.createElement("p");
        paragraph.innerText = chunk;
        resultContainer.appendChild(paragraph);

        // Yield control back to the browser and add delay
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error("Error from server:", error);
      resultContainer.innerHTML = "<p>Error from server. See console for details.</p>";
    }
  });
});