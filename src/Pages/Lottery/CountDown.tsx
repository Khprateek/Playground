import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Countdown from "react-countdown";
import { contractAddress, contractAbi } from "../../utils/constants";
import './CountDown.scss';

type Props = {
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  };

  function CountDown() {
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [expiration, setExpiration] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const loadContractData = async () => {
        if (!(window as any).ethereum) {
          console.error("MetaMask is not installed!");
          return;
        }
  
        try {
          await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
          const web3Provider = new ethers.providers.Web3Provider((window as any).ethereum);
          const signer = web3Provider.getSigner();
  
          const deployedContract = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
          );
  
          setContract(deployedContract);
  
          // Fetch expiration
          const expirationData = await deployedContract.expiration();
          setExpiration(expirationData.toNumber());
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading contract:", error);
          setIsLoading(false);
        }
      };
  
      loadContractData();
    }, []);
  
    const renderer = ({ hours, minutes, seconds, completed }: Props) => {
      if (completed) {
        return (
          <>
            <div className="ticket-closed-message">
              <h2>Ticket Sales have now CLOSED for this draw.</h2>
            </div>
            <div className="countdown-container">
              <div className="countdown-item">
                <div className="countdown animate-pulse">{hours}</div>
                <div className="countdown-label">hours</div>
              </div>
              <div className="countdown-item">
                <div className="countdown animate-pulse">{minutes}</div>
                <div className="countdown-label">minutes</div>
              </div>
              <div className="countdown-item">
                <div className="countdown animate-pulse">{seconds}</div>
                <div className="countdown-label">seconds</div>
              </div>
            </div>
          </>
        );
      } else {
        return (
          <div>
            <h3 className="ticket-remaining-message">Tickets remaining</h3>
            <div className="countdown-container">
              <div className="countdown-item">
                <div className="countdown">
                  {Number.isNaN(hours) ? "-" : hours}
                </div>
                <div className="countdown-label">hours</div>
              </div>
              <div className="countdown-item">
                <div className="countdown">
                  {Number.isNaN(minutes) ? "-" : minutes}
                </div>
                <div className="countdown-label">minutes</div>
              </div>
              <div className="countdown-item">
                <div className="countdown">
                  {Number.isNaN(seconds) ? "-" : seconds}
                </div>
                <div className="countdown-label">seconds</div>
              </div>
            </div>
          </div>
        );
      }
    };
  
    if (isLoading || !expiration) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <Countdown date={new Date(expiration * 1000)} renderer={renderer} />
      </div>
    );
  }
  
  export default CountDown;