import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Container, Modal } from '@mui/material';
import AddEventCard from "../components/AddEventCard";
import EditEventCard from "../components/EditEventCard";
import EventContext from "../context/EventContext";
import { api } from "../api/base";

const Home = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEvent, setSelectedEvent] = useState({});
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleEditClose = () => setEditOpen(false);

    useEffect(() => {
        const fetchAllEvents = async () => {
            setLoading(true);
            try {
                const res = await api.get('/event/all');
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
            event.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredEvents(searchQuery ? filterEvents : events);
    }, [searchQuery, events]);

    return (
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
                        <Box sx={{ mt: 2 }}>
                            {/* Map over filtered events and display them here */}
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map(event => (
                                    <Typography key={event.id} variant="body1" sx={{ my: 1 }}>
                                        {event.title}
                                    </Typography>
                                ))
                            ) : (
                                <Typography variant="body1">No events found</Typography>
                            )}
                        </Box>
                    )}

                    <Button
                        onClick={handleOpen}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                    >
                        Add New Event
                    </Button>

                    <Modal open={isOpen} onClose={handleClose}>
                        <Box sx={{ ...modalStyle }}>
                            <AddEventCard onClose={handleClose} />
                        </Box>
                    </Modal>

                    <Modal open={editOpen} onClose={handleEditClose}>
                        <Box sx={{ ...modalStyle }}>
                            <EditEventCard event={selectedEvent} onClose={handleEditClose} />
                        </Box>
                    </Modal>
                </Box>
            </EventContext.Provider>
        </Container>
    );
};

export default Home;

// Styling for modal positioning
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
