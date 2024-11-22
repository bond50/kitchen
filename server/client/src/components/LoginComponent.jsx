import { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { loginUser } from '../api'; // Import loginUser function from the API helper file

const LoginComponent = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Track any errors

    const handleSubmit = async (e) => {
        e.preventDefault();



        try {
            // Call the loginUser function to authenticate the user
            const response = await loginUser({ username, password });



            // Check for a successful login based on server response
            if (response.token) {
                // Instead of checking for the token, we assume it's now in the cookie
                localStorage.setItem('userData', JSON.stringify(response.userData)); // Store user data to check assignedNumber
                localStorage.setItem('token', JSON.stringify(response.token)); // Store user data to check assignedNumber

                // Pass response to parent via callback
                onLoginSuccess(response.userData);
            } else {
                setError(new Error('Login failed. Please check your credentials.'));
            }
        } catch (error) {

            setError(error); // Handle any errors during the login process
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Login</h2>
                {error && <p className="text-danger">{error.message}</p>} {/* Display error message */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

// Define prop types for the component
LoginComponent.propTypes = {
    onLoginSuccess: PropTypes.func.isRequired, // onLoginSuccess should be a function and is required
};

export default LoginComponent;
