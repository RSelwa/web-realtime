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
    <div className="mt-20 flex h-full items-center justify-center">
      <div className="w-10/12 rounded-lg bg-gray-100 p-8 shadow-lg md:w-1/3">
        <form onSubmit={handleSubmit(registerUser)} className="space-y-4">
          <fieldset>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-md border p-2"
            ></input>
          </fieldset>
          <fieldset>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-md border p-2"
            ></input>
          </fieldset>
          <button
            type="submit"
            className="w-full rounded-md bg-orange-500 py-2 font-bold text-white hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
