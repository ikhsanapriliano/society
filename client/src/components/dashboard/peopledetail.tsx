/* eslint-disable react-hooks/exhaustive-deps */
import { RootState } from "@/store/store"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSelector } from "react-redux"

const PeopleDetail = () => {
    const userId = useSelector((state: RootState) => state.auth.userId)
    const user = useSelector((state: RootState) => state.peopledetail)
    const router = useRouter()

    useEffect(() => {
        if (user.id === "") {
            router.push("/people")
        }
    }, [])

    return (
        <AnimatePresence>
            <section className="p-5 w-full h-full">
                <h2 className="font-semibold text-[20px]">People</h2>
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="flex flex-col items-center mt-5 py-5 h-full text-center">
                    <div className="w-[150px] h-[150px] rounded-full overflow-hidden">
                        <Image src={user.photo} alt={"photo"} width={0} height={0} sizes="100vw" className="w-full h-auto" />
                    </div>
                    <p className="font-semibold mt-5">{user.username}{user.id === userId ? " (me)" : ""}</p>
                    <p className="text-[14px]">{user.email}</p>
                    <p className="font-light text-[14px] p-10 max-h-[150px] w-full overflow-hidden">{user.bio === "" ? "-" : user.bio}</p>
                    {user.id !== userId && <Link href={"/chats"} className="w-[150px] h-[40px] border border-third rounded-md hover:bg-first duration-150 flex justify-center items-center">message</Link>}
                    <Link href={"/people"} className="w-[150px] h-[40px] bg-red-600 rounded-md hover:opacity-70 duration-150 flex justify-center items-center mt-3">back</Link>
                </motion.div>
            </section>
        </AnimatePresence>
    )
}

export default PeopleDetail