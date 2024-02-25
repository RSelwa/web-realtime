import type { RoomServer } from "./types"
import { io } from "./server";
import type { Socket } from "socket.io";
import { onCreateRoom, onDisconnect, onJoinRoom, onLeaveRoom, onSelectQuizz, onStartQuizz } from "./socket";

io.on("connection", async (socket: Socket) => {
  try {
    onDisconnect(socket)
    onCreateRoom(socket)
    onSelectQuizz(socket)
    onStartQuizz(socket)
    onJoinRoom(socket)
    onLeaveRoom(socket)
  } catch (error) {
    console.log(error);
  }
});
