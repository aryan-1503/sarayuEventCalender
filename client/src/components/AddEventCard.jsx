import { useContext, useState } from 'react';
import { Box, Button, TextField, Typography, Modal, FormControl, FormControlLabel, Checkbox } from '@mui/material';
import { toast, ToastContainer } from "react-toastify";
import EventContext from "../context/EventContext";
import { api } from "../api/base";

const AddEventCard = () => {
    const { setIsOpen } = useContext(EventContext);
    const [formData, setFormData] = useState({
        eventname: "",
        description: "",
        eventdate: "",
        shouldremind: false, // Default value for reminder
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/event/create", formData);
            alert(res.data.message);
            window.location.reload();
        } catch (error) {
            console.error(error);
        } finally {
            setIsOpen(false);
        }
    };

    return (
        <Modal open onClose={() => setIsOpen(false)}>
            <Box sx={{ ...modalStyle }}>
                <Typography variant="h5" align="center" fontWeight="bold" mb={2}>Add New Event</Typography>
                <form onSubmit={handleAdd}>
                    <TextField
                        fullWidth
                        label="Event Title"
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
                        multiline
                        rows={4}
                        required
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="shouldremind"
                                checked={formData.shouldremind}
                                onChange={handleChange}
                            />
                        }
                        label="Remind Me"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mr: 1 }}>
                            Add
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => setIsOpen(false)} fullWidth sx={{ ml: 1 }}>
                            Close
                        </Button>
                    </Box>
                </form>
                <ToastContainer />
            </Box>
        </Modal>
    );
};

export default AddEventCard;

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxWidth: 400,
    width: '90%',
};
