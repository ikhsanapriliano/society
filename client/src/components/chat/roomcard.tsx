import { UserRoomResponse } from "@/types/chat"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { LegacyRef } from "react"

interface Room {
    item: UserRoomResponse
    isAnimate: boolean
    pathname: string
    ref: LegacyRef<HTMLButtonElement> | undefined
}

const RoomCard = ({ item, isAnimate, pathname, ref }: Room) => {
    const router = useRouter()

    return (
        <motion.button
            ref={ref}
            onClick={() => { router.push(`/chats/${item.id}`) }}
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
            <div className="text-white w-full">
                <p className="text-lg font-semibold">{item.username}</p>
                <p className="text-sm font-light">{item.message}</p>
            </div>
        </motion.button>
    )
}

export default RoomCard