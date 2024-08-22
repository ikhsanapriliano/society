"use client"

import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import Register from "./auth/register"
import Login from "./auth/login"
import HistoryChat from "./dashboard/history"
import Dashboard from "./dashboard"
import React from "react"
import People from "./dashboard/people"
import Profile from "./dashboard/profile"

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
    let component: React.JSX.Element

    switch (location) {
      case "people":
        component = <People />
        break
      case "profile":
        component = <Profile />
        break
      default:
        component = <HistoryChat />
    }

    return (
      <Dashboard>
        {component}
      </Dashboard>
    )
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