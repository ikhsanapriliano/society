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
import Loading from "@/app/loading"
import { AnimatePresence, motion } from "framer-motion"

const People = () => {
    const dispatch = useDispatch()
    const token = useSelector((state: RootState) => state.auth.token)
    const online = useSelector((state: RootState) => state.websocket.users)
    const [people, setPeople] = useState<PeopleResponse[]>([])
    const [inputs, setInputs] = useState({ value: "", type: "username" })
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        handleSearch()
    }, [])

    useEffect(() => {
        if (people.length !== 0) {
            const newData = people.map((item) => {
                let temp: PeopleResponse = { ...item }

                if (online.includes(item.id)) {
                    temp.isOnline = true
                } else {
                    temp.isOnline = false
                }

                return temp
            })

            setPeople(newData)
        }
    }, [online])

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

            const newData = data.map((item) => {
                let temp: PeopleResponse = { ...item }

                if (online.includes(item.id)) {
                    temp.isOnline = true
                }

                return temp
            })

            setPeople(newData)
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
        <section className="w-full h-full md:h-[90%] overflow-hidden px-5 pt-10 md:p-5 flex flex-col relative">
            <h2 className="font-semibold text-[20px]">People</h2>
            <form onSubmit={(e) => { handleSearch(e) }} className="mt-5">
                <div className="relative">
                    <input type="text" onChange={(e) => { setInputs(prev => ({ ...prev, value: e.target.value })) }} value={inputs.value} placeholder="find someone" className="w-full bg-third h-[40px] pl-12 pr-2 rounded-md" />
                    <button type="submit" className="absolute left-0 h-full px-4"><i aria-hidden className="fa-solid fa-search"></i></button>
                </div>
                <div className="flex gap-3 mt-3">
                    <button onClick={() => { setInputs(prev => ({ ...prev, type: "username" })) }} type="submit" className={`${inputs.type === "username" ? "bg-fifth" : "border border-third"} px-5 py-1 rounded-md`}>username</button>
                    <button onClick={() => { setInputs(prev => ({ ...prev, type: "bio" })) }} type="submit" className={`${inputs.type === "bio" ? "bg-fifth" : "border border-third"} px-5 py-1 rounded-md`}>bio</button>
                </div>
            </form>
            <div className="flex-grow overflow-y-auto overflow-x-hidden mt-5">
                {
                    isLoading ?
                        <Loading />
                        :
                        people.length === 0 ?
                            <p className="text-sm w-full text-center mt-3">No people found.</p>
                            :
                            <AnimatePresence>
                                {
                                    people.map((item, index) => (
                                        <motion.button
                                            initial={{ x: -100 }}
                                            animate={{ x: 0 }}
                                            exit={{ x: 100 }}
                                            onClick={() => { handleDetail(item) }} key={index} className="flex p-5 gap-5 w-full text-left hover:bg-third">
                                            <div className="relative">
                                                <div className="flex-shrink-0 w-[50px] h-[50px] rounded-full overflow-hidden">
                                                    <Image src={item.photo} alt="photo" width={0} height={0} sizes="100vw" className="w-full h-auto" />
                                                </div>
                                                {item.isOnline && <div className="absolute top-[-5px] right-[-5px] w-[20px] h-[20px] bg-green-500 rounded-full"></div>}
                                            </div>
                                            <div className="text-white w-full overflow-hidden">
                                                <p className="text-lg font-semibold">{item.username}</p>
                                                <p className="text-sm font-light whitespace-nowrap w-full overflow-ellipsis overflow-hidden">{item.bio}</p>
                                            </div>
                                        </motion.button>
                                    ))
                                }
                            </AnimatePresence>
                }
            </div>
        </section>
    )
}

export default People
