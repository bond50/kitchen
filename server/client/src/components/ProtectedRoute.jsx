import { useEffect, useState, useCallback } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuth, verifyAuth } from "../api.js";

export const ProtectedRoute = () => {
    const [isVerified, setIsVerified] = useState(null); // null for initial state

    // Wrap the checkAuth function in useCallback
    const checkAuth = useCallback(async () => {
        const localAuth = isAuth();
        if (localAuth) {
            const validToken = await verifyAuth(); // Verify token with backend
            setIsVerified(validToken);
        } else {
            setIsVerified(false); // Not authenticated
        }
    }, []); // Empty dependency array to ensure the function is created only once

    useEffect(() => {
        checkAuth(); // Call checkAuth on component mount
    }, [checkAuth]); // Use the callback function inside useEffect

    if (isVerified === null) {
        // Show a loading spinner while verifying
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return isVerified ? <Outlet /> : <Navigate to="/login" />;
};
