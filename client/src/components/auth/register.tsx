import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { FormEvent, useState } from "react"
import { handleError } from "@/utils/error"
import { post } from "@/utils/axios"
import { LoginResponse, RegisterPayload } from "@/types/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

const Register = () => {
    const dispatch = useDispatch()
    const [inputs, setInputs] = useState({ username: "", password: "", confirmPassword: "" })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState({ isError: false, message: "" })
    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            setError({ isError: false, message: "" })

            const payload: RegisterPayload = {
                username: inputs.username,
                password: inputs.password,
                confirmPassword: inputs.confirmPassword
            }

            const data = await post<RegisterPayload, LoginResponse>("/auth/register", undefined, payload) as LoginResponse
            const token = data.token
            localStorage.setItem("token", token)

            router.push("/complete-bio")
        } catch (error: Error | unknown) {
            const message = handleError(error, dispatch) as string
            setError({ isError: true, message })
            setIsLoading(false)
        }
    }

    return (
        <section className="h-full flex justify-center items-center w-full">
            <form onSubmit={(e) => { handleSubmit(e) }} className="px-5 w-full">
                <h2 className="font-bold text-[20px]">Register First</h2>
                <div className="flex flex-col mt-5">
                    <label htmlFor="username" className="font-semibold">username</label>
                    <input id="username" onChange={(e) => { setInputs(prev => ({ ...prev, username: e.target.value })) }} value={inputs.username} type="text" autoComplete="off" className="h-[40px] rounded-md bg-third mt-2 px-3" />
                </div>
                <div className="flex flex-col mt-3">
                    <label htmlFor="password" className="font-semibold">password</label>
                    <input id="password" onChange={(e) => { setInputs(prev => ({ ...prev, password: e.target.value })) }} value={inputs.password} type="password" autoComplete="off" className="h-[40px] rounded-md bg-third mt-2 px-3" />
                </div>
                <div className="flex flex-col mt-3">
                    <label htmlFor="cpassword" className="font-semibold">confirm password</label>
                    <input id="cpassword" onChange={(e) => { setInputs(prev => ({ ...prev, confirmPassword: e.target.value })) }} value={inputs.confirmPassword} type="password" autoComplete="off" className="h-[40px] rounded-md bg-third mt-2 px-3" />
                </div>
                {error.isError && <p className="text-sm font-light w-full text-end text-red-500 mt-1">Error: {error.message}</p>}
                <button type="submit" className="bg-fifth w-full h-[40px] rounded-md mt-5 hover:opacity-70 duration-150">
                    {
                        isLoading ?
                            <i aria-hidden className="fa-solid fa-spinner fa-spin"></i>
                            :
                            "Register"
                    }
                </button>
                <div className="w-full text-center text-sm mt-2">{"already have account ? "}
                    <span>
                        <Link href={"/"} className={`underline hover:opacity-70 duration-150`}>Login</Link>
                    </span>
                </div>
            </form>
        </section>
    )
}

export default Register