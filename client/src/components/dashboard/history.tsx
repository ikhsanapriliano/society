/* eslint-disable react-hooks/exhaustive-deps */
import { RootState } from "@/store/store"
import { UserRoomResponse } from "@/types/chat"
import { get } from "@/utils/axios"
import { handleError } from "@/utils/error"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const HistoryChat = () => {
    const [inputs, setInputs] = useState({ value: "", type: "all" })
    const token = useSelector((state: RootState) => state.auth.token)
    const dispatch = useDispatch()
    const [rooms, setRooms] = useState<UserRoomResponse[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname().split("/")[2]

    useEffect(() => {
        fetchRooms()
    }, [])

    const fetchRooms = async () => {
        try {
            setIsLoading(true)
            const data = await get<UserRoomResponse[]>("/rooms", token, undefined) as UserRoomResponse[]
            setRooms(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            handleError(error, dispatch)
        }
    }

    return (
        <section className="p-5 w-full h-[90%] flex flex-col">
            <h2 className="font-semibold text-[20px]">Chats</h2>
            <form>
                <div className="relative mt-5">
                    <input type="text" placeholder="search you chat history" className="w-full bg-third h-[40px] pl-12 pr-2 rounded-md" />
                    <button type="submit" className="absolute left-0 h-full px-4"><i className="fa-solid fa-search"></i></button>
                </div>
                <div className="flex gap-3 mt-3">
                    <button type="submit" className={`${inputs.type === "all" ? "bg-fifth" : "border border-third"} px-5 py-1 rounded-md`}>all</button>
                    <button type="submit" className={`${inputs.type === "unread" ? "bg-fifth" : "border border-third"} px-5 py-1 rounded-md`}>unread</button>
                </div>
            </form>
            <div className="mt-5 flex-grow overflow-auto">
                {
                    isLoading ?
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        :
                        rooms.length === 0 ?
                            <p className="text-sm w-full text-center mt-3">No chats found.</p>
                            :
                            <>
                                {
                                    rooms.map((item, index) => (
                                        <Link href={`/chats/${item.id}`} key={index} className={`flex p-5 gap-5 w-full text-left hover:bg-first ${pathname === item.id ? "bg-third" : ""}`}>
                                            <div className="flex-shrink-0 w-[50px] h-[50px] rounded-full overflow-hidden">
                                                <Image src={item.photo} alt="photo" width={0} height={0} sizes="100vw" className="w-full h-auto" />
                                            </div>
                                            <div className="text-white w-full">
                                                <p className="text-lg font-semibold">{item.username}</p>
                                                <p className="text-sm font-light">{item.message ? item.message : "-"}</p>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </>
                }
            </div>
        </section>
    )
}

export default HistoryChat