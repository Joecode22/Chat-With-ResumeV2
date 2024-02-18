document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", () => {
    const resultText = document.getElementById("resultText");
    resultText.innerHTML = "<p>Loading...</p>";

    const prompt = document.getElementById("promptInput").innerText;
    const queue = [];
    let processingQueue = false;

    function processQueue() {
      if (queue.length === 0) {
        processingQueue = false;
        return;
      }

      const item = queue.shift();
      const span = document.createElement("span"); // Change this line
      span.innerText = item.choices[0].delta.content;
      resultText.appendChild(span);

      setTimeout(processQueue, 100); // Delay of 1 second
    }

    fetch(`/api/generate?prompt=${encodeURIComponent(prompt)}`)
      .then(response => response.body.getReader())
      .then(reader => {
        const decoder = new TextDecoder();
        let data = '';

        function processChunk({ done, value }) {
          data += decoder.decode(value, { stream: !done });
        
          // Process the entire response as a single JSON object
          if (done) {
            try {
              const items = JSON.parse(data);
              items.forEach(item => {
                queue.push(item);
        
                if (!processingQueue) {
                  processingQueue = true;
                  processQueue();
                }
              });
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          }
        
          if (!done) {
            return reader.read().then(processChunk);
          }
        }

        return reader.read().then(processChunk);
      })
      .catch(error => {
        console.error("Error from server:", error);
        resultText.innerHTML = "<p>Error from server. See console for details.</p>";
      });
  });
});