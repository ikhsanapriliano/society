import Image from "next/image"

const Home = () => {
  return (
    <section className="h-full flex flex-col justify-center items-center text-center">
      <div className="w-[160px] min-h-[128px]">
        <Image src={"/comments-solid.svg"} width={0} height={0} sizes="100vw" alt="logo" className="w-full h-auto" />
      </div>
      <h1 className="font-black text-[32px] mt-10">welcome to society</h1>
      <p className="font-extralight mt-1">dive into the darkness of communication with society,<br />
        where your conversations linger and secrets are whispered</p>
    </section>
  )
}

export default Home