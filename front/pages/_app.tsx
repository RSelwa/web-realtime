import "@/styles/globals.css"
import useFirebaseAuth from "@/utils"
import { getItemFromLocalStorage } from "@/utils/storage"
import type { AppProps } from "next/app"
function MyApp({ Component, pageProps }: AppProps) {
  useFirebaseAuth()
  return <Component {...pageProps} />
}

export default MyApp
