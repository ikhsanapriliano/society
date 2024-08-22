/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { RootState } from "@/store/store"
import { RoomChatPayload, RoomResponse } from "@/types/chat"
import { get, post } from "@/utils/axios"
import { handleError } from "@/utils/error"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const Page = () => {
    const roomId = usePathname().split("/")[2]
    const dispatch = useDispatch()
    const token = useSelector((state: RootState) => state.auth.token)
    const [room, setRoom] = useState<RoomResponse>()
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState("")

    useEffect(() => {
        fetchRoom()
    }, [])

    const fetchRoom = async () => {
        try {
            const data = await get<RoomResponse>(`/rooms/${roomId}`, token, undefined) as RoomResponse
            setRoom(data)
            setIsLoading(false)
        } catch (error) {
            handleError(error, dispatch)
        }
    }

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            setIsLoading(true)

            const data = message.trim()

            if (data == "") {
                setIsLoading(false)
                return
            }

            const payload: RoomChatPayload = { message: data, roomId }
            await post<RoomChatPayload, undefined>("/rooms/chats", token, payload)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            handleError(error, dispatch)
        }
    }

    return (
        <>
            {
                isLoading ?
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    :
                    <section className="flex flex-col justify-between h-full">
                        <header className="py-3 px-5 flex items-center gap-5 bg-third">
                            <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                                <Image src={room!.secondUser.photo} alt="photo" width={0} height={0} sizes="100vw" className="w-full h-auto" />
                            </div>
                            <div>
                                <p className="font-semibold">{room?.secondUser.username}</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-[10px] h-[10px] bg-fifth rounded-full"></div>
                                    <p className="text-[14px] font-light">online</p>
                                </div>
                            </div>
                        </header>
                        <div className="p-5 flex-grow">
                            {
                                room?.chats.map((chat, index) => (
                                    <div key={index} className={`flex ${chat.senderId === room.firstUserId ? "justify-end" : "justify-start"}`}>
                                        <div className={`${chat.senderId === room.firstUserId ? "bg-fifth" : "bg-forth"} py-2 px-4 rounded-md mb-2`}>
                                            {chat.message}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <footer className="h-[10%] 2xl:max-h-[100px] px-5 flex gap-5 justify-center items-center bg-third">
                            <button><i className="fa-solid fa-face-smile"></i></button>
                            <button><i className="fa-solid fa-plus"></i></button>
                            <form onSubmit={(e) => { sendMessage(e) }} className="flex w-full gap-5">
                                <input onChange={(e) => { setMessage(e.target.value) }} value={message} type="text" placeholder="type a message" className="h-[40px] w-full px-4 rounded-md bg-third border border-forth" />
                                <button type="submit"><i className="fa-solid fa-paper-plane"></i></button>
                            </form>
                        </footer>
                    </section>
            }
        </>
    )
}

export default Page