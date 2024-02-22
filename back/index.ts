const express = require("express");
const firebaseKeys = require("./keys.json");
var admin = require("firebase-admin");
const { createServer } = require("http");
const { Server } = require("socket.io");
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");
const dotenv = require("dotenv");
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(firebaseKeys),
  databaseURL: "https://web-realtime-fdd51.firebaseio.com",
});
const firestore = admin.firestore();

const app = express();
const port = process.env.PORT;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
const rooms: RoomServer[] = [];
io.on("connection", async (socket: any) => {
  try {
    let roomId = "";
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
      socket.leave(roomId);
      roomId = "";
    });
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

    socket.on(
      "join-room",
      async ({
        roomName,
        newUser,
      }: {
        roomName: string;
        newUser: UsersRoom;
      }) => {
        if (!roomName) return;
        console.log("a user joined room", roomName);

        socket.join(roomName);
        roomId = roomName;
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
    );
    socket.on("select-quizz", async (quizz: Quizz) => {
      await firestore.collection("rooms").doc(roomId).update({ quizz: quizz });
    });
    socket.on("start-quizz", async () => {
      const room = rooms.find((room) => room.id === roomId);
      if (!room) return;
      await firestore
        .collection("rooms")
        .doc(roomId)
        .update({ status: "started" });

      room.timer = 30;
      setInterval(() => {
        room.timer -= 1;
        io.to(roomId).emit("update-timer", room.timer);
      }, 1000);
    });
    socket.on("leave-room", () => {
      socket.leave(roomId);
      roomId = "";
      console.log("a user leaved room", roomId);
    });
  } catch (error) {
    console.log(error);
  }
});

httpServer.listen(port);

type Room = {
  name: string;
  members: UsersRoom[];
  messages: Message[];
  quizz: Quizz;
  status: RoomStatus;
};
type RoomServer = {
  id: string;
  timer: number;
  status: RoomStatus;
};
type RoomStatus = "started" | "waiting";
type UsersRoom = {
  email: string;
  pseudo: string;
  id: string;
  pts: number;
  isLeader: boolean;
};
type Message = {
  id: string;
  text: string;
  createdAt: number;
  createdBy: string;
  roomId: string;
};
type FirebaseDocumentWithId<T> = T & { id: string };

type Quizz = {
  ownerid: string;
  title: string;
  questions: Question[];
};
type Question = {
  question: string;
  answers: Answer[];
};
type Answer = {
  answer: string;
  isGood: boolean;
};
