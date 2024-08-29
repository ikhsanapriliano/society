/* eslint-disable react-hooks/exhaustive-deps */
import Sidebar from "@/components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { JwtClaims } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { AuthState, setAuth } from "@/slices/auth";
import { setIsRead, setMessage, setSocket, setUsers } from "@/slices/websocket";
import { RegisterWebsocket, WebsocketMessage, WebsocketMessageRead } from "@/types/websocket";
import { wsUrl } from "@/utils/constants";
import Loading from "@/app/loading";
import { setInternalError } from "@/slices/error";
import ErrorPage from "@/app/error";

const Container = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    const dispatch = useDispatch()
    const pahtname = usePathname()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const isInternalError = useSelector((state: RootState) => state.error.isInternalError)

    useEffect(() => {
        try {
            const error = sessionStorage.getItem("error")
            if (error) {
                console.log(JSON.parse(error))
                dispatch(setInternalError())
                sessionStorage.removeItem("error")
                setIsLoading(false)
                return
            }

            const token = localStorage.getItem("token")

            if (token === null) {
                if (pahtname.includes("chats")) {
                    router.push("/")
                }
                setIsLoading(false)

                return
            }

            const { userId, photo, isVerified }: JwtClaims = jwtDecode(token)
            if (!isVerified) {
                router.push("/complete-bio")
                return
            }

            const payload: AuthState = { token, userId, photo, isVerified }
            dispatch(setAuth(payload))

            const ws = new WebSocket(wsUrl as string)
            const registerSocket: RegisterWebsocket = { userId: userId }
            ws.onopen = (_event) => { ws.send(JSON.stringify(registerSocket)) }
            ws.onmessage = (event) => {
                const message: WebsocketMessage | WebsocketMessageRead | string[] = (JSON.parse(event.data))
                if ((message as WebsocketMessage).data) {
                    const data = (message as WebsocketMessage).data
                    dispatch(setMessage(data))
                    return
                }

                if ((message as WebsocketMessageRead).isRead) {
                    dispatch(setIsRead(true))
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
                    isInternalError ?
                        <ErrorPage />
                        :
                        <>
                            <Sidebar />
                            <main className={`bg-first w-full md:w-[65%] ${pahtname.includes("/chats") ? "inline-block" : "hidden md:inline-block"}`}>
                                {children}
                            </main>
                        </>
            }
        </div>
    )
}

export default Container