import {useEffect, useState, useCallback} from 'react';
import Login from '../components/LoginComponent';
import {useLocation, useNavigate} from "react-router-dom";
import {isAuth} from "../api.js";
import {toast} from "react-toastify";

const LoginPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuth()) {
            const intended = location.state;
            if (intended) {
                navigate(intended.from);
            } else {
                navigate('/');
            }
        }
    }, [location.state, navigate]);

    const handleLoginSuccess = (data) => {

        let intended = location.state;
        if (intended) {
            navigate(intended.from);
        } else {
            if (isAuth().assignedNumber && data.assignedNumber) {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        }
        toast.success('Login success')
    }



    return (
        <div className="container">
            <Login onLoginSuccess={handleLoginSuccess}/>
        </div>
    );
};

export default LoginPage;
