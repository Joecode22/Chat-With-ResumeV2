# Resume Chatbot

This project is a chatbot that uses OpenAI's GPT-3 model to answer questions based on my resume.

## Live Demo

You can view the live demo of the application [here](https://vets-who-code-prework.vercel.app/).

## Features

- **OpenAI GPT-3**: The chatbot uses OpenAI's GPT-3 model to generate responses to user's questions.
- **Streaming Responses**: The chatbot uses Node.js streams to handle responses from the OpenAI API, allowing it to handle large responses efficiently.
- **Resume-Based**: The chatbot is designed to answer questions based on a specific resume, making it a great tool for job seekers to provide interactive resumes.

## Project Structure

- HTML, CSS, JS, With Resume pdf, txt and images for the avatars. 


## Libraries Used

- **openai**: This library is used to interact with the OpenAI API.
- **fs**: This built-in Node.js library is used to read the resume file.
- **stream**: This built-in Node.js library is used to create readable streams from the OpenAI API responses.
- **path**: This built-in Node.js library is used to handle file and directory paths.

## Setup

1. Install the dependencies:

```sh
cd api
npm install
```

## Usage

Open index.html in your browser. You can ask the chatbot questions about the resume. If you're not sure what to ask, click the "Random Resume Question" button to get a random question.

## License

This project is licensed under the terms of the MIT License