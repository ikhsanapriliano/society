import { clearAuth } from "@/slices/auth";
import { setLocation } from "@/slices/sidebar";
import { RootState } from "@/store/store";
import { motion } from "framer-motion"
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    const dispatch = useDispatch()
    const photo = useSelector((state: RootState) => state.auth.photo) as string
    const location = useSelector((state: RootState) => state.sidebar.location)

    const switchLocation = (loc: string) => {
        dispatch(setLocation(loc))
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        dispatch(clearAuth())
        window.location.reload()
    }

    return (
        <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="flex w-full h-full bg-second">
            <nav className="bg-first h-full w-[15%] flex flex-col justify-between items-center p-5">
                <div className="flex flex-col gap-5">
                    <button onClick={() => { switchLocation("history") }} className={`w-[50px] h-[50px] flex justify-center items-center ${location === "history" ? "bg-third" : "bg-first"} rounded-full text-[20px]`}><i className="fa-solid fa-comment-dots"></i></button>
                    <button onClick={() => { switchLocation("people") }} className={`w-[50px] h-[50px] flex justify-center items-center ${location === "people" ? "bg-third" : "bg-first"} rounded-full text-[20px]`}><i className="fa-solid fa-user-group"></i></button>
                </div>
                <div className="flex flex-col gap-5">
                    <button onClick={() => { switchLocation("profile") }} className={`w-[50px] h-[50px] flex justify-center items-center rounded-full overflow-hidden p-1 ${location === "profile" ? "bg-third" : "bg-first"}`}>
                        <Image src={"/" + photo} alt="profile" width={0} height={0} sizes="100vw" className="w-full h-auto rounded-full" />
                    </button>
                    <button onClick={handleLogout} className="w-[50px] h-[50px] flex justify-center items-center rounded-full text-[20px] text-red-600"><i className="fa-solid fa-right-from-bracket"></i></button>
                </div>
            </nav>
            <div className="w-full h-full overflow-hidden flex flex-col justify-between items-center">
                {children}
                <div className="bg-fifth w-full h-[10%] max-h-[100px] flex justify-center items-center">
                    <h1 className="font-bold text-[20px]">Society</h1>
                </div>
            </div>
        </motion.div>
    )
}

export default Dashboard