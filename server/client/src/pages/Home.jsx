import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, isAuth } from "../api"; // API function to fetch all users

const HomePage = () => {
    const [users, setUsers] = useState([]); // State to store all users
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track any errors
    const navigate = useNavigate();

    const maskPhoneNumber = (phone) => {
        if (!phone) return phone;
        // Mask all but first 3 and last 2 digits
        return phone.replace(/(\d{3})\d{4}(\d{2})/, '$1****$2');
    };

    const fetchUsers = useCallback(async () => {
        try {
            const allUsers = await getAllUsers(); // Fetch all users from the server

            // Identify the logged-in user
            const loggedInUserId = isAuth() ? isAuth().userId : null;

            // If logged in, move the logged-in user to the start of the list
            const loggedInUser = loggedInUserId ? allUsers.find(user => user._id === loggedInUserId) : null;
            const otherUsers = loggedInUser ? allUsers.filter(user => user._id !== loggedInUserId) : allUsers;

            // Sort the rest of the users alphabetically by name
            const sortedOtherUsers = otherUsers.sort((a, b) => a.name.localeCompare(b.name));

            // Combine the logged-in user with the rest
            const sortedUsers = loggedInUser ? [loggedInUser, ...sortedOtherUsers] : sortedOtherUsers;

            setUsers(sortedUsers); // Update state with the sorted users
            setLoading(false); // Stop loading
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users. Please try again.");
            setLoading(false);
        }
    }, []);

    // Fetch users on component mount or when token/userData changes
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Display loading message
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Display error message
    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    // Function to handle navigation based on user data
    const handleNavigate = (user) => {
        if (!isAuth()) {
            // If not logged in, redirect to login page with the intended destination
            navigate("/login", { state: { from: user.chosen ? "/dashboard" : "/pick" } });
        } else {
            // If logged in, check the picked field and navigate accordingly
            if (user.chosen) {
                navigate("/dashboard");
            } else {
                navigate("/pick");
            }
        }
    };

    return (
        <div className="container mt-3">
            <h2 className="text-center mb-3 fs-4">Welcome</h2>
            <div className="row justify-content-center">
                {/* Table Container */}
                <div className="col-12 col-lg-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white p-2">
                            <h5 className="card-title mb-0 fs-6">Users</h5>
                        </div>
                        <div className="card-body p-2">
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered mb-0 modern-table">
                                    <thead className="table-dark">
                                        <tr>
                                            <th className="p-2 fs-8">Name</th>
                                            <th className="p-2 fs-8">Phone</th>
                                            <th className="p-2 fs-8">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users && users.map((user) => (
                                            <tr key={user._id} className="table-row">
                                                <td className="p-2 fs-8">{user.name}</td>
                                                <td className="p-2 fs-8">{maskPhoneNumber(user.phoneNumber)}</td>
                                                <td className="p-2">
                                                    {isAuth() && isAuth().userId === user._id ? (
                                                        <button
                                                            className={`btn btn-sm ${user.chosen ? "btn-success" : "btn-primary"}`}
                                                            onClick={() => handleNavigate(user)}
                                                        >
                                                            {user.chosen ? "Check your position" : "Pick Number"}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            disabled
                                                        >
                                                            {user.chosen ? "Picked" : "Not Picked"}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
