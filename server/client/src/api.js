import axiosInstance from "./apiClient.js";
import cookie from "js-cookie";
// get cookie
export const getCookie = (key) => {
    if (typeof window !== 'undefined') {
        return cookie.get(key);
    }
};

export const removeCookie = (key) => {
    if (typeof window !== 'undefined') {
        cookie.remove(key, {
            expires: 1,
        });
    }
};

export const removeLocalStorage = (key) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
    }
};


export const signout = (next) => {
    removeCookie("token");
    removeLocalStorage("userData");
    next();
    return axiosInstance.get('/users/signout')
        .then((response) => {
            console.log("signout success");
        })
        .catch((err) => console.log(err));
};

// api.js
export const handleResponse = (response) => {
    if (response.status === 401) {
        console.warn("Session expired. Clearing authentication.");
        // Display session expiration message (optional for debugging)
        const message = "Your session is expired. Please sign in.";

        // Clear authentication state (cookies, localStorage, etc.)
        signout();

        // Return the message to the caller for further action
        return message;
    }
};


export const setLocalStorage = (key, value) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
    }
};
export const setCookie = (key, value) => {
    cookie.set(key, value, {
        expires: 7,
    });
};


// authenticate user by pass data to cookie and localstorage
export const authenticate = (data, next) => {
    console.log(data.token)
    setCookie("token", data.token);
    setLocalStorage("userData", data.userData);
    next();
};

export const isAuth = () => {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
        if (localStorage.getItem("userData")) {
            return JSON.parse(localStorage.getItem("userData"));
        } else {
            return false;
        }
    }

};
export const verifyAuth = async () => {
    try {
        const response = await axiosInstance.get('/auth/verify');
        console.log('Responded',response)
        return response.data.success; // Return true if valid

    } catch (error) {
         console.log('Not Responded',error)
        console.error("Token verification failed:", error.response?.data || error.message);
        signout(() => {
            console.warn("Session expired or invalid token. User signed out.");
        });
        return false;
    }
};

// Fetch all users
export const getAllUsers = async () => {
    const response = await axiosInstance.get('/users');
    console.log('FROM SERVICE', response.data)
    return response.data;
};

// Fetch available numbers
export const fetchAvailableNumbers = async () => {
    const response = await axiosInstance.get('/numbers/available');
    return response.data;
};

// Fetch chosen numbers
export const fetchChosenNumbers = async () => {
    const response = await axiosInstance.get('/numbers/chosen');
    return response.data;
};

// Create a new user
export const createUser = async (data) => {
    const response = await axiosInstance.post('/users/create', data);
    return response.data;
};

// Assign a random number to a user
export const assignNumber = async (id) => {
    const response = await axiosInstance.put(`/users/${id}`);
    return response.data;
};

// Login user

export const signin = async (data) => {
    const response = await axiosInstance.post('/users/login', data);
    return response.data;
};

// Submit picked number
export const submitPickedNumber = async (data) => {
    const response = await axiosInstance.post('/numbers/pick', data);
    return response.data;
};


// Fetch a user by ID
export const getUserById = async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
};
// export const signoutUser = async () => {
//     const response = await axiosInstance().get('/users/signout');
//     return response.data;
// };
