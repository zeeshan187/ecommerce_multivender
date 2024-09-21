// src/utils/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const userDetails = sessionStorage.getItem('userDetails');

    return userDetails ? children : <Navigate to="/" />;
};

export default PrivateRoute;
