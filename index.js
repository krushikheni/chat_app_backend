const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connection", socket.id);

  const chats = fs.readFileSync("message.json", "utf8");

  io.emit("send-chats", JSON.parse(chats));

  socket.on("chat-message", (data) => {
    const array = fs.readFileSync("message.json", "utf8");
    const parseArray = JSON.parse(array);

    parseArray.push(data);
    fs.writeFileSync("message.json", JSON.stringify(parseArray));

    const chats = fs.readFileSync("message.json", "utf8");
    io.emit("send-chats", JSON.parse(chats));
  });
  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello");
});

httpServer.listen(5500, () => {
  console.log("server i should be listening");
});
