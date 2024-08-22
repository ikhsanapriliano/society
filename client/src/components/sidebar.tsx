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
import { usePathname } from "next/navigation"
import PeopleDetail from "./dashboard/peopledetail"

const Sidebar = () => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const pathname = usePathname()

  const renderAuthComponent = () => {
    switch (pathname) {
      case "/register":
        return <Register />
      default:
        return <Login />
    }
  }

  const renderDashboardComponent = () => {
    let component: React.JSX.Element

    switch (pathname) {
      case "/people":
        component = <People />
        break
      case "/profile":
        component = <Profile />
        break
      default:
        if (pathname.includes("people")) {
          component = <PeopleDetail />
        } else {
          component = <HistoryChat />
        }
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