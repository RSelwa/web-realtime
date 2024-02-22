import { auth } from "@/constants/db"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import React from "react"
import { useForm } from "react-hook-form"

type LoginForm = { email: string; password: string }
const Login = () => {
  const { register, handleSubmit } = useForm<LoginForm>()
  const registerUser = async (data: LoginForm) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )
      console.log(userCredentials)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="mt-20 flex h-full items-center justify-center">
      <div className="w-10/12 rounded-lg bg-gray-100 p-8 shadow-lg md:w-1/3">
        <form onSubmit={handleSubmit(registerUser)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-md border p-2"
            ></input>
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-md border p-2"
            ></input>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 py-2 font-bold text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
