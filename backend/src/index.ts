import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 5050 });
let userCount = 0;
let allSockets: WebSocket[] = [];
wss.on("connection", (socket) => {
  allSockets.push(socket);
  userCount = userCount + 1;
  console.log("User connected, total users: ", userCount);
  socket.on("message", (event) => {
    allSockets.forEach((s) => {
      s.send(event.toString());
    });
  });
});
