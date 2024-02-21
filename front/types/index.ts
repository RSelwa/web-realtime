export type Question = {
  question: string
  answers: Answer[]
}
export type Answer = {
  answer: string
  isGood: boolean
}

export type Quizz = {
  ownerid: string
  title: string
  questions: Question[]
}
export type FirebaseDocumentWithId<T> = T & { id: string }
export type RoomStatus = "started" | "waiting"
export type Room = {
  name: string
  members: UsersRoom[]
  messages: Message[]
  quizzId: string
  status: RoomStatus
}
export type UsersRoom = {
  email: string
  pseudo: string
  id: string
  pts: number
  isLeader: boolean
}

type Message = {
  id: string
  text: string
  createdAt: number
  createdBy: string
  roomId: string
}
