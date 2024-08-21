"use client"

import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import Register from "./auth/register"
import Login from "./auth/login"
import HistoryChat from "./dashboard/history"

const Sidebar = () => {
  const location = useSelector((state: RootState) => state.sidebar.location)
  const userId = useSelector((state: RootState) => state.auth.userId)

  const renderAuthComponent = () => {
    switch (location) {
      case "register":
        return <Register />
      default:
        return <Login />
    }
  }

  const renderDashboardComponent = () => {
    switch (location) {
      case "register":
        return <Register />
      default:
        return <HistoryChat />
    }
  }

  return (
    <aside className="bg-second w-[35%]">
      {
        userId ?
          renderDashboardComponent()
          :
          renderAuthComponent()
      }
    </aside>
  )
}

export default Sidebar