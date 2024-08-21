"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Container from "@/components/Container";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen w-full flex justify-center items-center bg-background`}>
        <Provider store={store}>
          <Container>
            {children}
          </Container>
        </Provider>
        <Script src="https://kit.fontawesome.com/459dbe24a4.js" crossOrigin="anonymous"></Script>
      </body>
    </html>
  );
}

export default RootLayout