import React, {useState, useEffect} from "react";
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "../../utils/constants";
import './LotteryPage.scss'
import Marquee from "react-fast-marquee";
// import AdminControls from "./AdminControls";


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

               // Fetch contract data
               const fetchContractData = async () => {
                try {
                    // Example of fetching data similar to thirdweb useContractRead
                    const [
                        remainingTicketsData,
                        currentWinningData,
                        winningsData,
                        ticketPriceData,
                        commissionData,
                        lastWinnerData,
                        lastWinnerAmountData,
                        lotteryOperatorData
                    ] = await Promise.all([
                        deployedContract.RemainingTickets(),
                        deployedContract.CurrentWinningReward(),
                        deployedContract.getWinningsForAddress(accounts[0]),
                        deployedContract.ticketPrice(),
                        deployedContract.ticketCommission(),
                        deployedContract.lastWinner(),
                        deployedContract.lastWinnerAmount(),
                        deployedContract.Dealer()
                    ]);
                    const sanitizeValue = (value: any) => {
                      return value ? value.toString().replace(/\.0+$/, '') : '0';
                    };
                    setRemainingTickets(sanitizeValue(remainingTicketsData).toNumber());
                    setCurrentWinning(ethers.utils.formatEther(sanitizeValue(currentWinningData)));
                    setTicketPrice(ethers.utils.formatEther(sanitizeValue(ticketPriceData)));
                    setTotalCommission(ethers.utils.formatEther(sanitizeValue(commissionData)));
                    setWinnings(sanitizeValue(winningsData).toNumber());
                    setLastWinner(lastWinnerData);
                    setLastWinnerAmount(ethers.utils.formatEther(sanitizeValue(lastWinnerAmountData)));
                    setLotteryOperator(lotteryOperatorData);
                    // alert("data Fetched Successfull");
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setAmount(e.target.valueAsNumber);
    };
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

        {/* <Header /> */}
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
              Previous Winnings:
              {lastWinnerAmount &&
                ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}
              Ethers
            </h4>
          </div>
        </Marquee>
        
        {/* {lotteryOperator === address && (
          <div className="admin-controls">
          <AdminControls />
          </div>
          )} */}
        
        {winnings > 0 && (
          <div className="winnings-container">
            <button
              onClick={handleWithdrawWinnings}
              className="win-btn"
              >
              Winner!!! Winner!!! Click here to withdraw
            </button>
          </div>
        )}
        
        <div className="lottery-container">
          <div className="stats-container">
            <h1>the next draw</h1>
            <div className="stats-summary">
              <div className="stats">
                <h2>total pool</h2>
                <p>
                  {currentWinning &&
                    ethers.utils.formatEther(currentWinning.toString())}{" "}
                  MATIC
                </p>
              </div>
              <div className="stats">
                <h2>Tickets Remaining</h2>
                <p>{remainingTickets}</p>
              </div>
            </div>
            <div className="countdown-container">
              {/* <CountDown /> */}
            </div>
          </div>
          
          <div className="ticket-container">
            <div className="ticket-details">
              <div className="ticket-price-header">
                <h2>Price per ticket</h2>
                <p>
                  {ticketPrice &&
                    ethers.utils.formatEther(ticketPrice.toString())}{" "}
                  Ethers
                </p>
              </div>
              
              <div className="ticket-input">
                <p>TICKETS</p>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={amount}
                  onChange={handleChange}
                  />
              </div>
              
              <div className="ticket-cost-details">
                <div className="cost-item">
                  <p>Total Costs of Ticket</p>
                  <p>
                    {ticketPrice &&
                      Number(ethers.utils.formatEther(ticketPrice.toString())) *
                      amount}{" "}
                    Ethers
                  </p>
                </div>
                <div className="cost-item">
                  <p>Service Fees</p>
                  <p>
                    {totalCommission &&
                      ethers.utils.formatEther(totalCommission.toString())}{" "}
                    Ethers
                  </p>
                </div>
                <div className="cost-item">
                  <p>+ Network Fees</p>
                  <p>TBC</p>
                </div>
              </div>
              
              {/* <BuyButton amount={amount} /> */}
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
        
        {/* <Footer /> */}
            </div>
    );
}

export default LotteryPage