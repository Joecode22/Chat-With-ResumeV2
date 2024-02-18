import oboe from 'oboe';

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", () => {
    const resultText = document.getElementById("resultText");
    resultText.innerHTML = "<p>Loading...</p>";

    const prompt = document.getElementById("promptInput").value;

    oboe(`/api/generate?prompt=${encodeURIComponent(prompt)}`)
      .node('!.choices.*.delta.content', function(chunk) {
        const paragraph = document.createElement("p");
        paragraph.innerText = chunk;
        resultText.appendChild(paragraph);
      })
      .fail(function(error) {
        console.error("Error from server:", error);
        resultText.innerHTML = "<p>Error from server. See console for details.</p>";
      });
  });
});