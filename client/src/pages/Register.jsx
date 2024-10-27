import React, {useContext, useState} from 'react';
import {Box, TextField, Button, Typography, Link} from '@mui/material';
import {api} from "../api/base.js";
import AuthContext from "../context/AuthContext.jsx";
import {toast, ToastContainer} from "react-toastify";

const Register = () => {
    // State to store form values
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const { setTempUser } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Registering user:', formData);
        try{
            setLoading(true);
            const res = await api.post("auth/register",formData);
            setTempUser(res.data.user)
            toast.success(res.data.message, {
                position: "top-right"
            })
        }
        catch (error) {
            console.log("ERROR in register : ", error)
        }finally {
            setLoading(false)
        }
    };

    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 400,
                    maxWidth: 400,
                    mx: 'auto',
                    p: 4,
                    boxShadow: 4,
                    borderRadius: 2,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Typography variant="h5" sx={{ textAlign: 'center'}} gutterBottom>
                    Welcome to Sarayu Digital Labs!
                </Typography>
                <TextField
                    id="username"
                    label="Username"
                    variant="outlined"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
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
                    Register
                </Button>
                <ToastContainer  />
                <Typography
                    sx={{
                        marginTop: "1rem"
                    }}
                >
                    Already have an account? <Link href="/login">Login</Link>
                </Typography>
            </Box>

        </>

    );
};

export default Register;
