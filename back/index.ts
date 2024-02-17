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

// const firestoreApp = initializeApp({
//   apiKey: "AIzaSyC6DFL6L0wHtk5EJz1Du2WoLt91-aQtu00",
//   authDomain: "web-realtime-fdd51.firebaseapp.com",
//   projectId: "web-realtime-fdd51",
//   storageBucket: "web-realtime-fdd51.appspot.com",
//   messagingSenderId: "1048193492962",
//   appId: "1:1048193492962:web:5328f468a7b8ca900bbbbb",
// });

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
    socket.on("join-room", async (roomName: string) => {
      console.log("a user joined room", roomName);

      socket.join(roomName);
      room = roomName;

      const res = await firestore.collection("rooms").add({
        name: "Tokyo",
        country: "Japan",
      });
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
