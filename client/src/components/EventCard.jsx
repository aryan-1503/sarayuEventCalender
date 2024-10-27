import React, {useState} from 'react';
import {Box, Button, Card, CardContent, CircularProgress, Typography} from '@mui/material';
import {api} from "../api/base.js";

const EventCard = ({ event, onEdit, onDelete}) => {
    const [loading, setLoading] = useState(false);
    const onRemind = async (e) => {
        e.preventDefault()
        try{
            setLoading(true)
            const res = await api.post(`event/remind/${event.eventid}`, {});
            alert(res.data.message);
            window.location.reload();
        }catch (e) {
            console.log("ERROR in remind me : ", e)
        }finally {
            setLoading(false)
        }
    }
    return (
        <Card sx={{ p: 1, boxShadow: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="h5" gutterBottom>
                    {event.eventname}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Description: {event.description}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Event Date: {new Date(event.eventdate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Reminder: {event.shouldremind ? "A reminder will be sent!" : "No reminder set."}
                </Typography>
            </CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                {!event.shouldremind && (
                    <Button variant="outlined" color="secondary" onClick={onRemind}>
                        {loading ? <CircularProgress sx={{ color: "secondary" }} size="30px" /> : "Remind me"}
                    </Button>
                )}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" color="primary" onClick={onEdit}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={onDelete}>
                        Delete
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default EventCard;
