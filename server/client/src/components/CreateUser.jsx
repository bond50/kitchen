import { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Link } from 'react-router-dom'; // Import Link for navigation
import { createUser } from '../api';
import {toast} from "react-toastify";

const CreateUser = ({ onUserCreated }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        setSuccess(null); // Clear previous success messages
        setLoading(true); // Show loading spinner

        // Trim spaces from name and phone number before sending them
        const trimmedName = name.trim();
        const trimmedPhoneNumber = phoneNumber.trim();

        try {
            // Send trimmed name and phone number to the backend
            const response = await createUser({ name: trimmedName, phoneNumber: trimmedPhoneNumber });

            // Show success message
            setSuccess(response.message);

            // Update the parent component (optional)
            onUserCreated && onUserCreated(response.newUser);

            // Clear the fields after user creation
            setName('');
            setPhoneNumber('');
             toast.success('User added successfully')
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || 'An unknown error occurred';
            setError(`Error creating user: ${errorMessage}`);
             toast.error(errorMessage)
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Create New User</h2>
                {error && <p className="text-danger text-center">{error}</p>} {/* Display error message */}
                {success && <p className="text-success text-center">{success}</p>} {/* Display success message */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter full name"
                            value={name}
                            onChange={(e) => setName(e.target.value.trimStart())} // Trim leading spaces
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.trimStart())} // Trim leading spaces
                            required
                            pattern="^[0-9]{10}$" // Phone number validation
                            title="Phone number must be 10 digits"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            'Create User'
                        )}
                    </button>
                </form>
                {/* Links to other pages */}
                <div className="text-center mt-3">
                    <p>
                        <Link to="/" className="text-decoration-none">
                            Back to Home
                        </Link>
                    </p>
                    <p>
                        <Link to="/login" className="text-decoration-none">
                            Already have an account? Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Add PropTypes to validate props
CreateUser.propTypes = {
    onUserCreated: PropTypes.func.isRequired, // onUserCreated is a required function
};

export default CreateUser;
