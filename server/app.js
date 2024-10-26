import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { authRouter } from "./routes/auth.route.js";
// import createDatabaseAndTables from "./utils/db.js";
import { eventRouter } from "./routes/event.route.js";
import {createTables} from "./utils/db.js";

const PORT = process.env.PORT || 8000;
console.log("Event Calender Backend");

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173", "https://snap-share-xi.vercel.app"],
        credentials: true,
    })
);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
    cookieParser(process.env.SECRET, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
);

// await createDatabaseAndTables()
await createTables();

// Routers
app.use("/api/auth", authRouter);
app.use("/api/event/", eventRouter);

app.get("/", (req, res) => {
    return res.status(200).json({
        status: 200,
        topic: "health check",
        data: "Ok",
        uptime: process.uptime(),
        date: new Date(),
    });
});


app.listen(PORT, () => {
    console.log(`Server running on : ${PORT}`);
});
