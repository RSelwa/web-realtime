import type { FirebaseDocumentWithId, Room } from "./types";

export const createRoom = async (db: any, room: Room) => {
  const roomRef = db.collection("rooms").add(room);
  return roomRef;
};
