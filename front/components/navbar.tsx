import { getItemFromLocalStorage } from "@/utils/storage"
import Link from "next/link"
import React from "react"

const Navbar = () => {
  const { isAdmin } = getItemFromLocalStorage("user", {
    isAdmin: false
  })
  console.log(isAdmin)

  return (
    <div className="m-0 flex items-center justify-between bg-slate-800 px-4 py-2 text-white">
      <h1>
        <Link href="/">Quiz</Link>
      </h1>
      <div className="flex items-center gap-3">
        <Link href="/room">Room</Link>
        {isAdmin && <Link href="/my-quizz">Mes quizz</Link>}
      </div>
    </div>
  )
}

export default Navbar
