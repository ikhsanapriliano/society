import { Router } from "express";
import { AuthHandler } from "../middlewares/auth.middelware";
import {
    CreateHandler,
    FindByIdHandler,
    FindByUserIdHandler,
} from "../controllers/room.controller";
import {
    CreateRoomChatHandler,
    UpdateRoomChatHandler,
} from "../controllers/chat.controller";

const RoomRoutes = Router();

RoomRoutes.get("/:id", AuthHandler, FindByIdHandler);
RoomRoutes.get("/", AuthHandler, FindByUserIdHandler);
RoomRoutes.post("/", AuthHandler, CreateHandler);
RoomRoutes.post("/chats", AuthHandler, CreateRoomChatHandler);
RoomRoutes.patch("/:roomId/chats", AuthHandler, UpdateRoomChatHandler);

export default RoomRoutes;
