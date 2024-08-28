/* eslint-disable react-hooks/exhaustive-deps */
import { AuthState, setAuth } from "@/slices/auth"
import { JwtClaims, LoginPayload, LoginResponse } from "@/types/auth"
import { patch, post } from "@/utils/axios"
import { jwtDecode } from "jwt-decode"
import { FormEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { handleError } from "@/utils/error"
import { RegisterWebsocket, WebsocketMessage, WebsocketMessageRead } from "@/types/websocket"
import { setIsRead, setMessage, setSocket, setUsers } from "@/slices/websocket"
import { wsUrl } from "@/utils/constants"
import { useRouter } from "next/navigation"
import { BioPayload } from "@/types/profile"
import Loading from "@/app/loading"

const CompleteBio = () => {
    const dispatch = useDispatch()
    const [bio, setBio] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState({ isError: false, message: "" })
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)
    const token = localStorage.getItem("token")

    useEffect(() => {
        if (!token) {
            router.push("/")
        }
        setIsChecking(false)
    }, [])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            setError({ isError: false, message: "" })

            const payload: BioPayload = {
                bio
            }

            const data = await patch<BioPayload, LoginResponse>("/users/bio", token!, payload) as LoginResponse
            const newToken = data.token
            localStorage.setItem("token", newToken)
            const { userId, photo, isVerified }: JwtClaims = jwtDecode(newToken)
            if (!isVerified) {
                router.push("/complete-bio")
                return
            }

            const authPayload: AuthState = { token: newToken, userId, photo, isVerified }
            dispatch(setAuth(authPayload))

            const ws = new WebSocket(wsUrl as string)
            const registerSocket: RegisterWebsocket = { userId: userId }
            ws.onopen = (_event) => { ws.send(JSON.stringify(registerSocket)) }
            ws.onmessage = (event) => {
                const message: WebsocketMessage | string[] | WebsocketMessageRead = (JSON.parse(event.data))
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
                    console.log(message)
                    dispatch(setUsers(message as string[]))
                }
            }
            dispatch(setSocket(ws))

            setIsLoading(false)
        } catch (error: Error | unknown) {
            const message = handleError(error, dispatch) as string
            setError({ isError: true, message })
            setIsLoading(false)
        }
    }

    return (
        <section className="h-full flex justify-center items-center w-full">
            {
                isChecking ?
                    <Loading />
                    :
                    <form onSubmit={(e) => { handleSubmit(e) }} className="px-5 w-full">
                        <h2 className="font-semibold text-[20px]">Complete Your Bio</h2>
                        <div className="flex flex-col mt-5">
                            <textarea value={bio} onChange={(e) => { setBio(e.target.value) }} placeholder="Wandering through shadows" className="resize-none rounded-md bg-third p-3" rows={4}></textarea>
                        </div>
                        {error.isError && <p className="text-sm font-light w-full text-end text-red-500 mt-1">Error: {error.message}</p>}
                        <button type="submit" className={`bg-fifth w-full h-[40px] rounded-md mt-5 hover:opacity-70 ${isLoading ? "opacity-70" : "opacity-100"} duration-150`}>
                            {
                                isLoading ?
                                    <i aria-hidden className="fa-solid fa-spinner fa-spin"></i>
                                    :
                                    "Submit"
                            }
                        </button>
                    </form>
            }
        </section>
    )
}

export default CompleteBio