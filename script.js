document.addEventListener("DOMContentLoaded", () => {
  // Array of random questions
  const randomQuestions = [
    "What types of experience does Joe have?",
    "How much experience does Joe have?",
    "What is Joe's educational background?",
    "What skills does Joe have?",
    "What projects has Joe worked on?"
  ];

  document.getElementById("randomBtn").addEventListener("click", () => {
    event.preventDefault();
    const promptInput = document.getElementById("promptInput");
    const randomIndex = Math.floor(Math.random() * randomQuestions.length);
    promptInput.value = randomQuestions[randomIndex];
  });

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
      const span = document.createElement("span");
      span.innerText = item.choices[0].delta.content;
      resultText.appendChild(span);

      setTimeout(processQueue, 100);
    }

    fetch(`/api/generate?prompt=${encodeURIComponent(prompt)}`)
      .then(response => response.body.getReader())
      .then(reader => {
        const decoder = new TextDecoder();
        let data = '';

        function processChunk({ done, value }) {
          data += decoder.decode(value, { stream: !done });
        
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