import { Router } from "express";
import { RegisterHandler } from "../controllers/auth.controller";

const AuthRoutes = Router();

AuthRoutes.post("/register", RegisterHandler);

export default AuthRoutes;
