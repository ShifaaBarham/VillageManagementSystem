import React, { useState, useEffect, useRef } from "react";
import {jwtDecode}from "jwt-decode";
import "../../syles/chat.css";

const Chat = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [activeRecipient, setActiveRecipient] = useState(null);
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

        if (
          isAdmin &&
          !usersList.includes(receivedMessage.sender) &&
          receivedMessage.sender !== userId
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

  const openChat = async (recipient) => {
    setActiveRecipient(recipient);
    setChatVisible(true);

    // Fetch messages from the server
    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          query: `
            query GetUserChats($userId: ID!, $recipientId: ID!) {
              userChats(userId: $userId, recipientId: $recipientId) {
                id
                sender
                recipient
                text
                timestamp
              }
            }
          `,
          variables: { userId, recipientId: recipient },
        }),
      });
      const result = await response.json();
      setMessages(result.data.userChats || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = () => {
    if (!userMessage.trim()) return;

    const messageObject = {
      text: userMessage,
      sender: userId,
      recipient: activeRecipient,
      role: isAdmin ? "admin" : "user",
    };

    ws.current.send(JSON.stringify(messageObject));
    setMessages((prevMessages) => [...prevMessages, messageObject]);
    setUserMessage("");
  };

  return (
    <section id="Chat">
      <header>
        <h2>{isAdmin ? "Admin Panel" : "Chat with Admins"}</h2>
      </header>

      {isAdmin ? (
        <section id="users-list">
          <h3>Users</h3>
          {usersList.map((user, index) => (
            <div key={index} onClick={() => openChat(user)}>
              {user}
            </div>
          ))}
        </section>
      ) : (
        <section id="admins-list">
          <h3>Admins</h3>
          <div onClick={() => openChat("admin1")}>Admin1</div>
          <div onClick={() => openChat("admin2")}>Admin2</div>
        </section>
      )}

      {chatVisible && (
        <section id="chat-section">
          <h3>Chat with {activeRecipient}</h3>
          <div id="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === userId ? "sent" : "received"}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={sendMessage}>Send</button>
        </section>
      )}
    </section>
  );
};

export default Chat;
