import { DB_QUIZZ } from "@/constants"
import { db } from "@/constants/db"
import { doc, getDoc } from "firebase/firestore"
import router from "next/router"
import React from "react"

const Quizz = () => {
  const { uid } = router.query || ""
  const fetchQuizz = async () => {
    try {
      const d = await getDoc(doc(db, DB_QUIZZ, uid as string))
      console.log(d.data())
    } catch (error) {
      console.error(error)
    }
  }

  return <div>Quizz</div>
}

export default Quizz
