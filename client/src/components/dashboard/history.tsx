const HistoryChat = () => {
    return (
        <section className="p-5 w-full h-full">
            <h2 className="font-semibold text-[20px]">Chats</h2>
            <form>
                <div className="relative mt-5">
                    <input type="text" placeholder="search you chat history" className="w-full bg-third h-[40px] pl-12 pr-2 rounded-md" />
                    <button type="submit" className="absolute left-0 h-full px-4"><i className="fa-solid fa-search"></i></button>
                </div>
                <div className="flex gap-3 mt-3">
                    <button type="submit" className="border border-third px-5 py-1 rounded-md">all</button>
                    <button type="submit" className="bg-fifth px-5 py-1 rounded-md">unread</button>
                </div>
            </form>
            <div className="mt-7 border-t border-third">
                <p className="text-sm w-full text-center mt-3">No chats found.</p>
            </div>
        </section>
    )
}

export default HistoryChat