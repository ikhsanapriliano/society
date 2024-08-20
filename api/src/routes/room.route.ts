import { Router } from "express";
import { AuthHandler } from "../middlewares/auth.middelware";
import { CreateHandler, FindByIdHandler } from "../controllers/room.controller";

const RoomRoutes = Router();

RoomRoutes.get("/:id", AuthHandler, FindByIdHandler);
RoomRoutes.post("/", AuthHandler, CreateHandler);

export default RoomRoutes;
