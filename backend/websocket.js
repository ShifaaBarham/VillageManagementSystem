const WebSocket = require('ws'); // تأكد من هذا السطر في بداية الملف
const db = require('./database/db');

const startWebSocketServer = (port) => {
  const wss = new WebSocket.Server({ port });

  wss.on("connection", (ws) => {
    console.log("مستخدم متصل");

    ws.on("message", async (message) => {
      try {
        const { text, sender, recipient } = JSON.parse(message);
    
        // Store in DB
        const query = "INSERT INTO messages (sender, recipient, text) VALUES (?, ?, ?)";
        await db.query(query, [sender, recipient, text]);
    
        // Send to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ sender, recipient, text }));
          }
        });
      } catch (error) {
        console.error("Message processing error:", error);
      }
    });

    ws.on("close", () => {
      console.log("مستخدم غير متصل");
    });
  });

  console.log(`خادم WebSocket يعمل على ws://localhost:${port}`);
};

module.exports = { startWebSocketServer };
