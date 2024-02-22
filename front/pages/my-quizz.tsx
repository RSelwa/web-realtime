import { DB_QUIZZ } from "@/constants"
import { db } from "@/constants/db"
import type { FirebaseDocumentWithId, Quizz } from "@/types"
import { getItemFromLocalStorage } from "@/utils/storage"
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useForm, type FieldValue, type FieldValues } from "react-hook-form"

const MyQuizz = () => {
  const [quizzes, setquizzes] = useState<FirebaseDocumentWithId<Quizz>[]>([])
  const { id } = getItemFromLocalStorage("user", { id: "" })
  const { handleSubmit, register, reset } = useForm<{ quizzName: string }>()
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
  const createQuizz = async ({ quizzName }: { quizzName: string }) => {
    try {
      const newQuizz: Quizz = {
        ownerid: id,
        questions: [],
        title: quizzName
      }
      await addDoc(collection(db, DB_QUIZZ), newQuizz)
      reset()
      await fetchQuizzes()
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchQuizzes()
  }, [])

  return (
    <div className="flex gap-2">
      <form onSubmit={handleSubmit(createQuizz)}>
        <fieldset>
          <label htmlFor="quizzName">Quizz Name</label>
          <input type="text" {...register("quizzName")} required />
        </fieldset>
        <button type="submit">Créer</button>
      </form>
      <div>
        {quizzes.map((quizz, i) => (
          <Link key={i} href={`/quizz/${quizz.id}`}>
            {quizz.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default MyQuizz
