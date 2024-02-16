const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: any) => {
  try {
    let room = "";
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
      socket.leave(room);
      room = "";
    });
    socket.on("join-room", (roomName: string) => {
      socket.join(roomName);
      room = roomName;
      console.log("a user joined room", roomName);
    });
    socket.on("leave-room", () => {
      socket.leave(room);
      room = "";
      console.log("a user leaved room", room);
    });
  } catch (error) {
    console.log(error);
  }
});

httpServer.listen(port);
