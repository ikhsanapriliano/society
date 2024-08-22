import { RootState } from "@/store/store"
import { PeopleResponse } from "@/types/people"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"
import { useSelector } from "react-redux"

interface Props {
    user: PeopleResponse,
    setDetails: Dispatch<SetStateAction<PeopleResponse | null>>
}

const PeopleDetail = ({ user, setDetails }: Props) => {
    const userId = useSelector((state: RootState) => state.auth.userId)

    return (
        <div className="absolute inset-0 bg-second p-5 flex flex-col">
            <h2 className="font-semibold text-[20px]">People</h2>
            <div className="flex flex-col items-center mt-5 py-5 h-full text-center">
                <div className="w-[150px] h-[150px] rounded-full overflow-hidden">
                    <Image src={"/" + user.photo} alt={"photo"} width={0} height={0} sizes="100vw" className="w-full h-auto" />
                </div>
                <p className="font-semibold mt-5">{user.username}{user.id === userId ? " (me)" : ""}</p>
                <p className="text-[14px]">{user.email}</p>
                <p className="font-light text-[14px] p-10 max-h-[150px] w-full overflow-hidden">{user.bio === "" ? "-" : user.bio}</p>
                {user.id !== userId && <button className="w-[150px] h-[40px] border border-third rounded-md hover:bg-first duration-150 flex justify-center items-center">message</button>}
                <button onClick={() => { setDetails(null) }} className="w-[150px] h-[40px] bg-red-600 rounded-md hover:opacity-70 duration-150 flex justify-center items-center mt-3">back</button>
            </div>
        </div>
    )
}

export default PeopleDetail