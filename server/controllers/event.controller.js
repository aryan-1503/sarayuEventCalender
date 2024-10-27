import {
    createEvent,
    deleteEventById,
    findEventById,
    findEventsByUser,
    updateEventById,
    updateShouldRemind
} from "../models/event.model.js";

import cron from 'node-cron';
import nodemailer from 'nodemailer';

export const health = (req,res) => {
    /*
        Function to check if event router is up and running
    */
    return res.status(200).json({ message : "Event route is working" })
}

export const create = async (req,res) => {
    /*
        Function to create a new event
        Request Body : eventname, description, eventdate
        Returns : newEvent
    */
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
    /*
        Function to fetch all user events
        Returns : All user events
    */
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
    /*
        Function to fetch a single event
        Request Params : eventid
        Returns : single event
    */
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
    /*
        Function to update a event
        Request Body : fields required to be updated
        Returns : updated event
    */
    const { eventid } = req.params;
    const eventData = req.body;

    try {
        const event = await updateEventById(eventid, eventData);
        return res.status(200).json({ success: true, message: "Event updated successfully", event });
    } catch (error) {
        console.log("ERROR IN updateSingleEvent: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong in updateSingleEvent", error });
    }
}

export const deleteSingleEvent = async (req, res) => {
    /*
        Function to delete a event
        Request Params : eventid
        Returns : newEvent
    */
    const { eventid } = req.params;
    try {
        await deleteEventById(eventid);
        return res.status(200).json({ success: true, message: "Event deleted successfully"});
    } catch (error) {
        console.log("ERROR IN deleteSingleEvent: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong in deleteSingleEvent", error });
    }
}

export const sendReminderForEvent = async (req, res) => {
    /*
        Function to send reminder for an event
        Request Params : eventid
        Returns : sends email to the user
    */
    const { eventid } = req.params;
    const user = req.user;

    try {
        const event = await findEventById(eventid); // Fetch event details
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        const updatedEvent = await updateShouldRemind(eventid);



        // Calculate reminder time (6 AM on the event date)
        const eventDate = new Date(event.eventdate);
        const reminderTime = new Date(eventDate);
        reminderTime.setHours(6, 0, 0); // Set reminder time to 6 AM

        // Check if the reminder time is in the future
        const now = new Date();
        if (reminderTime <= now) {
            return res.status(400).json({ success: false, message: "Reminder time has already passed" });
        }

        // Calculate delay until the reminder time
        const delay = reminderTime - now;

        // Schedule the reminder
        setTimeout(async () => {
            // Send the reminder (e.g., via email)
            await sendEmailReminder(event, user.email);
            console.log(`Reminder sent for event: ${event.eventname}`);
        }, delay);

        return res.status(200).json({ success: true, message: "Reminder scheduled successfully", updatedEvent});
    } catch (error) {
        console.log("ERROR IN sendReminderForEvent: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong in sendReminderForEvent", error });
    }
}


// Function to send email reminders
const sendEmailReminder = async (event,email) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        secureConnection : false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
        tls : {
            rejectUnauthorized :true
        }
    });

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: `Reminder for Event: ${event.eventname}`,
        text: `This is a reminder for your event "${event.eventname}" scheduled on ${event.eventdate}.`
    };

    await transporter.sendMail(mailOptions);
};

