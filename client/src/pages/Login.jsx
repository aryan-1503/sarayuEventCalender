import React, {useContext, useState} from 'react';
import {Box, TextField, Button, Typography, Link, CircularProgress} from '@mui/material';
import {api} from "../api/base.js";
import AuthContext from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Logging in user:', formData);
        // Add logic to handle form submission (e.g., API call)
        try{
            setLoading(true)
            const res = await api.post("auth/login",formData);
            alert(res.data.message);
            navigate("/")
            window.location.reload();

        }catch (error) {
            console.log("ERROR in login : ", error)
        }finally {
            setLoading(false)
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 400,
                mx: 'auto',
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <TextField
                id="email"
                label="Email"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                {loading ? <CircularProgress sx={{ color: "white" }} size="30px" /> : "Login"}
            </Button>
            <Typography
                sx={{
                    marginTop: "1rem"
                }}
            >
                Don't have an account? <Link href="/register">Register</Link>
            </Typography>
        </Box>
    );
};

export default Login;
