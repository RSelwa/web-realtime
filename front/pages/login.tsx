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
    <form onSubmit={handleSubmit(registerUser)}>
      <fieldset>
        <label htmlFor="email">Email</label>
        <input type="email" {...register("email")}></input>
      </fieldset>
      <fieldset>
        <label htmlFor="email">Password</label>
        <input type="password" {...register("password")}></input>
      </fieldset>
      <button type="submit">Login</button>
    </form>
  )
}

export default Login
