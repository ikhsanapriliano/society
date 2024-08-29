/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import Loading from "@/app/loading"
import { RootState } from "@/store/store"
import { ChatFormat, RoomChatPayload, RoomResponse } from "@/types/chat"
import { WebsocketMessage, WebsocketMessageRead } from "@/types/websocket"
import { get, patch, post } from "@/utils/axios"
import { handleError } from "@/utils/error"
import { AnimatePresence } from "framer-motion"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { setIsRead } from "@/slices/websocket"
import Link from "next/link"

const Page = () => {
    const roomId = usePathname().split("/")[2]
    const dispatch = useDispatch()
    const { token, userId } = useSelector((state: RootState) => state.auth)
    const { socket, data, isRead } = useSelector((state: RootState) => state.websocket)
    const [room, setRoom] = useState<RoomResponse>()
    const [chats, setChats] = useState<ChatFormat[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState("")
    const containerRef = useRef<HTMLDivElement>(null)
    const [paragraph, setParagraph] = useState(1)
    const textRef = useRef<HTMLTextAreaElement>(null)
    const [isSending, setIsSending] = useState(false)
    const online = useSelector((state: RootState) => state.websocket.users)
    const secondUser = sessionStorage.getItem("secondUser")

    useEffect(() => {
        fetchRoom().then(() => {
            dispatch(setIsRead(false))
        })
    }, [isRead])

    useEffect(() => {
        updateRead().then(() => {
            fetchRoom().then(() => {
                textRef.current?.focus()
            })
        })
    }, [data])

    useEffect(() => {
        if (room !== undefined) {
            let newData = { ...room }
            if (online.includes(newData.secondUser.id)) {
                newData.secondUser.isOnline = true
            } else {
                newData.secondUser.isOnline = false
            }
            setRoom(newData)
        }
    }, [online])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [chats])

    const updateRead = async () => {
        try {
            await patch<undefined, undefined>(`/rooms/${roomId}/chats`, token, undefined)

            const wsPayload: WebsocketMessageRead = {
                sender: userId!,
                receiver: secondUser as string,
                isRead: true,
            }

            socket?.send(JSON.stringify(wsPayload))
        } catch (error) {
            handleError(error, dispatch)
        }
    }

    const fetchRoom = async () => {
        try {
            const data = await get<RoomResponse>(`/rooms/${roomId}`, token, undefined) as RoomResponse

            let newData = { ...data }
            if (online.includes(newData.secondUser.id)) {
                newData.secondUser.isOnline = true
            }

            setRoom(newData)

            if (newData.chats.length !== 0) {
                setChats(newData.chats.map(chat => ({
                    senderId: chat.senderId,
                    message: chat.message!,
                    time: chat.createdAt,
                    status: chat.status
                })))
            }
            setIsLoading(false)
        } catch (error) {
            handleError(error, dispatch)
        }
    }

    const sendMessage = async (e?: FormEvent<HTMLFormElement>) => {
        try {
            if (e) e.preventDefault()
            setIsSending(true)
            console.log(room)

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
                    message: newMessage,
                    time: new Date().toString(),
                    status: "sent"
                }
            }

            socket?.send(JSON.stringify(wsPayload))
            if (paragraph > 1) setParagraph(1)
            setMessage("")
            setIsSending(false)
        } catch (error) {
            console.log(error)
            handleError(error, dispatch)
        }
    }

    const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }

        if (e.key === "Enter" && e.shiftKey) {
            if (paragraph < 5) setParagraph(prev => prev + 1)
        }

        if (e.key === "Backspace") {
            if (textRef.current!.selectionStart) {
                if (paragraph > 1) {
                    setParagraph(prev => prev - 1)
                }
            }
        }
    }

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        let value = e.target.value

        if (textRef.current!.scrollHeight > textRef.current!.clientHeight) {
            if (paragraph < 5) setParagraph(prev => prev + 1)
        }

        setMessage(value)
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
                        <header className="h-[10%] 2xl:max-h-[100px] py-2 px-5 flex items-center gap-5 bg-third">
                            <Link href={"/"} className="inline-block md:hidden"><i className="fa-solid fa-arrow-left"></i></Link>
                            <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                                <Image src={room!.secondUser.photo} alt="photo" width={0} height={0} sizes="100vw" className="w-full h-auto" />
                            </div>
                            <div>
                                <p className="font-semibold">{room?.secondUser.username}</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-[10px] h-[10px] ${room?.secondUser.isOnline ? "bg-green-500" : "bg-red-500"} rounded-full`}></div>
                                    <p className="text-[14px] font-light">{room?.secondUser.isOnline ? "online" : "offline"}</p>
                                </div>
                            </div>
                        </header>
                        <div ref={containerRef} className="p-5 flex-grow h-[80%] overflow-auto bg-first">
                            {
                                chats.length !== 0 && chats.map((chat, index) => (
                                    <div key={index} className={`flex ${chat.senderId === room!.firstUserId ? "justify-end" : "justify-start"} w-full`}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`${chat.senderId === room!.firstUserId ? "bg-fifth" : "bg-third"} relative py-2 px-4 rounded-md mb-2 whitespace-pre-wrap break-words max-w-[90%]`}>
                                            <p className="pr-[3.3rem]">{chat.message}</p>
                                            <div className="absolute right-2 bottom-1 flex gap-2 items-center">
                                                <p className="text-xs font-light text-gray-400">{chat.time}</p>
                                                <i className={`fa-solid fa-check-double text-xs ${chat.status === "read" ? "text-blue-500" : "text-gray-400"}`}></i>
                                            </div>
                                        </motion.div>
                                    </div>
                                ))
                            }
                        </div>
                        <footer className={`${paragraph === 1 ? "h-[10%] 2xl:max-h-[100px]" : "h-fit"} py-5 px-5 flex gap-5 justify-center items-center bg-third`}>
                            <button><i aria-hidden className="fa-solid fa-face-smile"></i></button>
                            <button><i aria-hidden className="fa-solid fa-plus"></i></button>
                            <form onSubmit={(e) => { sendMessage(e) }} className="flex w-full h-full gap-5 justify-center items-center">
                                <textarea
                                    ref={textRef}
                                    rows={paragraph}
                                    onKeyDown={(e) => { handleKey(e) }}
                                    onChange={(e) => { handleChange(e) }}
                                    value={message} placeholder="type a message"
                                    className="h-fit w-full resize-none px-4 py-1 focus:outline-none overflow-visible rounded-md bg-third border border-forth">
                                </textarea>
                                {
                                    isSending ?
                                        <i className="fa-solid fa-spin fa-spinner"></i>
                                        :
                                        <button type="submit"><i aria-hidden className="fa-solid fa-paper-plane"></i></button>
                                }
                            </form>
                        </footer>
                    </motion.section>
            }
        </AnimatePresence>
    )
}

export default Page