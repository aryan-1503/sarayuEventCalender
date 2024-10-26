import {Router} from "express";
import {getUser} from "../middlewares/get-user.middleware.js";
import {
    health,
    create,
    getAllEvents,
    getSingleEvent,
    updateSingleEvent,
    deleteSingleEvent
} from "../controllers/event.controller.js";


const eventRouter = Router();

eventRouter
    .get("/health", health)
    .post("/create",getUser, create)
    .get("/get-all-user-events", getUser, getAllEvents)
    .get("/get-single-event/:eventid", getSingleEvent)
    .patch("/update-event/:eventid", updateSingleEvent)
    .delete("/delete-event/:eventid", deleteSingleEvent)


export { eventRouter }