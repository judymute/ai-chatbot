# AI Chatbot

An AI-powered chatbot that answers questions based on an uploaded FAQ document.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ai-chatbot
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

## Running the Application

1. Start the backend server:
   ```
   cd backend
   node server.js
   ```
   The server should start running on `http://localhost:3001`.

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```
   The React app should open in your default browser at `http://localhost:3000`.

## Usage

1. Upload an FAQ document using the file upload form.
2. Once the document is uploaded successfully, you can start asking questions in the chat interface.
3. The AI will respond based on the content of the uploaded FAQ.

## Main Packages Used

### Backend
- express: Web application framework
- multer: Middleware for handling file uploads
- pdf-parse: Library for parsing PDF files
- openai: Official OpenAI API client for Node.js
- dotenv: Loads environment variables from a .env file
- cors: Enables Cross-Origin Resource Sharing (CORS)

### Frontend
- react: JavaScript library for building user interfaces
- axios: Promise-based HTTP client for making API requests
- tailwindcss: Utility-first CSS framework for rapid UI development