const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let interval1;
let interval2;
let interval3;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval1) {
    clearInterval(interval1);
  }
  if (interval2) {
    clearInterval(interval2);
  }
  if (interval3) {
    clearInterval(interval3);
  }
  interval1 = setInterval(() => getApiAndEmitTemp(socket), 1000);
  interval2 = setInterval(() => getApiAndEmitBPM(socket), 2000);
  interval3 = setInterval(() => getApiAndEmitOxi(socket), 3000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval1);
    clearInterval(interval2);
    clearInterval(interval3);
  });
});

const getApiAndEmitTemp = socket => {
  const temperature = JSON.parse('{ "temperature":"'+(Math.random() * 60).toFixed(2)+'"}')
  socket.emit("Temperature", temperature);
};

const getApiAndEmitBPM = socket => {
  const BPM = JSON.parse('{ "BPM":"'+(Math.random() * 80).toFixed(2)+'"}')
  socket.emit("BPM", BPM);
};

const getApiAndEmitOxi = socket => {
  const Oxi = JSON.parse('{ "oximeter":"'+(Math.random() * 100).toFixed(2)+'"}')
  socket.emit("Oximeter", Oxi);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
