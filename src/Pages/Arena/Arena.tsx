import './Arena.scss';
import React, {useContext} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
const Arena: React.FC = () => {

    const scrollLeft = () => {
          // Logic to scroll left
    };

    const scrollRight = () => {
          // Logic to scroll right
    };

    return (
        <div className="arena">
          <div className="row">
            <div className="col">
                  <div className="redcard">
                      <div className="card-details">
                        <img src="./assets/Images/snake.png" alt="" height={150} width={100} />
                          <p className="heading">LOTTERY</p>
                          <p>Uiverse</p>
                          <Link to="/LotteryPage">LotteryPage</Link>
                      </div>
                  </div>
            </div>
            <div className="col">
                  <div className="bluecard">
                      <div className="card-details">
                        <img src="./assets/Images/snake.png" alt="" height={150} width={100} />
                        <p className="text-body">Snake-game</p>
                      </div>
                  </div>
            </div>
          </div>
        </div>
    )
}
export default Arena;