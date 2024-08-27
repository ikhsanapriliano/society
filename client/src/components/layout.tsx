"use client"

import { Provider } from "react-redux";
import { store } from "@/store/store";
import Container from "./Container";

const Layout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <Provider store={store}>
            <Container>
                {children}
            </Container>
        </Provider>
    )
}

export default Layout