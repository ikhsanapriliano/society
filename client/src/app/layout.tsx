import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Sidebar from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen w-full flex justify-center items-center bg-background`}>
        <div className={`flex w-full h-full 2xl:w-[97%] 2xl:h-[95%] max-w-[1700px] max-h-[900px] mx-auto text-white shadow-xl`}>
          <Sidebar />
          <main className="bg-first w-[65%]">
            {children}
          </main>
        </div>
        <Script src="https://kit.fontawesome.com/459dbe24a4.js" crossOrigin="anonymous"></Script>
      </body>
    </html>
  );
}

export default RootLayout