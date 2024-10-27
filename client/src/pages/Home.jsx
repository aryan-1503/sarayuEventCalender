import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Container, Modal, Grid } from '@mui/material';
import AddEventCard from "../components/AddEventCard";
import EditEventCard from "../components/EditEventCard";
import EventCard from "../components/EventCard"; // Import the EventCard component
import EventContext from "../context/EventContext";
import { api } from "../api/base";
import {navigate} from "react-big-calendar/lib/utils/constants.js";
import {useNavigate} from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";
import LandingComponent from "../components/LandingComponent.jsx";

const Home = () => {

    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEvent, setSelectedEvent] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleEditClose = () => setEditOpen(false);

    const handleEditOpen = (event) => {
        setSelectedEvent(event);
        setEditOpen(true);
    };

    const handleDelete = async (eventId) => {
        try {
            await api.delete(`/event/delete-event/${eventId}`);
            setEvents((prevEvents) => prevEvents.filter((event) => event.eventid !== eventId));
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    const handleRemind = (eventId) => {
        console.log(`Reminder set for event ID: ${eventId}`);
    };

    useEffect(() => {
        const fetchAllEvents = async () => {
            setLoading(true);
            try {
                const res = await api.get('/event/get-all-user-events');
                setEvents(res.data.events);
                setFilteredEvents(res.data.events);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllEvents();
    }, []);

    useEffect(() => {
        const filterEvents = events.filter(event =>
            event.eventname.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredEvents(searchQuery ? filterEvents : events);
    }, [searchQuery, events]);

    return (
        <>
            { !user ? (
                <LandingComponent />
            ) : (
                <Container sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', py: 4 }}>
                    <EventContext.Provider value={{ isOpen, setIsOpen, editOpen, setEditOpen, selectedEvent, setSelectedEvent }}>
                        <Box sx={{ width: '100%', textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>
                                Manage Your Events
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                                <TextField
                                    label="Search events by title"
                                    variant="outlined"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    sx={{ width: 300 }}
                                />
                            </Box>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    {filteredEvents.length > 0 ? (
                                        filteredEvents.map(event => (
                                            <Grid item xs={12} sm={6} md={4} key={event.eventid}>
                                                <EventCard
                                                    event={event}
                                                    onEdit={() => handleEditOpen(event)}
                                                    onDelete={() => handleDelete(event.eventid)}
                                                    onRemind={() => handleRemind(event.eventid)}
                                                />
                                            </Grid>
                                        ))
                                    ) : (
                                        <Typography variant="body1">No events found</Typography>
                                    )}
                                </Grid>
                            )}

                            {/* Fixed Position Buttons */}
                            <Box sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', gap: 2 }}>
                                <Button
                                    onClick={handleOpen}
                                    variant="contained"
                                    color="primary"
                                >
                                    Add New Event
                                </Button>
                                <Button
                                    onClick={() => { navigate("/user-calendar")}}
                                    variant="outlined"
                                    color="primary"
                                >
                                    View Calendar
                                </Button>
                            </Box>

                            {/* Add Event Modal */}
                            <Modal open={isOpen} onClose={handleClose}>
                                <Box sx={{ ...modalStyle }}>
                                    <AddEventCard onClose={handleClose} />
                                </Box>
                            </Modal>

                            {/* Edit Event Modal */}
                            <Modal open={editOpen} onClose={handleEditClose}>
                                <Box sx={{ ...modalStyle }}>
                                    <EditEventCard
                                        eventid={selectedEvent.eventid}
                                        eventname={selectedEvent.eventname}
                                        description={selectedEvent.description}
                                        eventdate={selectedEvent.eventdate}
                                        onClose={handleEditClose}
                                    />
                                </Box>
                            </Modal>
                        </Box>
                    </EventContext.Provider>
                </Container>
            )}
        </>

    );
};

export default Home;


const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgColor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};
