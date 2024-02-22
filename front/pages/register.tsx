import { DB_USERS } from "@/constants"
import { auth, db } from "@/constants/db"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import React from "react"
import { useForm } from "react-hook-form"

type RegisterForm = { email: string; password: string }
const Register = () => {
  const { register, handleSubmit } = useForm<RegisterForm>()
  const registerUser = async (data: RegisterForm) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )
      await setDoc(doc(db, DB_USERS, userCredentials.user.uid), {
        email: userCredentials.user.email,
        creationTime: userCredentials.user.metadata.creationTime,
        isAdmin: false
      })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <form onSubmit={handleSubmit(registerUser)}>
      <fieldset>
        <label htmlFor="email">Email</label>
        <input type="email" {...register("email")}></input>
      </fieldset>
      <fieldset>
        <label htmlFor="email">Password</label>
        <input type="password" {...register("password")}></input>
      </fieldset>
      <button type="submit">Register</button>
    </form>
  )
}

export default Register
