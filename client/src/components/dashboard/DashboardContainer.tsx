import { clearAuth } from "@/slices/auth";
import { RootState } from "@/store/store";
import { motion } from "framer-motion"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const DashboardContainer = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    const dispatch = useDispatch()
    const socket = useSelector((state: RootState) => state.websocket.socket)
    const photo = useSelector((state: RootState) => state.auth.photo) as string
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("token")
        dispatch(clearAuth())
        socket?.close()
        router.push("/")
    }

    return (
        <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="flex flex-col-reverse md:flex-row w-full h-full bg-second">
            <nav className="bg-first md:h-full md:w-[15%] flex md:flex-col justify-between items-center px-10 py-4 md:p-5">
                <div className="hidden md:flex flex-col gap-5">
                    <Link href={"/"} className={`w-[50px] h-[50px] flex justify-center items-center ${(pathname === "/" || pathname.includes("/chats")) ? "bg-third" : "bg-first"} rounded-full text-[20px]`}><i className="fa-solid fa-comment-dots"></i></Link>
                    <Link href={"/people"} className={`w-[50px] h-[50px] flex justify-center items-center ${pathname.includes("/people") ? "bg-third" : "bg-first"} rounded-full text-[20px]`}><i aria-hidden className="fa-solid fa-user-group"></i></Link>
                </div>
                <div className="hidden md:flex flex-col gap-5">
                    <Link href={"/profile"} className={`w-[50px] h-[50px] flex justify-center items-center rounded-full overflow-hidden p-1 ${pathname === "/profile" ? "bg-third" : "bg-first"}`}>
                        <Image src={photo} alt="profile" width={0} height={0} sizes="100vw" className="w-full h-auto rounded-full" />
                    </Link>
                    <button onClick={handleLogout} className="w-[50px] h-[50px] flex justify-center items-center rounded-full text-[20px] text-red-600"><i aria-hidden className="fa-solid fa-right-from-bracket"></i></button>
                </div>
                <div className="flex md:hidden justify-between w-full">
                    <Link href={"/"} className={`w-[50px] h-[50px] flex justify-center items-center ${(pathname === "/" || pathname.includes("/chats")) ? "bg-third" : "bg-first"} rounded-full text-[20px]`}><i className="fa-solid fa-comment-dots"></i></Link>
                    <Link href={"/people"} className={`w-[50px] h-[50px] flex justify-center items-center ${pathname.includes("/people") ? "bg-third" : "bg-first"} rounded-full text-[20px]`}><i aria-hidden className="fa-solid fa-user-group"></i></Link>
                    <Link href={"/profile"} className={`w-[50px] h-[50px] flex justify-center items-center rounded-full overflow-hidden p-1 ${pathname === "/profile" ? "bg-third" : "bg-first"}`}>
                        <Image src={photo} alt="profile" width={0} height={0} sizes="100vw" className="w-full h-auto rounded-full" />
                    </Link>
                    <button onClick={handleLogout} className="w-[50px] h-[50px] flex justify-center items-center rounded-full text-[20px] text-red-600"><i aria-hidden className="fa-solid fa-right-from-bracket"></i></button>
                </div>
            </nav>
            <div className="w-full h-full overflow-hidden flex flex-col justify-between items-center z-50">
                {children}
                <div className="bg-fifth w-full h-[10%] max-h-[100px] hidden md:flex justify-center items-center">
                    <h1 className="font-bold text-[20px]">Society</h1>
                </div>
            </div>
        </motion.div>
    )
}

export default DashboardContainer