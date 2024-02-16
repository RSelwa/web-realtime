export type Question = {
  question: string
  answers: Answer[]
  correctAnswer: string
}
type Answer = {
  answer: string
  isGood: boolean
}

export type Quizz = {
  ownerid: string
  title: string
  questions: Question[]
}
export type FirebaseDocumentWithId<T> = T & { id: string }
