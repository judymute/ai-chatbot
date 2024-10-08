import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// API endpoint URL
const API_URL = 'http://localhost:3001'; // Update this when you deploy

function App() {
  // State variables
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [input, setInput] = useState(''); // Stores user input
  const [loading, setLoading] = useState(false); // Indicates if a request is in progress
  const [file, setFile] = useState(null); // Stores the selected file for upload
  const [error, setError] = useState(''); // Stores error messages
  const messagesEndRef = useRef(null); // Reference to the end of the message list

  // Function to scroll to the bottom of the message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect hook to scroll to bottom whenever messages change
  useEffect(scrollToBottom, [messages]);

  // Function to handle form submission (sending a message)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return; // Don't submit if input is empty

    // Add user message to the chat
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput(''); // Clear input field
    setLoading(true); // Start loading
    setError(''); // Clear any previous errors

    try {
      // Send message to the API and get response
      const response = await axios.post(`${API_URL}/chat`, { message: input });
      const aiMessage = { role: 'assistant', content: response.data.reply };
      setMessages(prevMessages => [...prevMessages, aiMessage]); // Add AI response to chat
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to get response from the AI. Please try again.');
    }

    setLoading(false); // Stop loading
  };

  // Function to handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return; // Don't proceed if no file is selected

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true); // Start loading
    setError(''); // Clear any previous errors

    try {
      // Send file to the API
      await axios.post(`${API_URL}/upload-faq`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Add success message to chat
      setMessages(prevMessages => [...prevMessages, { role: 'system', content: 'FAQ uploaded successfully. You can now ask questions about it.' }]);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload FAQ. Please try again.');
    }

    setLoading(false); // Stop loading
    setFile(null); // Clear selected file
  };

  return (
    <div className="container mx-auto p-4">
      {/* File upload section */}
      <div className="max-w-2xl mx-auto mb-4 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Upload FAQ PDF</h3>
          <form onSubmit={handleFileUpload} className="mt-5 sm:flex sm:items-center">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf"
              className="max-w-xs w-full px-3 py-2 text-sm leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!file || loading}
              className="mt-3 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto"
            >
              Upload
            </button>
          </form>
        </div>
      </div>

      {/* Chat interface section */}
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">AI Chatbot</h3>
          {/* Message display area */}
          <div className="h-96 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-md">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-100 text-blue-800' 
                    : message.role === 'system' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.content}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* Reference for scrolling */}
          </div>
          {/* Error display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {/* Message input form */}
          <form onSubmit={handleSubmit} className="mt-5 sm:flex sm:items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="max-w-lg block w-full px-3 py-2 text-base leading-6 text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;