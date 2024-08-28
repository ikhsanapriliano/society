import { motion } from "framer-motion"

const AuthContainer = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <motion.div
            className="p-14 h-full bg-second">
            <h1 className="font-bold text-[24px]">society</h1>
            {children}
        </motion.div>
    )
}

export default AuthContainer