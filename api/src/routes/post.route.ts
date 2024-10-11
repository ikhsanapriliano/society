import { Router } from "express";
import { AuthHandler } from "../middlewares/auth.middelware";
import {
    AddOrEditCommentHandler,
    CreateHandler,
    DeleteCommentHandler,
    DeleteHandler,
    FindManyHandler,
    FindSingleHandler,
    UpdateHandler,
} from "../controllers/post.controller";

const PostRoutes = Router();

PostRoutes.get("/", AuthHandler, FindManyHandler);
PostRoutes.get("/:id", AuthHandler, FindSingleHandler);
PostRoutes.post("/", AuthHandler, CreateHandler);
PostRoutes.patch("/:id", AuthHandler, UpdateHandler);
PostRoutes.delete("/:id", AuthHandler, DeleteHandler);
PostRoutes.post("/:id/comments", AuthHandler, AddOrEditCommentHandler);
PostRoutes.delete("/:id/comments", AuthHandler, DeleteCommentHandler);

export default PostRoutes;
