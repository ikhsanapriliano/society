import { AuthState, setAuth } from "@/slices/auth"
import { JwtClaims, LoginPayload, LoginResponse } from "@/types/auth"
import { post } from "@/utils/axios"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { handleError } from "@/utils/error"
import Link from "next/link"

const Login = () => {
    const dispatch = useDispatch()
    const [inputs, setInputs] = useState({
        email: "ikhsan@gmail.com",
        password: "12345678"
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState({ isError: false, message: "" })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            setError({ isError: false, message: "" })

            const payload: LoginPayload = {
                email: inputs.email,
                password: inputs.password
            }

            const data = await post<LoginPayload, LoginResponse>("/auth/login", undefined, payload) as LoginResponse
            const token = data.token
            localStorage.setItem("token", token)
            const { userId, photo }: JwtClaims = jwtDecode(token)
            const authPayload: AuthState = { token, userId, photo }
            dispatch(setAuth(authPayload))
            setIsLoading(false)
        } catch (error: Error | unknown) {
            const message = handleError(error, dispatch) as string
            setError({ isError: true, message })
            setIsLoading(false)
        }
    }

    return (
        <motion.section
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="p-14 h-full bg-second">
            <h1 className="font-bold text-[24px]">society</h1>
            <div className="h-full flex justify-center items-center w-full">
                <form onSubmit={(e) => { handleSubmit(e) }} className="px-5 w-full">
                    <h2 className="font-bold text-[20px]">login</h2>
                    <div className="flex flex-col mt-7">
                        <label htmlFor="email" className="font-semibold">email</label>
                        <input id="email" onChange={(e) => { setInputs(prev => ({ ...prev, email: e.target.value })) }} value={inputs.email} type="text" autoComplete="email" className="h-[40px] rounded-md bg-third mt-2 px-2" />
                    </div>
                    <div className="flex flex-col mt-7">
                        <label htmlFor="password" className="font-semibold">password</label>
                        <input id="password" onChange={(e) => { setInputs(prev => ({ ...prev, password: e.target.value })) }} value={inputs.password} type="password" autoComplete="off" className="h-[40px] rounded-md bg-third mt-2 px-2" />
                    </div>
                    <button type="button" className="text-end w-full text-sm mt-2 underline">forgot password?</button>
                    {error.isError && <p className="text-sm font-light w-full text-end text-red-500 mt-1">Error: {error.message}</p>}
                    <button type="submit" className={`bg-fifth w-full h-[40px] rounded-md mt-7 hover:opacity-70 ${isLoading ? "opacity-70" : "opacity-100"} duration-150`}>
                        {
                            isLoading ?
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                :
                                "login"
                        }
                    </button>
                    <div className="w-full text-center text-sm mt-2">{"don't have account ? "}
                        <span>
                            <Link href={"/register"} className="underline">register</Link>
                        </span>
                    </div>
                </form>
            </div>
        </motion.section>
    )
}

export default Login