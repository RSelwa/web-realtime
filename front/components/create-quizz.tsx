import { DB_QUIZZ } from "@/constants"
import { db } from "@/constants/db"
import type { Question, Quizz } from "@/types"
import { getItemFromLocalStorage } from "@/utils/storage"
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from "firebase/firestore"
import React from "react"
import { useForm } from "react-hook-form"

type Props = {}

const CreateQuizz = (props: Props) => {
  const { register, handleSubmit, reset } = useForm<Quizz>()
  const createQuizz = async (data: Quizz) => {
    const { id } = getItemFromLocalStorage("user", { id: "" })
    try {
      const newQuizz: Quizz = {
        ownerid: id,
        questions: [],
        title: data.title
      }
      const myQuizzes = await getDocs(
        query(
          collection(db, DB_QUIZZ),
          where("ownerid", "==", id),
          where("title", "==", data.title)
        )
      )
      if (myQuizzes.docs.length > 0)
        throw new Error("Un Quizz du meme nom existe déjà")

      await addDoc(collection(db, DB_QUIZZ), newQuizz)
      reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(createQuizz)}>
      <fieldset>
        <label htmlFor="title">Titre du Quizz</label>
        <input type="text" {...register("title")}></input>
      </fieldset>
      <button type="submit">Créer</button>
    </form>
  )
}

export default CreateQuizz
