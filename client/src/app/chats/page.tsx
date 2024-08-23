/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { clearPeopleDetail } from "@/slices/peopledetail"
import { RootState } from "@/store/store"
import { CreateRoomPayload, CreateRoomResponse } from "@/types/chat"
import { post } from "@/utils/axios"
import { handleError } from "@/utils/error"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Loading from "../loading"

const Page = () => {
  const token = useSelector((state: RootState) => state.auth.token)
  const secondUserId = useSelector((state: RootState) => state.peopledetail.id)
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (secondUserId === "") {
      router.push("/")
      return
    }

    handleRoom()
  }, [])

  const handleRoom = async () => {
    try {
      const payload: CreateRoomPayload = {
        secondUserId
      }

      const data = await post<CreateRoomPayload, CreateRoomResponse>("/rooms", token, payload) as CreateRoomResponse
      dispatch(clearPeopleDetail())
      router.push(`/chats/${data.roomId}`)
    } catch (error) {
      handleError(error, dispatch)
    }
  }

  return (
    <Loading />
  )
}

export default Page