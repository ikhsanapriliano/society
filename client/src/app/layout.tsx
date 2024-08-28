import "./globals.css";
import Layout from "@/components/Layout";
import Script from "next/script";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Society",
  description: "let's chat",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen w-full flex justify-center items-center bg-background`}>
        <Layout>
          {children}
        </Layout>
        <Script src="https://kit.fontawesome.com/459dbe24a4.js" crossOrigin="anonymous"></Script>
      </body>
    </html>
  );
}

export default RootLayout