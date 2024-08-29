"use client"

import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

import DashboardContainer from "./dashboard/DashboardContainer"
import React from "react"

import { usePathname } from "next/navigation"

import AuthContainer from "./auth/AuthContainer"
import CompleteBio from "./auth/CompleteBio"
import Register from "./auth/register"
import Login from "./auth/login"
import People from "./dashboard/People"
import Profile from "./dashboard/Profile"
import PeopleDetail from "./dashboard/PeopleDetail"
import HistoryChat from "./dashboard/History"

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
    <aside className={`bg-second w-full md:w-[35%] z-50 ${pathname.includes("/chats") ? "hidden md:inline-block" : "inline-block"}`}>
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
