"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 5050 });
let userCount = 0;
let allSockets = [];
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
