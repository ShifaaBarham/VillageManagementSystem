const WebSocket = require('ws');
const db = require('./database/db'); 

const startWebSocketServer = (port) => {
  const wss = new WebSocket.Server({ port });

  wss.on('connection', (ws) => {
    console.log('مستخدم متصل');

    ws.on('message', (message) => {
      console.log('الرسالة المستلمة:', message);

      try {
        const messageObj = JSON.parse(message);
        const { text, sender, recipient } = messageObj;

        const query = 'INSERT INTO messages (sender, recipient, text) VALUES (?, ?, ?)';
        db.query(query, [sender, recipient, text], (err, result) => {
          if (err) {
            console.error('خطأ في إدخال البيانات إلى قاعدة البيانات:', err);
          } else {
            console.log('تم تخزين الرسالة في قاعدة البيانات');
          }
        });

        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      } catch (err) {
        console.error('خطأ في تحليل الرسالة أو معالجتها:', err);
      }
    });

    ws.on('close', () => {
      console.log('مستخدم غير متصل');
    });
  });

  console.log(`خادم WebSocket يعمل على ws://localhost:${port}`);
};

module.exports = { startWebSocketServer };
