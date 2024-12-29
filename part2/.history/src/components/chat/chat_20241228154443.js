import React, { useState } from 'react';
import '../../syles/chat.css'; 

const Chat = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  const openChat = (admin) => {
    setAdminName(admin);
    setChatVisible(true);
    setMessages([
      { text: `${admin}: Hello! How can I assist you today?`, isAdmin: true },
    ]);
  };

  const sendMessage = () => {
    if (userMessage.trim() === '') return;

    setMessages([
      ...messages,
      { text: `You: ${userMessage}`, isAdmin: false },
      { text: `${adminName}: Thank you for your message!`, isAdmin: true },
    ]);
    setUserMessage('');
  };

  return (
    <section id="Chat" className="section">
      <header>
        <h2>Chat with Admins</h2>
      </header>
      <section id="search-section">
        <input
          type="text"
          id="search-input"
          placeholder="Search for an admin..."
        />
      </section>

      <section id="admins-list">
        <h3>Available Admins</h3>
        <div className="admins-container">
          <div className="admin" onClick={() => openChat('Admin1')}>
            <img src="" alt="Admin1" />
            <p>Admin1</p>
          </div>
          <div className="admin" onClick={() => openChat('Admin2')}>
            <img src="" alt="Admin2" />
            <p>Admin2</p>
          </div>
          <div className="admin" onClick={() => openChat('Admin3')}>
            <img src="" alt="Admin3" />
            <p>Admin3</p>
          </div>
        </div>
      </section>

      {chatVisible && (
        <section id="chat-section">
          <h3 id="chat-title">Chat with {adminName}</h3>
          <div id="chat-window">
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  color: message.isAdmin ? '#4A90E2' : '#34D399',
                }}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div id="chat-input-container">
            <input
              type="text"
              id="chat-input"
              placeholder="Type your message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            />
            <button id="send-button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </section>
      )}
    </section>
  );
};

export default Chat;
