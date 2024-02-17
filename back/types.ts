export type Room = {
  name: string;
  members: UsersRoom[];
  messages: Message[];
};

export type UsersRoom = {
  email: string;
  pseudo: string;
  id: string;
  pts: number;
};
export type Message = {
  id: string;
  text: string;
  createdAt: number;
  createdBy: string;
  roomId: string;
};
export type FirebaseDocumentWithId<T> = T & { id: string };
