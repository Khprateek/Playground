import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import Arena from '../../Pages/Arena/Arena';

import { LotterContext } from '../../context/LotterContext';

const Navbar = () => {

    const { connectWallet, currentAccount } = useContext(LotterContext);

    return (
        <div className="navbar">
            <nav>
                <Link to="/">Home</Link>
                <Link to="/Arena">Arena</Link>
            </nav>
            <div className="nav-container">
                <img src="./assets/Images/logo.png" alt="Gaming Logo" className="logo" height={50} width={50} />
            </div>
            <nav>
                <Link to="/">About Me</Link>
                <div className="btn-container">
                    <button id="wallet-btn" onClick={connectWallet} >{!currentAccount ? 'Connect Wallet' : 'Connected'}</button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
