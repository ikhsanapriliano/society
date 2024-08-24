"use client"

const ErrorPage = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="flex gap-3 items-center">
                <p className="font-semibold text-2xl">500</p>
                <p className="font-semibold">Internal Server Error</p>
            </div>
            <a href="/" className="underline mt-5">Home</a>
        </div>
    )
}

export default ErrorPage