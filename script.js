document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", () => {
    const resultText = document.getElementById("resultText");
    resultText.innerHTML = "<p>Loading...</p>";

    const prompt = document.getElementById("promptInput").value;
    const queue = [];
    let processingQueue = false;

    function processQueue() {
      if (queue.length === 0) {
        processingQueue = false;
        return;
      }

      const item = queue.shift();
      const paragraph = document.createElement("p");
      paragraph.innerText = item.choices[0].delta.content;
      resultText.appendChild(paragraph);

      setTimeout(processQueue, 1000); // Delay of 1 second
    }

    fetch(`/api/generate?prompt=${encodeURIComponent(prompt)}`)
      .then(response => response.body.getReader())
      .then(reader => {
        const decoder = new TextDecoder();
        let data = '';

        function processChunk({ done, value }) {
          data += decoder.decode(value, { stream: !done });

          while (true) {
            const pos = data.indexOf('\n');

            if (pos === -1) {
              break;
            }

            const line = data.slice(0, pos);
            data = data.slice(pos + 1);

            console.log('Received line:', line); // Add this line

            if (line) {
              try {
                const item = JSON.parse(line);
                queue.push(item);

                if (!processingQueue) {
                  processingQueue = true;
                  processQueue();
                }
              } catch (error) {
                console.error('Error parsing JSON:', error); // Add this line
              }
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