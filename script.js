document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", () => {
    const resultText = document.getElementById("resultText");
    resultText.innerHTML = "<p>Loading...</p>";

    const prompt = document.getElementById("promptInput").value;

    oboe(`/api/generate?prompt=${encodeURIComponent(prompt)}`)
      .node('!.*', function (item) {
        const paragraph = document.createElement("p");
        paragraph.innerText = item.choices[0].delta.content;
        resultText.appendChild(paragraph);

        // Force reflow
        void resultText.offsetHeight;
      })
      .fail(function (error) {
        console.error("Error from server:", error);
        resultText.innerHTML = "<p>Error from server. See console for details.</p>";
      });
  });
});