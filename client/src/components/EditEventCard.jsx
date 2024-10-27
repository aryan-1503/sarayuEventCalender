import { useContext, useState } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { ToastContainer } from "react-toastify";
import EventContext from '../context/EventContext';
import { api } from "../api/base";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const EditEventCard = ({ eventid, eventname, description, eventdate }) => {
    const { setEditOpen } = useContext(EventContext);

    const [formData, setFormData] = useState({
        eventname: eventname || "",
        description: description || "",
        eventdate: eventdate || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.patch(`event/update-event/${eventid}`, formData);
            alert(res.data.message);
            window.location.reload();
        } catch (error) {
            console.error(error);
        } finally {
            setEditOpen(false);
        }
    };

    return (
        <Modal open onClose={() => setEditOpen(false)}>
            <Box sx={{ ...modalStyle }}>
                <Typography variant="h5" align="center" fontWeight="bold" mb={2}>Edit Event</Typography>
                <form onSubmit={handleEdit}>
                    <TextField
                        fullWidth
                        label="Event Name"
                        name="eventname"
                        value={formData.eventname}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        type="date"
                        label="Event Date"
                        name="eventdate"
                        value={formData.eventdate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        required
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mr: 1 }}>
                            Save
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => setEditOpen(false)} fullWidth sx={{ ml: 1 }}>
                            Close
                        </Button>
                    </Box>
                </form>
                <ToastContainer />
            </Box>
        </Modal>
    );
};

export default EditEventCard;
