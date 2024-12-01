import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { contractAddress, contractAbi } from "../../utils/constants";
import './BuyButton.scss';

interface BuyButtonProps {
  amount: number;
}

function BuyButton({ amount }: BuyButtonProps) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [ticketPrice, setTicketPrice] = useState<string>("0");
  const [expiration, setExpiration] = useState<number>(0);
  const [remainingTickets, setRemainingTickets] = useState<number>(0);
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
        setProvider(web3Provider);

        // Fetch contract data
        const [
          ticketPriceData,
          expirationData,
          remainingTicketsData
        ] = await Promise.all([
          deployedContract.ticketPrice(),
          deployedContract.expiration(),
          deployedContract.RemainingTickets()
        ]);

        setTicketPrice(ethers.utils.formatEther(ticketPriceData));
        setExpiration(expirationData.toNumber());
        setRemainingTickets(remainingTicketsData.toNumber());
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading contract:", error);
        setIsLoading(false);
      }
    };

    loadContractData();
  }, []);

  const handleBuyTicket = async () => {
    if (!contract || !provider) return;

    const notify = toast.loading("Buying your tickets...");
    try {
      const totalPrice = (Number(ticketPrice)).toString();
      const tx = await contract.BuyTicket({
        value: ethers.utils.parseEther(totalPrice)
      });

      // Wait for transaction to be mined
      await tx.wait();

      toast.success(`ticket successfully purchased`, { id: notify });
      console.log("Payment successful", tx);
    } catch (error) {
      toast.error("Whoops something went wrong!!!", { id: notify });
      console.error("Contract call failure", error);
    }
  };
  const isDisabled = 
    (expiration && expiration < Math.floor(Date.now() / 1000)) || 
    remainingTickets === 0 || 
    isLoading;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="buy-button-container">
      <button 
        className={`buy-btn ${isDisabled ? 'disabled' : ''}`}
        onClick={handleBuyTicket}
        disabled={isDisabled}
      >
        {`BUY`}
      </button>
    </div>
  );
}

export default BuyButton;