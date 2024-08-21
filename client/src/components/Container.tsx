import Sidebar from "@/components/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { JwtClaims } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { AuthState, setAuth } from "@/slices/auth";

const Container = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    const auth = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()
    const pahtname = usePathname()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (token === null) {
            if (pahtname.includes("chats")) {
                router.push("/")
            }
            setIsLoading(false)

            return
        }

        const { userId, photo }: JwtClaims = jwtDecode(token)
        const payload: AuthState = { token, userId, photo }
        dispatch(setAuth(payload))
        setIsLoading(false)
    }, [auth, pahtname, dispatch, router])

    return (
        <div className={`flex w-full h-full 2xl:w-[97%] 2xl:h-[95%] max-w-[1700px] max-h-[900px] mx-auto text-white shadow-xl overflow-hidden`}>
            {
                isLoading ?
                    <div>Loading</div>
                    :
                    <>
                        <Sidebar />
                        <main className="bg-first w-[65%]">
                            {children}
                        </main>
                    </>
            }
        </div>
    )
}

export default Container