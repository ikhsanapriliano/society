const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
export const apiUrl =
    environment !== "development"
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://localhost:3001";
export const wsUrl =
    environment !== "development"
        ? process.env.NEXT_PUBLIC_WS_URL
        : "ws://localhost:3001";
