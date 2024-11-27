import './Arena.scss';
import React, {useContext} from 'react';
import Navbar from "../../components/Navbar/Navbar"
const Arena = () => {

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
                        <p className="text-body">Lottery</p>
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