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
    <div>
      <form>
        <fieldset>
          <label htmlFor="pseudo">Pseudo</label>
          <input required type="text" {...register("pseudo")} />
        </fieldset>
        <Link href={`/room/${getValues("pseudo")}`} legacyBehavior>
          <a>Rejoindre</a>
        </Link>
      </form>
      <div>
        <button onClick={createRoom}>Créer</button>
      </div>
    </div>
  )
}

export default Room
