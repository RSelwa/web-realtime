import { socket } from "@/utils/socket"
import Link from "next/link"
import React from "react"
import { useForm } from "react-hook-form"

type Props = {}

const Room = (props: Props) => {
  const { register, handleSubmit, getValues } = useForm<{ roomName: string }>()
  const joinRoom = (data: { roomName: string }) => {
    socket.emit("join-room", data.roomName)
  }
  return (
    <div>
      <form onSubmit={handleSubmit(joinRoom)}>
        <fieldset>
          <label htmlFor="roomName">Room</label>
          <input type="text" {...register("roomName")} />
        </fieldset>
        <Link href={`/room/${getValues("roomName")}`}>Rejoindre</Link>
      </form>
    </div>
  )
}

export default Room
