import axios from 'axios';
import {toast} from 'react-toastify';
import {getCookie, signout} from "./api.js";  // For user-friendly notifications

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,  // API base URL
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to include the token
axiosInstance.interceptors.request.use((req) => {
    const token = getCookie('token');  // Assuming getCookie is a function to fetch the token
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        let errorMessage = 'An unexpected error occurred. Please try again.';

        if (error.response) {
            // Check for known status codes and customize messages accordingly
            switch (error.response.status) {
                case 400:
                    errorMessage = error.response.data?.message || 'Bad Request. Please check your input.';
                    break;
                case 401:
                    errorMessage = error.response.data?.message || 'Your session has expired. Please log in again.';
                    signout(() => {
                        console.warn('User signed out due to session expiration.');
                    }).then(r => console.log(
                        r
                    ));
                    break;
                case 404:
                    errorMessage = error.response.data?.message || 'Requested resource not found.';
                    break;
                case 500:
                    errorMessage = error.response.data?.message || 'Internal server error. Please try again later.';
                    break;
                default:
                    errorMessage = error.response.data?.message || error.message;
                    break;
            }

            // Display error message using toast (or alert if you prefer)
            toast.error(errorMessage);

            // Optionally log the error for debugging purposes
            console.error('API Error:', errorMessage);
        } else {
            // Handle cases where there’s no response (network issues, etc.)
            errorMessage = 'Network error. Please check your internet connection.';
            toast.error(errorMessage);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
