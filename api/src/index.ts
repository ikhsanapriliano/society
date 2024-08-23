import express from "express";
import cors from "cors";
import AuthRoutes from "./routes/auth.route";
import { ErrorHandler, NotFoundHandler } from "./middlewares/error.middleware";
import UserRoutes from "./routes/user.route";
import RoomRoutes from "./routes/room.route";
import http from "http";
import { WebSocket } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients: { id: string; ws: WebSocket }[] = [];

const environment: string = process.env.ENVIRONMENT as string;
const host = (
    environment === "production" ? process.env.HOST : "localhost"
) as string;
const port = process.env.PORT as string;

wss.on("connection", (ws) => {
    console.log("client connected");

    ws.on("message", (message) => {
        console.log("received: " + message);

        const data = JSON.parse(message as unknown as string);

        if (data.userId) {
            clients.push({ id: data.userId, ws: ws });
            return;
        }

        clients.forEach((client) => {
            if (client.id === data.receiver || client.id === data.sender) {
                if (client.ws.readyState === WebSocket.OPEN) {
                    client.ws.send(JSON.stringify(data));
                }
            }
        });
    });

    ws.on("close", () => {
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

server.listen(Number(port), host, () => {
    console.log(`your app is running on http://${host}:${port}`);
});
