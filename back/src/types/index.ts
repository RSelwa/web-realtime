
export type Room = {
  name: string;
  members: UsersRoom[];
  messages: Message[];
  quizz: Quizz;
  status: RoomStatus;
};
export type RoomServer = {
  id: string;
  timer: number;
  status: RoomStatus;
};
export type RoomStatus = "started" | "waiting";
export type UsersRoom = {
  email: string;
  pseudo: string;
  id: string;
  pts: number;
  isLeader: boolean;
};
export type Message = {
  id: string;
  text: string;
  createdAt: number;
  createdBy: string;
  roomId: string;
};
export type FirebaseDocumentWithId<T> = T & { id: string };

export type Quizz = {
  ownerid: string;
  title: string;
  questions: Question[];
};
export type Question = {
  question: string;
  answers: Answer[];
};
export type Answer = {
  answer: string;
  isGood: boolean;
};
