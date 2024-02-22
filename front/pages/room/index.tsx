import { DB_ROOMS, DB_USERS } from "@/constants"
import { db } from "@/constants/db"
import type { UsersRoom } from "@/types"
import { socket } from "@/utils/socket"
import { getItemFromLocalStorage } from "@/utils/storage"
import { addDoc, collection } from "firebase/firestore"
import Link from "next/link"
import React from "react"
import { useForm } from "react-hook-form"

const Room = () => {
  const { id, email } = getItemFromLocalStorage("user", { id: "", email: "" })
  const { register, handleSubmit, getValues } = useForm<{ pseudo: string }>()
  const joinRoom = (data: { pseudo: string }) => {
    socket.emit("join-room", data.pseudo)
  }
  const createRoom = () => {
    const newUser: UsersRoom = {
      pseudo: getValues("pseudo"),
      id,
      email,
      pts: 0,
      isLeader: true
    }
    socket.emit("create-room", newUser)
  }

  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-black bg-cover bg-center">
      <div className="flex flex-col items-center">
        <form onSubmit={handleSubmit(joinRoom)} className="text-white">
          <fieldset className="mb-4">
            <label htmlFor="pseudo" className=" mr-4  text-white">
              Pseudo :
            </label>
            <input
              required
              type="text"
              {...register("pseudo")}
              className="rounded-md bg-gray-800 p-2 text-white"
            />
          </fieldset>
          <div className="flex">
            <Link href={`/room/${getValues("pseudo")}`} legacyBehavior>
              <a className="flex-1 rounded-l-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                Rejoindre
              </a>
            </Link>
            <button
              onClick={createRoom}
              className="flex-1 rounded-r-md bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Room
