/* eslint-disable react-hooks/exhaustive-deps */
import { RootState } from "@/store/store"
import { PeopleResponse } from "@/types/people"
import { get } from "@/utils/axios"
import { handleError } from "@/utils/error"
import Image from "next/image"
import { FormEvent, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setPeopleDetail } from "@/slices/peopledetail"
import { useRouter } from "next/navigation"

const People = () => {
    const dispatch = useDispatch()
    const token = useSelector((state: RootState) => state.auth.token)
    const [people, setPeople] = useState<PeopleResponse[]>([])
    const [inputs, setInputs] = useState({ value: "", type: "username" })
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        handleSearch()
    }, [])

    const handleSearch = async (e?: FormEvent<HTMLFormElement>) => {
        try {
            if (e) e.preventDefault()
            setIsLoading(true)

            let query = ""

            if (inputs.value !== "") {
                query = `${inputs.type}=${inputs.value}`
            }
            console.log(query)

            const data = await get<PeopleResponse[]>("/users", token, query !== "" ? query : undefined) as PeopleResponse[]
            setPeople(data)
            setIsLoading(false)
        } catch (error: Error | unknown) {
            handleError(error, dispatch)
        }
    }

    const handleDetail = (item: PeopleResponse) => {
        dispatch(setPeopleDetail(item))
        router.push(`/people/${item.id}`)
    }

    return (
        <section className="w-full h-[90%] overflow-hidden p-5 flex flex-col relative">
            <h2 className="font-semibold text-[20px]">People</h2>
            <form onSubmit={(e) => { handleSearch(e) }} className="mt-5">
                <div className="relative">
                    <input type="text" onChange={(e) => { setInputs(prev => ({ ...prev, value: e.target.value })) }} value={inputs.value} placeholder="find someone" className="w-full bg-third h-[40px] pl-12 pr-2 rounded-md" />
                    <button type="submit" className="absolute left-0 h-full px-4"><i className="fa-solid fa-search"></i></button>
                </div>
                <div className="flex gap-3 mt-3">
                    <button onClick={() => { setInputs(prev => ({ ...prev, type: "username" })) }} type="submit" className={`${inputs.type === "username" ? "bg-fifth" : "border border-third"} px-5 py-1 rounded-md`}>username</button>
                    <button onClick={() => { setInputs(prev => ({ ...prev, type: "email" })) }} type="submit" className={`${inputs.type === "email" ? "bg-fifth" : "border border-third"} px-5 py-1 rounded-md`}>email</button>
                </div>
            </form>
            <div className="flex-grow overflow-auto mt-5">
                {
                    isLoading ?
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        :
                        people.length === 0 ?
                            <p className="text-sm w-full text-center mt-3">No people found.</p>
                            :
                            <>
                                {
                                    people.map((item, index) => (
                                        <button onClick={() => { handleDetail(item) }} key={index} className="flex p-5 gap-5 w-full text-left hover:bg-third">
                                            <div className="flex-shrink-0 w-[50px] h-[50px] rounded-full overflow-hidden">
                                                <Image src={item.photo} alt="photo" width={0} height={0} sizes="100vw" className="w-full h-auto" />
                                            </div>
                                            <div className="text-white w-full">
                                                <p className="text-lg font-semibold">{item.username}</p>
                                                <p className="text-sm font-light">{item.email}</p>
                                            </div>
                                        </button>
                                    ))
                                }
                            </>
                }
            </div>
        </section>
    )
}

export default People