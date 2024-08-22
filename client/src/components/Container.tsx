/* eslint-disable react-hooks/exhaustive-deps */
import Sidebar from "@/components/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { JwtClaims } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { AuthState, clearAuth, setAuth } from "@/slices/auth";
import { setMessage, setSocket, WebsocketState } from "@/slices/websocket";
import { RegisterWebsocket, WebsocketMessage } from "@/types/websocket";
import { ChatFormat } from "@/types/chat";

const Container = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    const auth = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()
    const pahtname = usePathname()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        try {
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

            const ws = new WebSocket("ws://localhost:3000")
            const registerSocket: RegisterWebsocket = { userId: userId }
            ws.onopen = (_event) => { ws.send(JSON.stringify(registerSocket)) }
            ws.onmessage = (event) => {
                const data: ChatFormat = (JSON.parse(event.data) as WebsocketMessage).data as ChatFormat
                dispatch(setMessage(data))
            }
            dispatch(setSocket(ws))

            setIsLoading(false)
        } catch (error) {
            console.log(error)
            localStorage.removeItem("token")
            window.location.reload()
        }
    }, [])

    return (
        <div className={`flex w-full h-full 2xl:w-[97%] 2xl:h-[95%] max-w-[1700px] mx-auto text-white shadow-xl overflow-hidden`}>
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