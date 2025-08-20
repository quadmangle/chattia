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

  // State to control dark mode and initialize based on the user's preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) {
        return stored === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Persist the preference and apply a root-level class for theming
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', isDarkMode);
    }
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

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

  //======== Tiny ML ========
  // --- Layer 4: Tiny ML Intent Classification ---
  const getTinyMLResponse = (input) => {
    const lowerInput = input.toLowerCase();

    // Check for "weather" intent
    if (lowerInput.includes('weather') || lowerInput.includes('forecast')) {
      return "I can check the weather for you. What city are you in?";
    }

    // Check for "support" intent
    if (lowerInput.includes('help') || lowerInput.includes('support')) {
      return "I can connect you to a support agent. What's the issue?";
    }

    return null;
  };

  //======== Tiny LLM ========
  // --- Layer 5: Tiny LLM (Simple Content Generation) ---
  const getTinyLLMResponse = (input) => {
      // This is a mock of a Tiny LLM. It generates a simple, contextual
      // response for questions that aren't simple intent classifications.
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('what is a chatbot')) {
          return "A chatbot is a computer program or an artificial intelligence (AI) that conducts a conversation via auditory or textual methods.";
      }

      if (lowerInput.includes('who created you')) {
          return "I am a prototype AI being built with a multi-layered architecture to demonstrate efficient processing and security.";
      }
      
      // If the Tiny LLM cannot generate a response, return null
      return null;
  };

  //======== Tiny AI ========
  // --- Layer 6: Tiny AI (Complex Task Execution) ---
  const getTinyAIResponse = (input) => {
    // This is a mock of a Tiny AI. It's designed to perform a more complex,
    // multi-step task or calculation.
    const lowerInput = input.toLowerCase();
    
    // Check for a unit conversion task
    if (lowerInput.includes('convert') && lowerInput.includes('celsius')) {
      const tempMatch = input.match(/(\d+)\s*celsius/i);
      if (tempMatch && tempMatch[1]) {
        const celsius = parseFloat(tempMatch[1]);
        const fahrenheit = (celsius * 9/5) + 32;
        return `${celsius}°C is equal to ${fahrenheit.toFixed(2)}°F.`;
      }
    }
    
    // Check for a simple mathematical task
    const mathMatch = lowerInput.match(/what is (\d+)\s*\+\s*(\d+)/i);
    if (mathMatch) {
      const num1 = parseInt(mathMatch[1]);
      const num2 = parseInt(mathMatch[2]);
      const sum = num1 + num2;
      return `The sum of ${num1} and ${num2} is ${sum}.`;
    }

    // If the Tiny AI cannot handle the task, return null
    return null;
  };

  //======== Layer 7 ========
  // --- Layer 7: Larger LLM/ML/AI Backend Call with Cloudflare Worker & Encryption ---
  const callLargeModelAPI = async (input) => {
    // This is a mock-up of the encryption and API call process.
    // In a real application, you'd encrypt the input before sending it.
    console.log("Encrypting query and calling the Cloudflare Worker backend...");

    // Mock API call simulation
    return new Promise(resolve => {
      setTimeout(() => {
        // Mock response from the larger model
        const response = `I've processed your complex query using a larger model. The answer to your question "${input}" is in the works!`;
        console.log("Received encrypted response. Decrypting...");
        // In a real app, you would decrypt the response here.
        resolve(response);
      }, 2000); // Simulate a network delay
    });
  };
  
  // useEffect hook to scroll to the bottom whenever messages are updated
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to determine the bot's response based on the layered logic
  const getBotResponse = async (input) => {
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
    
    // Layer 5: If Layer 4 fails, pass the query to the Tiny LLM layer.
    const tinyLLMReply = getTinyLLMResponse(input);
    if (tinyLLMReply) {
        return tinyLLMReply;
    }

    // Layer 6: If Layer 5 fails, pass the query to the Tiny AI layer.
    const tinyAIResponse = getTinyAIResponse(input);
    if (tinyAIResponse) {
      return tinyAIResponse;
    }

    // Layer 7: Final fallback for complex queries.
    const finalResponse = await callLargeModelAPI(input);
    return finalResponse;
  };

  // Function to handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = userInput.trim();
    if (text === '') return;

    setMessages(prevMessages => [...prevMessages, { text: text, sender: 'user' }]);
    setUserInput('');

    // Await the response from the layered logic
    const botReply = await getBotResponse(text);

    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: botReply, sender: 'bot' }]);
    }, 700);
  };

  // Component for displaying a single message bubble
  const MessageBubble = ({ text, sender }) => {
    const isUser = sender === 'user';
    const botClasses = isDarkMode
      ? 'bg-gray-700 text-gray-100 rounded-bl-none'
      : 'bg-gray-200 text-gray-800 rounded-bl-none';
    const userClasses = 'bg-blue-600 text-white rounded-br-none';
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`p-3 rounded-2xl max-w-sm shadow-md ${isUser ? userClasses : botClasses}`}>
          {text}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex items-center justify-center p-4 min-h-screen font-sans antialiased ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`flex flex-col w-full max-w-2xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header with dark mode toggle */}
        <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <span className="font-semibold">Chattia</span>
          <button
            onClick={() => setIsDarkMode(prev => !prev)}
            className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Chat window */}
        <div ref={chatWindowRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <MessageBubble key={index} text={msg.text} sender={msg.sender} />
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSendMessage} className={`p-4 border-t ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className={`flex-1 p-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'}`}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.770 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default App;
