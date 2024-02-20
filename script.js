document.addEventListener("DOMContentLoaded", () => {
  // Array of random questions
  const randomQuestions = [
    "What types of experience does Joe have?",
    "How much experience does Joe have?",
    "What is Joe's educational background?",
    "What skills does Joe have?",
    "What projects has Joe worked on?",
    "What programming languages does Joe know?",
    "What is Joe's proficiency in JavaScript?",
    "Has Joe worked in a team environment before?",
    "What was Joe's role in his previous job?",
    "What certifications does Joe have?",
    "What is Joe's approach to problem-solving?",
    "Has Joe ever led a team or project?",
    "What is Joe's experience with front-end development?",
    "What is Joe's experience with back-end development?",
    "Does Joe have experience with cloud technologies?",
    "What is Joe's biggest professional achievement?",
    "What kind of work environment does Joe prefer?",
    "Does Joe have experience with agile methodologies?",
    "What is Joe's experience with test-driven development?",
    "What is Joe's philosophy towards continuous learning in tech?"
  ];

  document.getElementById("randomBtn").addEventListener("click", () => {
    event.preventDefault();
    const promptInput = document.getElementById("promptInput");
    const randomIndex = Math.floor(Math.random() * randomQuestions.length);
    promptInput.value = randomQuestions[randomIndex];
  });

  let controller;
  let signal;

  document.getElementById("stopBtn").addEventListener("click", () => {
    if (controller) {
      controller.abort();
    }
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

    controller = new AbortController();
    signal = controller.signal;

    fetch(`/api/generate?prompt=${encodeURIComponent(prompt)}`, { signal })
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
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error("Error from server:", error);
          resultText.innerHTML = "<p>Error from server. See console for details.</p>";
        }
      });
  });
});