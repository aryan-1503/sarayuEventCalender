// src/components/LandingComponent.jsx

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingComponent = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSignup = () => {
        navigate('/register');
    };

    return (
        <Box sx={{
            textAlign: 'center',
            mt: 10
        }}>
            <Typography variant="h4" gutterBottom>
                Welcome to Our Event Management App!
            </Typography>
            <Typography variant="body1" gutterBottom>
                Manage your events effortlessly. Join us today!
            </Typography>
            <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="primary" onClick={handleLogin} sx={{ mr: 2 }}>
                    Login
                </Button>
                <Button variant="outlined" color="primary" onClick={handleSignup}>
                    Signup
                </Button>
            </Box>
        </Box>
    );
};

export default LandingComponent;
