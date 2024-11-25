import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
const Navbar = () => {
    return (
        <div className="navbar">
            <nav>
                <Link to="/">Home</Link>
                <Link to="/">Arena</Link>
            </nav>
            <div className="nav-container">
                <img src="./assets/Images/logo.png" alt="Gaming Logo" className="logo" height={50} width={50} />
            </div>
            <nav>
                <Link to="/">About Me</Link>
                <Link to="/">Contact</Link>
            </nav>
        </div>
    );
};

export default Navbar;
