/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import Loading from "@/app/loading"
import { RootState } from "@/store/store"
import { ChatFormat, RoomChatPayload, RoomResponse } from "@/types/chat"
import { WebsocketMessage } from "@/types/websocket"
import { get, post } from "@/utils/axios"
import { handleError } from "@/utils/error"
import { AnimatePresence } from "framer-motion"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"

const Page = () => {
    const roomId = usePathname().split("/")[2]
    const dispatch = useDispatch()
    const { token, userId } = useSelector((state: RootState) => state.auth)
    const { socket, data } = useSelector((state: RootState) => state.websocket)
    const [room, setRoom] = useState<RoomResponse>()
    const [chats, setChats] = useState<ChatFormat[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState("")
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchRoom()
    }, [data])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [chats])

    const fetchRoom = async () => {
        try {
            const data = await get<RoomResponse>(`/rooms/${roomId}`, token, undefined) as RoomResponse
            setRoom(data)

            if (data.chats.length !== 0) {
                setChats(data.chats.map(chat => ({ senderId: chat.senderId, message: chat.message! })))
            }

            setIsLoading(false)
        } catch (error) {
            handleError(error, dispatch)
        }
    }

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()

            const newMessage = message.trim()

            if (newMessage == "") {
                return
            }

            const payload: RoomChatPayload = { message: newMessage, roomId }
            await post<RoomChatPayload, undefined>("/rooms/chats", token, payload)

            const wsPayload: WebsocketMessage = {
                sender: userId!,
                receiver: room!.secondUser.id,
                data: {
                    senderId: userId!,
                    message: newMessage
                }
            }

            socket?.send(JSON.stringify(wsPayload))
            setMessage("")
        } catch (error) {
            console.log(error)
            handleError(error, dispatch)
        }
    }

    return (
        <AnimatePresence>
            {
                isLoading ?
                    <Loading />
                    :
                    <motion.section
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col justify-between h-full">
                        <header className="h-[10%] 2xl:max-h-[100px] py-3 px-5 flex items-center gap-5 bg-third">
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
                        <div ref={containerRef} className="p-5 flex-grow h-[80%] overflow-auto bg-first">
                            {
                                chats.length !== 0 && chats.map((chat, index) => (
                                    <div key={index} className={`flex ${chat.senderId === room!.firstUserId ? "justify-end" : "justify-start"}`}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`${chat.senderId === room!.firstUserId ? "bg-fifth" : "bg-forth"} py-2 px-4 rounded-md mb-2`}>
                                            {chat.message}
                                        </motion.div>
                                    </div>
                                ))
                            }
                        </div>
                        <footer className="h-[10%] 2xl:max-h-[100px] px-5 flex gap-5 justify-center items-center bg-third">
                            <button><i aria-hidden className="fa-solid fa-face-smile"></i></button>
                            <button><i aria-hidden className="fa-solid fa-plus"></i></button>
                            <form onSubmit={(e) => { sendMessage(e) }} className="flex w-full gap-5">
                                <input onChange={(e) => { setMessage(e.target.value) }} value={message} type="text" placeholder="type a message" className="h-[40px] w-full px-4 rounded-md bg-third border border-forth" />
                                <button type="submit"><i aria-hidden className="fa-solid fa-paper-plane"></i></button>
                            </form>
                        </footer>
                    </motion.section>
            }
        </AnimatePresence>
    )
}

export default Page