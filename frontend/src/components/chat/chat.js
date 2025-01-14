import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import "../../syles/chat.css";

const Chat = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [activeRecipient, setActiveRecipient] = useState("");
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [usersList, setUsersList] = useState([]);
  const ws = useRef(null);

  const getUserDataFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const userData = getUserDataFromToken();
  const userId = userData?.id; 
  const isAdmin = userData?.role === "admin";

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.current.onmessage = (event) => {
      try {
        const receivedMessage = JSON.parse(event.data);
        console.log("Received message:", receivedMessage);

        // تحقق من صلاحية الرسالة
        if (!receivedMessage.sender || !receivedMessage.text) {
          console.error("Invalid message format:", receivedMessage);
          return;
        }

        // تحديث قائمة الرسائل
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: receivedMessage.text,
            sender: receivedMessage.sender,
            recipient: receivedMessage.recipient,
            isAdmin: receivedMessage.sender === "admin",
          },
        ]);

        if (
          isAdmin &&
          receivedMessage.sender &&
          receivedMessage.sender !== userId &&
          !usersList.includes(receivedMessage.sender)
        ) {
          setUsersList((prev) => [...prev, receivedMessage.sender]);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.current.close();
    };
  }, [isAdmin, usersList, userId]);

  const openChat = (recipient) => {
    setActiveRecipient(recipient);
    setChatVisible(true);
  };

  const sendMessage = () => {
    if (userMessage.trim() === "") return;

    const messageObject = {
      text: userMessage,
      sender: userId,
      recipient: activeRecipient,
      role: isAdmin ? "admin" : "user",
    };

    ws.current.send(JSON.stringify(messageObject));

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, sender: userId, recipient: activeRecipient, isAdmin },
    ]);
    setUserMessage("");
  };

  return (
    <section id="Chat" className="section">
      <header>
        <h2>{isAdmin ? "Admin Panel" : "Chat with Admins"}</h2>
      </header>

      {/* قائمة المستخدمين أو الإداريين */}
      {isAdmin ? (
        <section id="users-list">
          <h3>Users Who Sent Messages</h3>
          <div className="users-container">
            {usersList.length === 0 ? (
              <p>No users have sent messages yet.</p>
            ) : (
              usersList.map((user, index) => (
                <div key={index} className="user" onClick={() => openChat(user)}>
                  <p>{user}</p>
                </div>
              ))
            )}
          </div>
        </section>
      ) : (
        <section id="admins-list">
          <h3>Available Admins</h3>
          <div className="admins-container">
            <div className="admin" onClick={() => openChat("barhamshifaa@gmail.com")}>
              <p>barhamshifaa@gmail.com</p>
            </div>
            <div className="admin" onClick={() => openChat("Admin2")}>
              <p>Admin2</p>
            </div>
          </div>
        </section>
      )}

      {/* واجهة الدردشة */}
      {chatVisible && (
        <section id="chat-section">
          <h3>Chat with {activeRecipient}</h3>
          <div id="chat-window">
            {messages
              .filter(
                (msg) =>
                  (msg.sender === userId && msg.recipient === activeRecipient) ||
                  (msg.sender === activeRecipient && msg.recipient === userId)
              )
              .map((message, index) => (
                <div
                  key={index}
                  style={{ color: message.isAdmin ? "#4A90E2" : "#34D399" }}
                >
                  {`${message.sender}: ${message.text}`}
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
            <button onClick={sendMessage}>Send</button>
          </div>
        </section>
      )}
    </section>
  );
};

export default Chat;
