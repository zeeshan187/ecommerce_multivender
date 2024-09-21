// src/Dashboard/Logout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const Logout = () => {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();

    const handleClose = () => {
        setOpen(false);
        navigate('/dashboard/main'); // Redirect to main dashboard or any other route after canceling
    };

    const handleConfirm = () => {
        // Clear cookies
        document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Clear session storage
        sessionStorage.clear();

        // Clear local storage (if needed)
        localStorage.clear();

        // Redirect to the main page after a brief delay
        setTimeout(() => {
            navigate('/');
            window.location.reload(); // Reload the page
        }, 1000);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title">Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description">
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Logout;
