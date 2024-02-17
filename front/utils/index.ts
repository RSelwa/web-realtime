import { useEffect, useRef, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import type { DocumentReference } from "firebase/firestore"
import { doc, getDoc, onSnapshot } from "firebase/firestore"

import { DB_USERS } from "@/constants"
import { auth, db } from "@/constants/db"
import { getItemFromLocalStorage } from "@/utils/storage"

type AuthState = {
  pending: boolean
  user: User | null
  isSignedIn: boolean
}
const defaultAuth: AuthState = {
  pending: true,
  user: null,
  isSignedIn: false
}
export const useFirebaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuth)
  const registerDocSnapshot = useRef<() => void>()

  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, async (user) => {
      setAuthState({ user, pending: false, isSignedIn: !!user })
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const reference = doc(db, DB_USERS, auth.currentUser?.uid || "")
      onSnapshot(reference, async (doc) => {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...doc.data(), id: doc.id })
        )
      })
    })
    return () => unregisterAuthObserver()
  }, [])

  useEffect(() => {
    if (authState.pending) return
    if (!authState.isSignedIn && !authState.pending) {
      registerDocSnapshot.current?.()

      return
    }
    const reference = doc(
      db,
      DB_USERS,
      auth.currentUser?.uid || ""
    ) as DocumentReference<any>
    registerDocSnapshot.current = onSnapshot(reference, async (doc) => {
      if (!doc.exists()) return
      const data = doc.data()
      if (!data) return
    })
    return () => registerDocSnapshot.current?.()
  }, [authState.pending, authState.user?.uid])

  return { auth, ...authState }
}
