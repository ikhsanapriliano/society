import express from "express";
import cors from "cors";
import AuthRoutes from "./routes/auth.route";
import { ErrorHandler, NotFoundHandler } from "./middlewares/error.middleware";
import UserRoutes from "./routes/user.route";
import RoomRoutes from "./routes/room.route";
import logger from "./utils/winston.util";
import http from "http";
import { WebSocket } from "ws";

try {
    const app = express();
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });
    let clients: { id: string; ws: WebSocket }[] = [];

    const environment: string = process.env.ENVIRONMENT as string;
    const host = (
        environment === "production" ? process.env.HOST : "localhost"
    ) as string;
    const port = Number(process.env.PORT);

    wss.on("connection", (ws) => {
        console.log("client connected");

        ws.on("message", (message) => {
            console.log("received: " + message);
            const data = JSON.parse(message as unknown as string);

            if (data.userId) {
                let isExist = false;
                clients.forEach((item) => {
                    if (item.id === data.userId) {
                        isExist = true;
                    }
                });

                if (!isExist) {
                    clients.push({ id: data.userId, ws: ws });
                }

                const users: string[] = clients.map((item) => item.id);
                console.log("online", users);
                wss.clients.forEach((client) => {
                    client.send(JSON.stringify(users));
                });
            }

            if (data.isRead) {
                console.log("reading message");

                clients.forEach((client) => {
                    if (
                        client.id === data.receiver ||
                        client.id === data.sender
                    ) {
                        if (client.ws.readyState === WebSocket.OPEN) {
                            client.ws.send(JSON.stringify(data));
                        }
                    }
                });
            }

            if (data.sender && data.data) {
                console.log("new message");

                clients.forEach((client) => {
                    if (
                        client.id === data.receiver ||
                        client.id === data.sender
                    ) {
                        if (client.ws.readyState === WebSocket.OPEN) {
                            client.ws.send(JSON.stringify(data));
                        }
                    }
                });
            }
        });

        ws.on("close", () => {
            const newClients: { id: string; ws: WebSocket }[] = [];
            clients.forEach((item) => {
                if (item.ws != ws) {
                    newClients.push(item);
                }
            });

            clients = newClients;
            const users: string[] = clients.map((item) => item.id);
            console.log("online", users);

            clients.forEach((client) => {
                if (client.ws.readyState === WebSocket.OPEN) {
                    client.ws.send(JSON.stringify(users));
                }
            });

            console.log("client disconnected");
        });
    });

    app.use(cors());
    app.use(express.json());

    app.use("/api/auth", AuthRoutes);
    app.use("/api/users", UserRoutes);
    app.use("/api/rooms", RoomRoutes);
    app.use("*", NotFoundHandler);

    app.use(ErrorHandler);

    server.listen(Number(port), () => {
        console.log(`your app is running on http://${host}:${port}`);
    });
} catch (error) {
    logger.error(error);
}
