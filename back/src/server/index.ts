import dotenv from "dotenv"
import { createServer } from "http"
import { Server } from "socket.io"
import express from "express"

dotenv.config();

const app = express();
const port = process.env.PORT;

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});