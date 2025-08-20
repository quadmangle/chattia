import React, { useState, useEffect, useRef } from 'react';

// Main App component for the Chattia chatbot UI
const App = () => {
  // State to hold the chat messages. Each message is an object with 'text' and 'sender'.
  const [messages, setMessages] = useState([
    { text: "Hello! My name is Chattia. How can I help you today?", sender: 'bot' }
  ]);
  // State to hold the current user input
  const [userInput, setUserInput] = useState('');
  // Ref to automatically scroll the chat window to the bottom
  const chatWindowRef = useRef(null);

  // useEffect hook to scroll to the bottom whenever messages are updated
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to simulate a bot response based on user input
  const getBotResponse = (input) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello there! It's great to chat with you.";
    } else if (lowerInput.includes('how are you')) {
      return "I'm doing great, thank you for asking! How about you?";
    } else if (lowerInput.includes('name')) {
      return "My name is Chattia, and I'm here to assist you.";
    } else {
      // This is where you would eventually call Layer 3, 4, 5, etc.
      return "I'm still learning! Please try asking something else, or let me know what you'd like to talk about.";
    }
  };

  // Function to handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevents the form from refreshing the page
    const text = userInput.trim();

    if (text === '') return;

    // Add the user's message to the messages state
    setMessages(prevMessages => [...prevMessages, { text: text, sender: 'user' }]);
    setUserInput(''); // Clear the input field

    // Simulate the bot's response with a slight delay
    setTimeout(() => {
      const botReply = getBotResponse(text);
      setMessages(prevMessages => [...prevMessages, { text: botReply, sender: 'bot' }]);
    }, 700);
  };

  // Component for displaying a single message bubble
  const MessageBubble = ({ text, sender }) => {
    const isUser = sender === 'user';
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`
          p-3 rounded-2xl max-w-sm shadow-md
          ${isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }
        `}>
          {text}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-gray-100 font-sans antialiased">
      <div className="flex flex-col w-full max-w-2xl h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Chat window */}
        <div ref={chatWindowRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <MessageBubble key={index} text={msg.text} sender={msg.sender} />
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
