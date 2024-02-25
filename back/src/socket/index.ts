import type { Socket } from "socket.io";
import type { Quizz, Room, RoomServer, UsersRoom } from "../types";
import { firestore } from "../config/firebase";
import { io } from "../server";
import { FieldValue } from "firebase-admin/firestore"

let roomId = "";
const rooms: RoomServer[] = [];

export const onDisconnect = (socket: Socket, ) => {
  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.leave(roomId);
    roomId = "";
  })
}

export const onCreateRoom = (socket: Socket) => {
  socket.on("create-room", async (user: UsersRoom) => {
    const newRoom: Room = {
      members: [user],
      name: `${user.pseudo}'s room`,
      messages: [],
      quizz: {} as Quizz,
      status: "waiting",
    };

    const roomCreated = await firestore.collection("rooms").add(newRoom);
    const newServerRoom: RoomServer = {
      id: roomCreated.id,
      timer: 0,
      status: "waiting",
    };

    rooms.push(newServerRoom);
    socket.emit("redirect-user-room", roomCreated.id);
  });
}

export const onJoinRoom = (socket: Socket) => {
  socket.on("join-room", async ({ 
    roomName, 
    newUser 
  }: {
    roomName: string;
    newUser: UsersRoom;
  }) => {
    if (!roomName) {
      return
    }

    console.log("a user joined room", roomName);

    socket.join(roomName)
    roomId = roomName

    await firestore
      .collection("rooms")
      .doc(roomId)
      .update({ members: FieldValue.arrayUnion(newUser) });

    const doc = firestore.collection("rooms").doc(roomName);

    doc.onSnapshot((docSnapshot: any) =>
      io.to(docSnapshot.id).emit("update-room", {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      })
    );
  }
)}

export const onSelectQuizz = (socket: Socket) => {
  socket.on("select-quizz", async (quizz: Quizz) => {
    await firestore.collection("rooms").doc(roomId).update({ quizz: quizz })
  });
}

export const onStartQuizz = (socket: Socket) => {
  socket.on("start-quizz", async () => {
    const room = rooms.find((room) => room.id === roomId)
    if (!room) return;
    await firestore
      .collection("rooms")
      .doc(roomId)
      .update({ status: "started" });

    room.timer = 30;
    setInterval(() => {
      room.timer -= 1;
      io.to(roomId).emit("update-timer", room.timer)
    }, 1000)
  })
}

export const onLeaveRoom = (socket: Socket) => {
  socket.on("leave-room", () => {
    socket.leave(roomId);
    roomId = "";
    console.log("a user leaved room", roomId);
  })
}