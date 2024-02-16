import { DB_QUIZZ } from "@/constants"
import { db } from "@/constants/db"
import type { FirebaseDocumentWithId, Quizz } from "@/types"
import { getItemFromLocalStorage } from "@/utils/storage"
import { collection, getDocs, query, where } from "firebase/firestore"
import Link from "next/link"
import React, { useEffect, useState } from "react"

type Props = {}

const MyQuizz = (props: Props) => {
  const [quizzes, setquizzes] = useState<FirebaseDocumentWithId<Quizz>[]>([])
  const { id } = getItemFromLocalStorage("user", { id: "" })
  const fetchQuizzes = async () => {
    try {
      const myQuizzes = await getDocs(
        query(collection(db, DB_QUIZZ), where("ownerid", "==", id))
      )
      setquizzes(
        myQuizzes.docs.map((doc) => ({ ...(doc.data() as Quizz), id: doc.id }))
      )
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchQuizzes()
  }, [])

  return (
    <div className="flex gap-2">
      {quizzes.map((quizz, i) => (
        <Link key={i} href={`/quizz/${quizz.id}`}>
          {quizz.title}
        </Link>
      ))}
    </div>
  )
}

export default MyQuizz
