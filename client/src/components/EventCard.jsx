import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';

const EventCard = ({ event, onEdit, onDelete, onRemind }) => {
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
                    Reminder: {event.shouldremind ? "Yes" : "No"}
                </Typography>
            </CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                <Button variant="outlined" color="secondary" onClick={onRemind}>
                    Remind Me
                </Button>
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
