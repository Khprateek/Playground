import React, {useContext} from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './Home.scss';
import HexBackground from '../../components/HexBackground/HexBackground';

const Home: React.FC = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const glow = document.querySelector('.glow');
      if (glow) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        (glow as HTMLElement).style.left = `${mouseX}px`;
        (glow as HTMLElement).style.top = `${mouseY}px`;
        glow.classList.add('expanded');
      }
    };

    const handleMouseLeave = () => {
      const glow = document.querySelector('.glow');
      if (glow) {
        glow.classList.remove('expanded');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="home">
      <div className="glow"></div>
      <div className="hex-container">
        <HexBackground/>
        <div className="homepg">
          <div className="txtcol">
            <div className="maintxt">
              <h3>Become a child</h3>
              <h1>Get Involved :</h1>
              <h2>Play to your full content</h2>
              <p>Express your love for games!</p>
            </div>
          </div>
          <div className="imcol"></div>
        </div>
      </div>

      <div className="header">
        <h1><b>FEATURED</b></h1>
      </div>

      <div className="game-area">
        <div className="side">
          <div className="stick-box">
            <h2>PLAY GROUND</h2>
            <div className="line"></div>
            <p>explore the world of games</p>
            <p>Play to your full content</p>
            <p>You are born for something different</p>
            <p>Choose from the rest be different</p>
            <div className="line"></div>
            <Link to="/Arena">
              <button className="btn2">Play Now</button>
            </Link>
          </div>
        </div>
        <div className="game-cards">
          <div className="game-card">
            <div className="content">
                  <h2>Play the Ultimate Snake Game!</h2>
                  <h3>Features:</h3>
                  <p>
                    Classic gameplay with smooth implementation
                    <br />
                    Dynamic difficulty and customizable themes.
                  </p>
                  <h3>How to play:</h3>
                  <p>
                    Use the arrow keys to move the snake.
                    <br /> 
                    Avoid hitting the walls or the snake's own body.
                    <br /> 
                    Collect food to grow longer.
                  </p>
                  <h3>Get Started:</h3>
                  <div className="twobutton">
                    <Link to="/Arena">
                      <button className="btn2">Play Now</button>
                    </Link>
                    <Link to="/Arena">
                      <button className="btn2">See code</button>
                    </Link>
                  </div>

                </div>
                  <div className="gamei">
                    <img src="./assets/Images/snake1.jpg" alt="Image not found" loading="lazy" />
                  </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;