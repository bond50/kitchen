import { useNavigate } from "react-router-dom";
import { isAuth, signout } from "../api"; // Assuming `isAuth` and `signout` are in `../api`

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Pick", href: "/pick" },
];

const Navbar = () => {
  const navigate = useNavigate(); // React Router's navigation hook

  const handleLogout = () => {
    signout(() => {
      console.log("User logged out successfully.");
      navigate("/login"); // Navigate to the login page
    });
  };

  // Get authentication data
  const auth = isAuth();

  return (
    <nav className="navbar navbar-expand bg-body-tertiary">
      <div className="container">
        <a className="navbar-brand" href="/">
          Home
        </a>
        <ul className="navbar-nav me-auto">
          {navItems
            .filter((item) => !(auth?.chosen && item.label === "Pick")) // Hide "Pick" if chosen is truthy
            .map((item, index) => (
              <li className="nav-item" key={index}>
                <a className="nav-link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
        </ul>
        {auth && (
          <button
            className="btn btn-outline-danger ms-3"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
