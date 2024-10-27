import React from 'react';
import {AppBar, Box, CssBaseline, Grid} from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import {Outlet} from "react-router-dom";

const RootLayout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Outlet />
        </Box>
    );
};

export default RootLayout;