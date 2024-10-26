import jwt from "jsonwebtoken";
import {findUserById} from "../models/user.model.js";

export const getUser = async (req,res,next) => {
    /*
        Middleware to get the current user
    */
    const { token } = req.cookies;
    if(!token){
        return res.status(404).json({ success: false, message: "Token Expired" })
    }
    const data = await jwt.verify(token, process.env.SECRET,{
        httpOnly: true,
        secure: true,
        sameSite: "None"
    });

    if (!data) {
        return res.status(401).json({ msg: "data Unauthorized" });
    }
    const id = data.id
    const user = await findUserById(id);
    if(!user) {
        return res.status(404).json({ success: false, message: "User not found"})
    }
    req.user = user
    next();
}
