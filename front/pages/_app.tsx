"use client"
import Layout from "@/components/layout"
import "@/styles/globals.css"
import { useFirebaseAuth } from "@/utils"
import { socket } from "@/utils/socket"
import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import { useEffect } from "react"

function MyApp({ Component, pageProps }: AppProps) {
  useFirebaseAuth()
  const router = useRouter()
  useEffect(() => {
    socket.on("redirect-user-room", (roomId: string) => {
      console.log("redirect-user-room", roomId)

      router.push(`/room/${roomId}`)
    })
    return () => {
      socket.off("redirect-user-room")
    }
  }, [])
  return (
    <Layout>
      <Component {...pageProps} suppressHydrationWarning />
    </Layout>
  )
}

export default MyApp
