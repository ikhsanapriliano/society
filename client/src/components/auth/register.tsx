import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { FormEvent, useState } from "react"
import { handleError } from "@/utils/error"
import { post } from "@/utils/axios"
import { RegisterPayload } from "@/types/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

const Register = () => {
    const dispatch = useDispatch()
    const [inputs, setInputs] = useState({ username: "", email: "", password: "", confirmPassword: "" })
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
                email: inputs.email,
                password: inputs.password,
                confirmPassword: inputs.confirmPassword
            }

            await post<RegisterPayload, undefined>("/auth/register", undefined, payload)
            router.push("/")
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
                    <h2 className="font-bold text-[20px]">register</h2>
                    <div className="flex flex-col mt-2">
                        <label htmlFor="username" className="font-semibold">username</label>
                        <input id="username" onChange={(e) => { setInputs(prev => ({ ...prev, username: e.target.value })) }} value={inputs.username} type="text" autoComplete="off" className="h-[40px] rounded-md bg-third mt-2 px-2" />
                    </div>
                    <div className="flex flex-col mt-2">
                        <label htmlFor="email" className="font-semibold">email</label>
                        <input id="email" onChange={(e) => { setInputs(prev => ({ ...prev, email: e.target.value })) }} value={inputs.email} type="text" autoComplete="off" className="h-[40px] rounded-md bg-third mt-2 px-2" />
                    </div>
                    <div className="flex flex-col mt-2">
                        <label htmlFor="password" className="font-semibold">password</label>
                        <input id="password" onChange={(e) => { setInputs(prev => ({ ...prev, password: e.target.value })) }} value={inputs.password} type="password" autoComplete="off" className="h-[40px] rounded-md bg-third mt-2 px-2" />
                    </div>
                    <div className="flex flex-col mt-2">
                        <label htmlFor="cpassword" className="font-semibold">confirm password</label>
                        <input id="cpassword" onChange={(e) => { setInputs(prev => ({ ...prev, confirmPassword: e.target.value })) }} value={inputs.confirmPassword} type="password" autoComplete="off" className="h-[40px] rounded-md bg-third mt-2 px-2" />
                    </div>
                    {error.isError && <p className="text-sm font-light w-full text-end text-red-500 mt-1">Error: {error.message}</p>}
                    <button type="submit" className="bg-fifth w-full h-[40px] rounded-md mt-5 hover:opacity-70 duration-150">
                        {
                            isLoading ?
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                :
                                "register"
                        }
                    </button>
                    <div className="w-full text-center text-sm mt-2">{"already have account ? "}
                        <span>
                            <Link href={"/"} className={`underline hover:opacity-70 duration-150`}>login</Link>
                        </span>
                    </div>
                </form>
            </div>
        </motion.section>
    )
}

export default Register