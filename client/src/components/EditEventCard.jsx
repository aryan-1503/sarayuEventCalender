import { useContext, useState, useEffect } from 'react';
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { toast, ToastContainer } from "react-toastify";
import EventContext from '../context/EventContext';
import { api } from "../api/base";

const EditEventCard = ({ id, title, endDate, status, priority }) => {
    const { setEditOpen } = useContext(EventContext);

    const [formData, setFormData] = useState({
        title: title || "",
        priority: priority || "medium",
        dueDate: "",
        status: status || 'pending',
    });

    useEffect(() => {
        if (endDate) {
            setFormData((prevData) => ({
                ...prevData,
                dueDate: endDate.split('T')[0],
            }));
        }
    }, [endDate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? (checked ? 'completed' : 'pending') : value,
        }));
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put(`/event/${id}`, formData);
            toast.success(res.data.message, { position: "top-right" });
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
                        label="Event Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Priority</InputLabel>
                        <Select
                            label="Priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        type="date"
                        label="Due Date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        required
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.status === 'completed'}
                                onChange={handleChange}
                                name="status"
                            />
                        }
                        label="Event Completed"
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
