/* eslint-disable react-hooks/exhaustive-deps */
import { RootState } from "@/store/store"
import { UserRoomResponse } from "@/types/chat"
import { get } from "@/utils/axios"
import { handleError } from "@/utils/error"
import { usePathname } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AnimatePresence, motion } from "framer-motion"
import RoomCard from "../chat/RoomCard"

const HistoryChat = () => {
    const [inputs, setInputs] = useState({ value: "", isUnread: false })
    const token = useSelector((state: RootState) => state.auth.token)
    const dispatch = useDispatch()
    const [rooms, setRooms] = useState<UserRoomResponse[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname().split("/")[2]
    const { data, users } = useSelector((state: RootState) => state.websocket)
    const [isAnimate, setIsAnimate] = useState(false)
    const topCard = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (rooms.length !== 0) {
            if (pathname === rooms[0].id) {
                setIsAnimate(false)
            } else {
                setIsAnimate(true)
            }
        }

        fetchRooms()
        topCard.current?.scrollIntoView()
    }, [data])

    useEffect(() => {
        if (rooms.length !== 0) {
            const newData = rooms.map((item) => {
                let temp: UserRoomResponse = { ...item }

                if (users.includes(item.userId)) {
                    temp.isOnline = true
                } else {
                    temp.isOnline = false
                }

                return temp
            })

            setRooms(newData)
        }
    }, [users])

    const fetchRooms = async (e?: FormEvent<HTMLFormElement>) => {
        try {
            if (e) e.preventDefault()
            setIsLoading(true)

            let query = `history=${inputs.value}`
            if (inputs.isUnread) {
                query += `&isUnread=true`
            }

            const data = await get<UserRoomResponse[]>("/rooms", token, query) as UserRoomResponse[]

            const newData = data.map((item) => {
                let temp: UserRoomResponse = { ...item }

                if (users.includes(item.userId)) {
                    temp.isOnline = true
                }

                return temp
            })

            setRooms(newData)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            handleError(error, dispatch)
        }
    }

    return (
        <section className="p-5 w-full h-[90%] flex flex-col">
            <h2 className="font-semibold text-[20px]">Chats</h2>
            <form onSubmit={(e) => { fetchRooms(e) }}>
                <div className="relative mt-5">
                    <input type="text" onChange={(e) => { setInputs(prev => ({ ...prev, value: e.target.value })) }} value={inputs.value} placeholder="search your chat history" className="w-full bg-third h-[40px] pl-12 pr-2 rounded-md" />
                    <button type="submit" className="absolute left-0 h-full px-4"><i aria-hidden className="fa-solid fa-search"></i></button>
                </div>
                <div className="flex gap-3 mt-3">
                    <button type="submit" onClick={() => { setInputs(prev => ({ ...prev, isUnread: false })) }} className={`${!inputs.isUnread ? "bg-fifth" : "border border-third"} px-5 py-1 rounded-md`}>all</button>
                    <button type="submit" onClick={() => { setInputs(prev => ({ ...prev, isUnread: true })) }} className={`${inputs.isUnread ? "bg-fifth" : "border border-third"} px-5 py-1 rounded-md`}>unread</button>
                </div>
            </form>
            <div className="mt-5 flex-grow overflow-y-auto overflow-x-hidden">
                <AnimatePresence>
                    <motion.div
                        initial={{ x: -100 }}
                        animate={{ x: 0 }}
                        exit={{ x: 100 }}
                    >
                        {
                            isLoading ?
                                rooms.map((item) => (
                                    (item.message && !isAnimate) && <RoomCard rooms={rooms} setRooms={setRooms} ref={item.id === pathname ? topCard : undefined} key={item.id} item={item} isAnimate={isAnimate} pathname={pathname} />
                                ))
                                :
                                <>
                                    {
                                        rooms.length === 0 ?
                                            <p className="text-sm w-full text-center mt-3">No chats found.</p>
                                            :
                                            rooms.map((item) => (
                                                item.message && <RoomCard rooms={rooms} setRooms={setRooms} ref={item.id === pathname ? topCard : undefined} key={item.id} item={item} isAnimate={isAnimate} pathname={pathname} />
                                            ))
                                    }
                                </>

                        }
                    </motion.div>
                </AnimatePresence>
            </div>
        </section >
    )
}

export default HistoryChat