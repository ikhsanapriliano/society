import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            screens: {
                "2xl": "1440px",
            },
            colors: {
                first: "#212121",
                second: "#171717",
                third: "#2F2F2F",
                forth: "#676767",
                fifth: "#2A3942",
                background: "#0C1317",
            },
        },
    },
    plugins: [],
};
export default config;
