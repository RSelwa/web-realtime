import { socket } from "@/utils/socket"
import { useRouter } from "next/router"
import React, { useEffect } from "react"

type Props = {}

const RoomId = (props: Props) => {
  const router = useRouter()
  const { id } = router.query || ""
  useEffect(() => {
    socket.emit("join-room", id)

    return () => socket.emit("leave-room", id)
  }, [router.isReady])

  return <div>RoomId</div>
}

export default RoomId
