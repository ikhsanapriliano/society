/* eslint-disable react-hooks/exhaustive-deps */
import Sidebar from "@/components/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { JwtClaims } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { AuthState, setAuth } from "@/slices/auth";
import { setMessage, setSocket, setUsers } from "@/slices/websocket";
import { RegisterWebsocket, WebsocketMessage } from "@/types/websocket";
import { wsUrl } from "@/utils/constants";
import Loading from "@/app/loading";

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

            const ws = new WebSocket(wsUrl as string)
            const registerSocket: RegisterWebsocket = { userId: userId }
            ws.onopen = (_event) => { ws.send(JSON.stringify(registerSocket)) }
            ws.onmessage = (event) => {
                const message: WebsocketMessage | string[] = (JSON.parse(event.data))
                if ((message as WebsocketMessage).data) {
                    const data = (message as WebsocketMessage).data
                    dispatch(setMessage(data))
                    return
                }

                if ((message as string[])) {
                    dispatch(setUsers(message as string[]))
                }
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
                    <Loading />
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