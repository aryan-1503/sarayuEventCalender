import { useContext, useState } from 'react';
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Modal } from '@mui/material';
import { toast, ToastContainer } from "react-toastify";
import EventContext from "../context/EventContext";
import { api } from "../api/base";

const AddEventCard = () => {
    const { setIsOpen } = useContext(EventContext);
    const [formData, setFormData] = useState({
        title: "",
        priority: "medium",
        dueDate: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/event/create", formData);
            toast.success(res.data.message, { position: "top-right" });
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
