import { DB_ROOMS, DB_USERS } from "@/constants"
import { db } from "@/constants/db"
import { socket } from "@/utils/socket"
import { addDoc, collection } from "firebase/firestore"
import Link from "next/link"
import React from "react"
import { useForm } from "react-hook-form"

type Props = {}

const Room = (props: Props) => {
  const { register, handleSubmit, getValues } = useForm<{ pseudo: string }>()
  const joinRoom = (data: { pseudo: string }) => {
    socket.emit("join-room", data.pseudo)
  }
  const createRoom = (data: { pseudo: string }) => {
    try {
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(joinRoom)}>
        <fieldset>
          <label htmlFor="pseudo">Pseudo</label>
          <input type="text" {...register("pseudo")} />
        </fieldset>
        <Link href={`/room/${getValues("pseudo")}`}>Rejoindre</Link>
      </form>
    </div>
  )
}

export default Room
