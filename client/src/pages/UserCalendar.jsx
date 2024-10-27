import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { api } from "../api/base"; // Adjust this import based on your API setup
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const UserCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true)
                const res = await api.get('/event/get-all-user-events');
                console.log("from res : ", res.data.events)
                const eventsData = res.data.events.map(event => ({
                    title: event.eventname,
                    start: new Date(event.eventdate), // Convert to Date object
                    end: new Date(event.eventdate),     // Convert to Date object
                    allDay: false,
                }));
                console.log(eventsData)
                setEvents(eventsData);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <>
            {loading ? (
                <p>Loading events...</p>
            ) : (
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                />
            )}
        </>
    );
};

export default UserCalendar;
