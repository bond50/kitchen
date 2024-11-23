import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreateUserPage from './pages/CreateUserPage';
import './App.css';
import Dashboard from './pages/Dashboard';
import Pick from './pages/Pick';
import { ProtectedRoute } from "./components/ProtectedRoute";
import HomePage from "./pages/Home";
import {ToastContainer} from "react-toastify";

const App = () => {
  return (
    <Router>
      <div className="App">
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

export default App;
