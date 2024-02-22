import { DB_QUIZZ } from "@/constants"
import { db } from "@/constants/db"
import type {
  FirebaseDocumentWithId,
  Quizz,
  Room,
  RoomFirestore,
  UsersRoom
} from "@/types"
import { socket } from "@/utils/socket"
import { getItemFromLocalStorage } from "@/utils/storage"
import { collection, getDocs } from "firebase/firestore"
import { get } from "http"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

type Props = {}

const RoomId = (props: Props) => {
  const router = useRouter()
  const id = router?.query?.id?.toString() || ""
  const [timer, setTimer] = useState<number>(0)
  const [room, setRoom] = useState<FirebaseDocumentWithId<RoomFirestore>>()
  const [quizzes, setQuizzes] = useState<FirebaseDocumentWithId<Quizz>[]>([])
  const { email } = getItemFromLocalStorage("user", { email: "" })
  const fetchQuizzes = async () => {
    try {
      const quizz = await getDocs(collection(db, DB_QUIZZ))
      quizz.docs.forEach((doc) => console.log(doc.data()))
      setQuizzes(
        quizz.docs.map(
          (doc) =>
            ({ id: doc.id, ...doc.data() }) as FirebaseDocumentWithId<Quizz>
        )
      )
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (!id) return
    fetchQuizzes()
    const newUser: UsersRoom = {
      pseudo: email,
      id,
      email,
      pts: 0,
      isLeader: true
    }
    socket.emit("join-room", { roomId: id, user: newUser })

    socket.on("update-room", (room: FirebaseDocumentWithId<RoomFirestore>) =>
      setRoom(room)
    )
    socket.on("update-timer", (timer: number) => setTimer(timer))

    return () => {
      socket.emit("leave-room", id)
      socket.off("update-room")
      socket.off("update-timer")
    }
  }, [router.isReady])
  if (!room) return null

  return (
    <div>
      <h1>{room?.name}</h1>
      <button onClick={() => socket.emit("test")}>TEST</button>
      {room.quizz && room.members.length >= 2 && (
        <button onClick={() => socket.emit("start-quizz")}>Start</button>
      )}
      <h1>{timer}</h1>
      <div className="flex gap-2">
        {quizzes.map((quizz, i) => (
          <div
            className="bg-blue-500 text-white"
            onClick={() => socket.emit("select-quizz", quizz)}
            key={i}
          >
            <h1>{quizz.title}</h1>
          </div>
        ))}
      </div>
      <pre>{JSON.stringify(room, null, 2)}</pre>
    </div>
  )
}

export default RoomId
