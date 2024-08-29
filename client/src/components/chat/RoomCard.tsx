import { UserRoomResponse } from "@/types/chat"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Dispatch, LegacyRef, SetStateAction } from "react"

interface Room {
    item: UserRoomResponse
    isAnimate: boolean
    pathname: string
    ref: LegacyRef<HTMLButtonElement> | undefined
    rooms: UserRoomResponse[]
    setRooms: Dispatch<SetStateAction<UserRoomResponse[]>>
}

const RoomCard = ({ item, isAnimate, pathname, ref, rooms, setRooms }: Room) => {
    const router = useRouter()

    return (
        <motion.button
            ref={ref}
            onClick={async () => {
                const newRooms = rooms.map((room) => ({
                    ...room,
                    unread: room.id === item.id ? 0 : room.unread
                }))

                setRooms(newRooms)
                sessionStorage.setItem("secondUser", item.userId)
                router.push(`/chats/${item.id}`)
            }}
            key={item.id}
            className={`flex p-5 gap-5 w-full text-left hover:bg-first ${pathname === item.id ? "bg-third" : ""}`}
            initial={{ x: (pathname !== item.id && isAnimate) ? -100 : 0, y: (pathname === item.id && isAnimate) ? 100 : 0 }}
            animate={{ x: 0, y: 0 }}
        >
            <div className="relative">
                <div className="flex-shrink-0 w-[50px] h-[50px] rounded-full overflow-hidden">
                    <Image src={item.photo} alt="photo" width={0} height={0} sizes="100vw" className="w-full h-auto" />
                </div>
                {item.isOnline && <div className="absolute top-[-5px] right-[-5px] w-[20px] h-[20px] bg-green-500 rounded-full"></div>}
            </div>
            <div className="text-white w-full flex justify-between">
                <div className="">
                    <p className="text-lg font-semibold">{item.username}</p>
                    <p className="text-sm font-light max-w-[170px] max-h-[20px] overflow-ellipsis overflow-hidden">{item.message}</p>
                </div>
                <div className="flex flex-col justify-between items-end w-fit">
                    <p className={`text-sm ${item.unread > 0 ? "font-semibold" : ""}`}>{item.date}</p>
                    {item.unread !== 0 && <div className="w-[22px] h-[22px] rounded-full bg-fifth flex justify-center items-center text-sm">{item.unread}</div>}
                </div>
            </div>
        </motion.button>
    )
}

export default RoomCard
