
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fetch = require("node-fetch");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
cors:{origin:"*"}
});

io.on("connection", (socket)=>{

socket.on("join",(username)=>{
console.log(username + " joined");
});

socket.on("send_message", async (data)=>{

const response = await fetch("http://localhost:8000/analyze",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
});

const result = await response.json();

io.emit("receive_message",{
username:data.username,
message:data.message,
severity:result.severity
});

});

});

server.listen(3001,()=>{
console.log("WebSocket server running on 3001");
});
