"use client"

import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import Register from "./auth/Register"
import Login from "./auth/Login"
import HistoryChat from "./dashboard/History"
import DashboardContainer from "./dashboard/DashboardContainer"
import React from "react"
import People from "./dashboard/People"
import Profile from "./dashboard/Profile"
import { usePathname } from "next/navigation"
import PeopleDetail from "./dashboard/PeopleDetail"
import AuthContainer from "./auth/AuthContainer"
import CompleteBio from "./auth/CompleteBio"

const Sidebar = () => {
  const { userId, isVerified } = useSelector((state: RootState) => state.auth)
  const pathname = usePathname()

  const renderAuthComponent = () => {
    let component: React.JSX.Element

    switch (pathname) {
      case "/complete-bio":
        component = <CompleteBio />
        break
      case "/register":
        component = <Register />
        break
      default:
        component = <Login />
    }

    return (
      <AuthContainer>
        {component}
      </AuthContainer>
    )
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
      <DashboardContainer>
        {component}
      </DashboardContainer>
    )
  }

  return (
    <aside className="bg-second w-[35%] z-50">
      {
        (userId && isVerified) ?
          renderDashboardComponent()
          :
          renderAuthComponent()
      }
    </aside>
  )
}

export default Sidebar