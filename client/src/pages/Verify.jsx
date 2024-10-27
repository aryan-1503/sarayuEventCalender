import React, {useContext, useState} from 'react';
import {Box, TextField, Button, Typography, CircularProgress} from '@mui/material';
import {api} from "../api/base.js";
import AuthContext from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

const Verify = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false)
    const { tempUser, setUser } = useContext(AuthContext);
    const email = tempUser.email;

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { value } = e.target;
        // Limit input to 4 digits
        if (value.length <= 4 && /^\d*$/.test(value)) {
            setCode(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Verification code:', code);
        console.log(typeof code);
        // Add logic to handle verification submission (e.g., API call)
        try{
            setLoading(true);
            const res = await api.post("auth/verify", { email , verificationCode : code });
            alert(res.data.message);
            setUser(res.data.user);
            navigate("/");

        }catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message)
                if (error.response.data.message === "Verification Failed") {
                    navigate("/");
                }
            } else {
                const response = await api.delete(`/auth/delete-user/${tempUser.userid}`);
                alert(response.data.message)
                console.log(error);
            }
            console.log(error.message);
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
                    maxWidth: 300,
                    mx: 'auto',
                    p: 4,
                    boxShadow: 3,
                    borderRadius: 2,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Verify Your Account
                </Typography>
                <TextField
                    id="verification-code"
                    label="Verification Code"
                    variant="outlined"
                    value={code}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 4, pattern: "\\d{4}" }}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    {loading ? <CircularProgress sx={{ color: "white" }} size="30px" /> : "Verify"}
                </Button>
            </Box>
        </>

    );
};

export default Verify;
