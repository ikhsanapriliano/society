import { motion } from "framer-motion"

const AuthContainer = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <motion.div
            className="px-5 py-10 md:p-14 h-full bg-second">
            <h1 className="font-bold text-[24px] px-5 md:px-0">society</h1>
            {children}
        </motion.div>
    )
}

export default AuthContainer