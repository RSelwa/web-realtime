"use client"
import Layout from "@/components/layout"
import "@/styles/globals.css"
import { useFirebaseAuth } from "@/utils"
import type { AppProps } from "next/app"
import { useEffect } from "react"

function MyApp({ Component, pageProps }: AppProps) {
  useFirebaseAuth()

  return (
    <Layout>
      <Component {...pageProps} suppressHydrationWarning />
    </Layout>
  )
}

export default MyApp
