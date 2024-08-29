import { AuthState, setAuth } from "@/slices/auth"
import { JwtClaims, LoginPayload, LoginResponse } from "@/types/auth"
import { post } from "@/utils/axios"
import { jwtDecode } from "jwt-decode"
import { FormEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { handleError } from "@/utils/error"
import Link from "next/link"
import { RegisterWebsocket, WebsocketMessage, WebsocketMessageRead } from "@/types/websocket"
import { setIsRead, setMessage, setSocket, setUsers } from "@/slices/websocket"
import { wsUrl } from "@/utils/constants"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const Login = () => {
    const dispatch = useDispatch()
    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState({ isError: false, message: "" })
    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            setError({ isError: false, message: "" })

            const payload: LoginPayload = {
                username: inputs.username,
                password: inputs.password
            }

            const data = await post<LoginPayload, LoginResponse>("/auth/login", undefined, payload) as LoginResponse
            const token = data.token
            localStorage.setItem("token", token)
            const { userId, photo, isVerified }: JwtClaims = jwtDecode(token)
            if (!isVerified) {
                router.push("/complete-bio")
                return
            }

            const authPayload: AuthState = { token, userId, photo, isVerified }
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
        <motion.section
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex justify-center items-center w-full">
            <form onSubmit={(e) => { handleSubmit(e) }} className="px-5 w-full">
                <h2 className="font-semibold text-[20px]">Login First</h2>
                <div className="flex flex-col mt-5">
                    <label htmlFor="username" className="font-semibold">username</label>
                    <input id="username" onChange={(e) => { setInputs(prev => ({ ...prev, username: e.target.value })) }} value={inputs.username} type="text" autoComplete="username" className="h-[40px] rounded-md bg-third mt-2 px-3" />
                </div>
                <div className="flex flex-col mt-3">
                    <label htmlFor="password" className="font-semibold">password</label>
                    <input id="password" onChange={(e) => { setInputs(prev => ({ ...prev, password: e.target.value })) }} value={inputs.password} type="password" autoComplete="off" className="h-[40px] rounded-md bg-third mt-2 px-3" />
                </div>
                {error.isError && <p className="text-sm font-light w-full text-end text-red-500 mt-1">Error: {error.message}</p>}
                <button type="submit" className={`bg-fifth w-full h-[40px] rounded-md mt-5 hover:opacity-70 ${isLoading ? "opacity-70" : "opacity-100"} duration-150`}>
                    {
                        isLoading ?
                            <i aria-hidden className="fa-solid fa-spinner fa-spin"></i>
                            :
                            "Login"
                    }
                </button>
                <div className="w-full text-center text-sm mt-2">{"don't have account ? "}
                    <span>
                        <Link href={"/register"} className="underline">Register</Link>
                    </span>
                </div>
            </form>
        </motion.section>
    )
}

export default Login
