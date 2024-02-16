import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const apiKey = process.env.NEXT_PUBLIC_FBASE_API_KEY
const projectId = process.env.NEXT_PUBLIC_FBASE_PROJECT_ID || ""
const messagingSenderId = process.env.NEXT_PUBLIC_FBASE_MESSAGING_SENDER_ID
const appId = process.env.NEXT_PUBLIC_FBASE_APP_ID

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId,
  databaseURL: `https://${projectId}.firebaseio.com`,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId,
  appId
}

// ! Error if exporting app with a const (maybe due to creation of reference of app and not the real app)
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth()
