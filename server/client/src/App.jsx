import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreateUserPage from './pages/CreateUserPage';
import './App.css';
import Dashboard from './pages/Dashboard';
import Pick from './pages/Pick';
import { ProtectedRoute } from "./components/ProtectedRoute";
import HomePage from "./pages/Home";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Nav.jsx";

const App = () => {
    return (
        <Router>
            <div className="App">
                <ConditionalNavbar />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/create-user" element={<CreateUserPage />} />
                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/pick" element={<Pick />} />
                    </Route>
                </Routes>
                <ToastContainer />
            </div>
        </Router>
    );
};

// Conditionally render Navbar
const ConditionalNavbar = () => {
    const location = useLocation(); // Get the current path
    const hideNavbarRoutes = ["/login", "/create-user"]; // Define routes where Navbar should not appear

    if (hideNavbarRoutes.includes(location.pathname)) {
        return null; // Do not render Navbar for these routes
    }

    return <Navbar />;
};

export default App;
