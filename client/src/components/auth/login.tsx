const Login = () => {
    return (
        <section className="p-14 h-full">
            <h1 className="font-bold text-[24px]">socioty</h1>
            <div className="h-full flex justify-center items-center w-full">
                <form className="px-5 w-full">
                    <h2 className="font-bold text-[20px]">login</h2>
                    <div className="flex flex-col mt-7">
                        <label className="font-semibold">email</label>
                        <input type="text" className="h-[40px] rounded-md bg-third mt-2 px-2" />
                    </div>
                    <div className="flex flex-col mt-7">
                        <label className="font-semibold">password</label>
                        <input type="password" className="h-[40px] rounded-md bg-third mt-2 px-2" />
                    </div>
                    <button type="button" className="text-end w-full text-sm mt-2 underline">forgot password?</button>
                    <button type="submit" className="bg-fifth w-full h-[40px] rounded-md mt-7">login</button>
                    <div className="w-full text-center text-sm mt-2">{"don't have account ? "}<span className="underline">register</span></div>
                </form>
            </div>
        </section>
    )
}

export default Login