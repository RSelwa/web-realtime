import { DB_QUIZZ } from "@/constants"
import { db } from "@/constants/db"
import type { Answer, FirebaseDocumentWithId, Question, Quizz } from "@/types"
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

type QuestionForm = {
  question: Question["question"]
  answer1: Answer
  answer2: Answer
  answer3: Answer
  answer4: Answer
}

const Quizz = () => {
  const router = useRouter()
  const { id } = router.query || ""
  const { register, handleSubmit, setValue, reset } = useForm<QuestionForm>()
  const [quizz, setQuizz] = useState<FirebaseDocumentWithId<Quizz>>()

  const handleCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>,
    answer: string
  ) => {
    console.log(e.target.checked, answer)
    console.log(answer + ".isGood")

    setValue("answer1.isGood", false)
    setValue("answer2.isGood", false)
    setValue("answer3.isGood", false)
    setValue("answer4.isGood", false)
    setValue((answer + ".isGood") as any, true)
  }
  const addQuestion = async (data: QuestionForm) => {
    try {
      if (
        !data.answer1.isGood &&
        !data.answer2.isGood &&
        !data.answer3.isGood &&
        !data.answer4.isGood
      )
        throw new Error("Vous devez séléctionner une bonne réponse")
      const newQuestion: Question = {
        question: data.question,
        answers: [
          { answer: data.answer1.answer, isGood: data.answer1.isGood },
          { answer: data.answer2.answer, isGood: data.answer2.isGood },
          { answer: data.answer3.answer, isGood: data.answer3.isGood },
          { answer: data.answer4.answer, isGood: data.answer4.isGood }
        ]
      }
      await updateDoc(doc(db, DB_QUIZZ, id as string), {
        questions: arrayUnion(newQuestion)
      })
      reset()
      fetchQuizz()
    } catch (error) {
      console.error(error)
    }
  }
  const removeQuestion = async (question: Question) => {
    try {
      await updateDoc(doc(db, DB_QUIZZ, id as string), {
        questions: arrayRemove(question)
      })
      fetchQuizz()
    } catch (error) {
      console.error(error)
    }
  }
  const fetchQuizz = async () => {
    try {
      if (!id) return

      const d = await getDoc(doc(db, DB_QUIZZ, id as string))
      setQuizz({ ...(d.data() as Quizz), id: d.id })
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchQuizz()
  }, [router.isReady])

  return (
    <div>
      <h1>{quizz?.title}</h1>
      <form onSubmit={handleSubmit(addQuestion)}>
        <fieldset>
          <label htmlFor="question">Question</label>
          <input required type="text" {...register("question")} />
        </fieldset>
        <fieldset>
          <label htmlFor="answer1.answer">Réponse 1</label>
          <input required type="text" {...register("answer1.answer")} />
          <input
            type="checkbox"
            {...register("answer1.isGood")}
            onChange={(e) => handleCheckbox(e, "answer1")}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="answer2.answer">Réponse 2</label>
          <input required type="text" {...register("answer2.answer")} />
          <input
            type="checkbox"
            {...register("answer2.isGood")}
            onChange={(e) => handleCheckbox(e, "answer2")}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="answer3.answer">Réponse 3</label>
          <input required type="text" {...register("answer3.answer")} />
          <input
            type="checkbox"
            {...register("answer3.isGood")}
            onChange={(e) => handleCheckbox(e, "answer3")}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="answer4.answer">Réponse 4</label>
          <input required type="text" {...register("answer4.answer")} />
          <input
            type="checkbox"
            {...register("answer4.isGood")}
            onChange={(e) => handleCheckbox(e, "answer4")}
          />
        </fieldset>
        <button type="submit">Créer question</button>
      </form>
      <div>
        {quizz?.questions.map((q, i) => (
          <div key={i}>
            <p>{q.question}</p>
            <button onClick={() => removeQuestion(q)}>Supprimer</button>
            <ul>
              {q.answers.map((a, j) => (
                <li key={j}>
                  {a.answer} {a.isGood && "👍"}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Quizz
