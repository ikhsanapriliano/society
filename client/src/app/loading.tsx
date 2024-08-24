import Image from "next/image"

const Loading = () => {
    return (
        <div className="w-full flex flex-col gap-3 h-full justify-center items-center">
            <div className="w-[50px]">
                <Image src={"/dharmachakra-solid.svg"} alt="chakra" width={0} height={0} className="w-full h-auto animate-spin" />
            </div>
            <p>Loading</p>
        </div>
    )
}

export default Loading