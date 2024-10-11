import express from "express";
import cors from "cors";
import AuthRoutes from "./routes/auth.route";
import { ErrorHandler, NotFoundHandler } from "./middlewares/error.middleware";
import UserRoutes from "./routes/user.route";
import http from "http";
import { WebSocket } from "ws";
import mongoose from "mongoose";
import PostRoutes from "./routes/post.route";
import RoomRoutes from "./routes/room.route";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let clients: { id: string; ws: WebSocket }[] = [];

const environment: string = process.env.ENVIRONMENT as string;
const host = (
    environment === "production" ? process.env.HOST : "localhost"
) as string;
const port = Number(process.env.PORT);
const mongooseUrl = String(process.env.MONGOOSE_URL);

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
                if (client.id === data.receiver || client.id === data.sender) {
                    if (client.ws.readyState === WebSocket.OPEN) {
                        client.ws.send(JSON.stringify(data));
                    }
                }
            });
        }

        if (data.sender && data.data) {
            console.log("new message");

            clients.forEach((client) => {
                if (client.id === data.receiver || client.id === data.sender) {
                    if (client.ws.readyState === WebSocket.OPEN) {
                        client.ws.send(JSON.stringify(data));
                    }
                }
            });
        }
    });

    ws.on("close", () => {
        clients = clients.filter(
            (item) => item.ws.readyState === WebSocket.OPEN
        );
        const users: string[] = [];
        clients.forEach((item) => {
            users.push(item.id);
        });

        console.log("online", users);

        clients.forEach((client) => {
            if (client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(JSON.stringify(users));
            }
        });

        console.log("client disconnected");
    });
});

mongoose
    .connect(mongooseUrl)
    .then(() => {
        console.log("Mongoose connected.");
    })
    .catch((error) => {
        console.log(error);
    });

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/rooms", RoomRoutes);
app.use("/api/posts", PostRoutes);
app.use("*", NotFoundHandler);

app.use(ErrorHandler);

server.listen(Number(port), () => {
    console.log(`your app is running on http://${host}:${port}`);
});
