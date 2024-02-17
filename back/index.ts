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

io.on("connection", async (socket: any) => {
  try {
    let room = "";
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
      socket.leave(room);
      room = "";
    });
    socket.on("create-room", async (user: UsersRoom) => {
      const newRoom: Room = {
        members: [user],
        name: `${user.pseudo}'s room`,
        messages: [],
        quizz: {} as Quizz,
      };
      const roomCreated = await firestore.collection("rooms").add(newRoom);

      socket.emit("redirect-user-room", roomCreated.id);
    });

    socket.on("join-room", async (roomName: string) => {
      console.log("a user joined room", roomName);

      socket.join(roomName);
      room = roomName;
      const doc = firestore.collection("rooms").doc(roomName);

      doc.onSnapshot((docSnapshot: any) =>
        io.to(docSnapshot.id).emit("update-room", {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        })
      );
    });
    socket.on("select-quizz", async (quizz: Quizz) => {
      await firestore.collection("rooms").doc(room).set({ quizz: quizz });
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

type Room = {
  name: string;
  members: UsersRoom[];
  messages: Message[];
  quizz: Quizz;
};

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
