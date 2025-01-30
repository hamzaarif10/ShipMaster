import React from "react";
import "../styles/Navbar.css";
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate(); // Initialize the navigate function
  
    const handleSignUpClick = () => {
      // Navigate to the Register page when the button is clicked
      navigate('/register');
    };
    const handleLoginClick = () => {
      navigate("/login");
    }
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="Logo" className="logo" /> {/* Replace with your logo */}
      </div>
      <ul className="navbar-links">
        <li>How it Works</li>
        <li>Pricing <span className="dropdown-icon">▼</span></li>
        <li>Integrations <span className="dropdown-icon">▼</span></li>
        <li>Support <span className="dropdown-icon">▼</span></li>
      </ul>
      <div className="navbar-buttons">
        <button onClick={handleSignUpClick} className="sign-up">Sign Up</button>
        <button onClick={handleLoginClick} className="login">Login</button>
      </div>
    </nav>
  );
}

export default Navbar;
