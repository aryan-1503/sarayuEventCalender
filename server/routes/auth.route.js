import { Router } from "express";
import {health, login, logout, me, register, verify} from "../controllers/auth.controller.js";
import {getUser} from "../middlewares/get-user.middleware.js";

const authRouter = Router();

authRouter
    .get("/health", health)
    .post('/register', register)
    .post('/login',login)
    .post('/verify',verify)
    .post('/logout',logout)
    .get('/me',getUser, me)

export { authRouter }