import React, {useState, useEffect} from "react";
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "../../utils/constants";
import './LotteryPage.scss'
import Marquee from "react-fast-marquee";
import CountDown from "./CountDown";
import BuyButton from "./BuyButton";
import AdminControls from "./AdminControls";


const LotteryPage: React.FC = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [userTickets, setUserTickets] = useState<number>(0);
  
  // State variables to replace thirdweb contract read hooks
  const [remainingTickets, setRemainingTickets] = useState<number>(0);
  const [currentWinning, setCurrentWinning] = useState<string>("0");
  const [winnings, setWinnings] = useState<number>(0);
  const [ticketPrice, setTicketPrice] = useState<string>("0");
  const [totalCommission, setTotalCommission] = useState<string>("0");
  const [lastWinner, setLastWinner] = useState<string>("");
  const [lastWinnerAmount, setLastWinnerAmount] = useState<string>("0");
  const [lotteryOperator, setLotteryOperator] = useState<string>("");

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (!(window as any).ethereum) {
              console.error("MetaMask is not installed!");
              return;
            }
            try {
              await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
              const web3provider = new ethers.providers.Web3Provider((window as any).ethereum);
              const signer = web3provider.getSigner();
              const accounts = await web3provider.listAccounts();

              const deployedContract = new ethers.Contract(
                contractAddress,
                contractAbi,
                signer
              );
              setContract(deployedContract);
              setProvider(web3provider);
              setAccount(accounts[0]);
               const fetchContractData = async () => {
                try {
                    // Example of fetching data similar to thirdweb useContractRead
                    const [
                        remainingTicketsData,
                        currentWinningData,
                        winningsData,
                        ticketPriceData,
                        lastWinnerData,
                        lastWinnerAmountData,
                        dealerAddress
                    ] = await Promise.all([
                        deployedContract.RemainingTickets(),
                        deployedContract.CurrentWinningReward(),
                        deployedContract.getWinningsForAddress(accounts[0]),
                        deployedContract.ticketPrice(),
                        deployedContract.lastWinner(),
                        deployedContract.lastWinnerAmount(),
                        deployedContract.Dealer()
                    ]);

                    const safeFormatEther = (value: any) => {
                      try {
                          if (value && !value.isZero()) {
                              return ethers.utils.formatEther(value);
                          }
                          return "0";
                      } catch (error) {
                          console.error("Error formatting ether:", error);
                          return "0";
                      }
                    };

                    setRemainingTickets(Number(remainingTicketsData.toString()));
                    setCurrentWinning(safeFormatEther(currentWinningData));
                    setTicketPrice(safeFormatEther(ticketPriceData));
                    setWinnings(Number(winningsData.toString()));
                    setLastWinner(lastWinnerData);
                    setLastWinnerAmount(safeFormatEther(lastWinnerAmountData));
                    setLotteryOperator(dealerAddress);

                    } catch (error) {
                        console.error("Error fetching contract data:", error);
                    }
            };
            fetchContractData();
                // Listen for account changes
            (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
                setAccount(accounts[0]);
            });
            } catch (error) {
                console.error("Error initializing contract:", error);
            }
          };
      
          loadBlockchainData();

          // Cleanup listener
        return () => {
          if ((window as any).ethereum) {
              (window as any).ethereum.removeListener('accountsChanged', () => {});
          }
      };

    }, []);

    const handleWithdrawWinnings = async () => {
      if (!contract) return;

      try {
          const tx = await contract.WithdrawWinnings();
          await tx.wait();
          // Handle success (e.g., show toast, update state)
      } catch (error) {
          console.error("Withdrawal failed:", error);
          // Handle error (e.g., show error toast)
      }
    };

    return (
      <div className="wholelotteryPage">
        <Marquee 
          className="lottery-marquee" 
          speed={100} 
          gradient={false}
          >
          <div className="marquee-content">
            <h4>
              Last Winner: {lastWinner?.toString()}
            </h4>
            <h4>
              Previous Winnings: {lastWinnerAmount} Ethers
            </h4>
          </div>
        </Marquee>
        
        {lotteryOperator === account && (
          <div className="admin-controls">
            <AdminControls />
          </div>
        )}
        
        {winnings > 0 && (
          <div className="winnings-container">
            <button
              onClick={handleWithdrawWinnings}
              className="win-btn"
              >
              Winner!!! Click here to withdraw
            </button>
          </div>
        )}
        
        <div className="lottery-container">
          <div className="stats-container">
            <h1>the next draw</h1>
            <div className="stats-summary">
              <div className="stats">
                <h2>total pool</h2>
                <p>{currentWinning} Ethers</p>
              </div>
              <div className="stats">
                <h2>Tickets Remaining</h2>
                <p>{remainingTickets}</p>
              </div>
            </div>
            <div className="countdown-container">
              <CountDown />
            </div>
          </div>
          
          <div className="ticket-container">
            <div className="ticket-details">
              <div className="ticket-price-header">
                <h2>Get your ticket</h2>
              </div>
              
              <div className="ticket-cost-details">
                <div className="cost-item">
                  <p>Costs of Ticket</p>
                  <p>{Number(ticketPrice)} Ethers</p>
                </div>
                <div className="cost-item">
                  <p>Service Fees</p>
                  <p>{totalCommission} Ethers</p>
                </div>
                <div className="cost-item">
                  <p>+ Network Fees</p>
                  <p>TBC</p>
                </div>
              </div>
              
              <BuyButton amount={amount} />
            </div>
            
            {userTickets > 0 && (
              <div className="user-tickets">
                <p>You have {userTickets} Tickets in this draw.</p>
                <div className="ticket-grid">
                  {Array(userTickets)
                    .fill("")
                    .map((_, id) => (
                      <p
                      key={id}
                      className="ticket-item"
                      >
                        {id + 1}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
}

export default LotteryPage