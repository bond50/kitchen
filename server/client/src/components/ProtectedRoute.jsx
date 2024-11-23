import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuth, verifyAuth } from "../api.js";

export const ProtectedRoute = () => {
    const [isVerified, setIsVerified] = useState(null); // null for initial state

    useEffect(() => {
        const checkAuth = async () => {
            const localAuth = isAuth();
            if (localAuth) {
                const validToken = await verifyAuth(); // Verify token with backend
                setIsVerified(validToken);
            } else {
                setIsVerified(false); // Not authenticated
            }
        };

        checkAuth();
    }, []);

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
