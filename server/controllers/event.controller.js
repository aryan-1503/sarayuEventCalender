import {createEvent, deleteEventById, findEventById, findEventsByUser, updateEventById} from "../models/event.model.js";

export const health = (req,res) => {
    return res.status(200).json({ message : "Event route is working" })
}

export const create = async (req,res) => {
    const { eventname, description, eventdate } = req.body;
    try{
        const user = req.user;
        const newEvent = await createEvent(eventname, description, eventdate,user.userid);
        return res.status(200).json({ success: true, message: "Event created!", newEvent })
    }catch (error) {
        console.log("ERROR IN create : ", error);
        return res.status(500).json({ success : false, message : "Something went wrong in create", error })
    }
}

export const getAllEvents = async (req,res) => {
    try{
        const user = req.user;
        const events = await findEventsByUser(user.userid);
        if(events.length === 0){
            return res.status(404).json({ message : "No events created yet" });
        }

        return res.status(200).json({ success : true, message : "User events found" , events })
    }catch (error) {
        console.log("ERROR IN getAllEvents : ", error);
        return res.status(500).json({ success : false, message : "Something went wrong in getAllEvent", error })
    }
}

export const getSingleEvent = async (req,res) => {
    const { eventid } = req.params;
    try{
        const event = await findEventById(eventid);
        if(!event){
            return res.status(404).json({ message : "No such event found" });
        }

        return res.status(200).json({ success : true, message : "Event found" , event })
    }catch (error) {
        console.log("ERROR IN getSingleEvent : ", error);
        return res.status(500).json({ success : false, message : "Something went wrong in getSingleEvent", error })
    }
}

export const updateSingleEvent = async (req, res) => {
    const { eventid } = req.params;
    const eventData = req.body; // Get the whole event data

    try {
        const event = await updateEventById(eventid, eventData);
        return res.status(200).json({ success: true, message: "Event updated successfully", event });
    } catch (error) {
        console.log("ERROR IN updateSingleEvent: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong in updateSingleEvent", error });
    }
}

export const deleteSingleEvent = async (req, res) => {
    const { eventid } = req.params;

    try {
        await deleteEventById(eventid);
        return res.status(200).json({ success: true, message: "Event deleted successfully"});
    } catch (error) {
        console.log("ERROR IN deleteSingleEvent: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong in deleteSingleEvent", error });
    }
}
