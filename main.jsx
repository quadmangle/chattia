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

  // --- Layer 3: Mock Google Sheets database of default replies ---
  const defaultReplies = new Map([
    ['hi', 'Hello there! It\'s great to chat with you.'],
    ['hello', 'Hello there! It\'s great to chat with you.'],
    ['how are you', 'I\'m doing great, thank you for asking! How about you?'],
    ['what is your name', 'My name is Chattia, and I\'m here to assist you.'],
    ['what can you do', 'I can help with simple questions and complex queries.'],
  ]);

  // --- Layer 2: Meta Firewall and Guardrails Logic ---
  const checkInputSafety = (input) => {
    const unsafeKeywords = ['malware', 'exploit', 'unauthorized access', 'data breach'];
    const lowerInput = input.toLowerCase();
    const isUnsafe = unsafeKeywords.some(keyword => lowerInput.includes(keyword));
    return !isUnsafe;
  };

  // --- Layer 4: Tiny ML Intent Classification ---
  const getTinyMLResponse = (input) => {
    // This is a mock of a Tiny ML model. In a real scenario, this would be a
    // lightweight model trained to classify user intent based on keywords.
    const lowerInput = input.toLowerCase();

    // Check for "weather" intent
    if (lowerInput.includes('weather') || lowerInput.includes('forecast')) {
      return "I can check the weather for you. What city are you in?";
    }

    // Check for "support" intent
    if (lowerInput.includes('help') || lowerInput.includes('support')) {
      return "I can connect you to a support agent. What's the issue?";
    }

    // If no intent is recognized, return null to indicate the query needs
    // to move to the next layer (Tiny LLM).
    return null;
  };
  
  // useEffect hook to scroll to the bottom whenever messages are updated
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to determine the bot's response based on the layered logic (Layers 2, 3, & 4)
  const getBotResponse = (input) => {
    // Layer 2: First, validate the input for safety.
    if (!checkInputSafety(input)) {
      return "I'm sorry, that query contains keywords that are not allowed. Please try a different message.";
    }

    // Layer 3: If safe, check for a default reply.
    const normalizedInput = input.toLowerCase().trim();
    if (defaultReplies.has(normalizedInput)) {
      return defaultReplies.get(normalizedInput);
    }
    
    // Layer 4: If no default reply, pass the query to the Tiny ML layer.
    const tinyMLReply = getTinyMLResponse(input);
    if (tinyMLReply) {
        return tinyMLReply;
    }

    // Fallback: If no response from Layers 3 or 4, proceed to the next layer.
    return "Processing your request... I'm sending this to the next level for more complex analysis.";
  };

  // Function to handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = userInput.trim();
    if (text === '') return;

    setMessages(prevMessages => [...prevMessages, { text: text, sender: 'user' }]);
    setUserInput('');

    const botReply = getBotResponse(text);

    setTimeout(() => {
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
