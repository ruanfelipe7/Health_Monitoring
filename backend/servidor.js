const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 500);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  console.log("Chamou aqui");
  const temperature = JSON.parse('{ "temperature":"'+new Date().getSeconds()+'"}')
  socket.emit("Temperature", temperature);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
