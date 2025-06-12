"use client";

import { useState, useRef, useEffect } from "react";

function Chatbox() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "system",
      text: "Welcome to FundPulse support! How can we help you today?",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim() === "") return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");

    // Simulate response after a short delay
    setTimeout(() => {
      const responseMessage = {
        id: messages.length + 2,
        sender: "system",
        text: getAutoResponse(newMessage),
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 1000);
  };

  // Simple auto-response function
  const getAutoResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! How can I assist you with your fundraising journey today?";
    } else if (lowerMessage.includes("help")) {
      return "I can help you with creating proposals, understanding the investment process, or connecting with potential investors. What specific assistance do you need?";
    } else if (lowerMessage.includes("investor") || lowerMessage.includes("invest")) {
      return "Our platform connects you with verified investors interested in funding innovative startups. You can view your current investors in the Current Proposal section.";
    } else if (lowerMessage.includes("proposal") || lowerMessage.includes("project")) {
      return "To create a new proposal, go to the Add Project page. Make sure to include detailed information about your startup and funding requirements to attract potential investors.";
    } else if (lowerMessage.includes("wallet") || lowerMessage.includes("metamask")) {
      return 'You can connect your Metamask wallet by clicking the "Connect Wallet" button in the navigation bar. This allows you to receive and manage your funds securely.';
    } else {
      return "Thank you for your message. Our team will review it and get back to you soon. Is there anything else I can help you with?";
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Support Chat</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user" ? "text-green-100" : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800">How do I create a new project?</h3>
            <p className="text-gray-600">
              Navigate to the Add Project page and fill out the required information about your
              startup and funding needs.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800">How are funds distributed?</h3>
            <p className="text-gray-600">
              Once your funding goal is reached, the ETH is transferred to your connected wallet.
              You can track all transactions in your profile.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800">
              What happens if my funding goal isn't reached?
            </h3>
            <p className="text-gray-600">
              If your funding goal isn't reached by the end date, all funds are returned to the
              investors automatically.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800">How is equity distributed to investors?</h3>
            <p className="text-gray-600">
              Equity is distributed proportionally based on the amount invested relative to your
              total funding goal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
