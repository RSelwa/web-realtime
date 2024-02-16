import Layout from "@/components/layout"
import "@/styles/globals.css"
import useFirebaseAuth from "@/utils"
import { socket } from "@/utils/socket"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

function MyApp({ Component, pageProps }: AppProps) {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [fooEvents, setFooEvents] = useState<any[]>([])

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onFooEvent(value: any) {
      setFooEvents((previous) => [...previous, value])
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("foo", onFooEvent)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("foo", onFooEvent)
    }
  }, [])

  useFirebaseAuth()
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
