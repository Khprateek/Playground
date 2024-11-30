import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { contractAddress, contractAbi } from "../../utils/constants";
import './AdminControl.scss';

function AdminControls() {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [totalCommission, setTotalCommission] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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
        const accounts = await web3Provider.listAccounts();

        const deployedContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        setContract(deployedContract);
        setProvider(web3Provider);

        // Check if current user is admin
        const dealer = await deployedContract.Dealer();
        const currentAccount = accounts[0];
        setIsAdmin(dealer.toLowerCase() === currentAccount.toLowerCase());
console.log(dealer.toLowerCase(), currentAccount.toLowerCase())
        // Fetch total commission
        const commissionData = await deployedContract.operatorTotalCommission();
        setTotalCommission(ethers.utils.formatEther(commissionData));
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading contract:", error);
        setIsLoading(false);
      }
    };

    loadContractData();
  }, []);

  const handleContractAction = async (
    actionName: string, 
    loadingMessage: string, 
    successMessage: string
  ) => {
    if (!contract) return;

    const notify = toast.loading(loadingMessage);
    try {
      const tx = await contract[actionName]();
      await tx.wait();
      toast.success(successMessage, { id: notify });
    } catch (error) {
      toast.error("Whoops something went wrong!!!", { id: notify });
      console.error(`Contract call failure (${actionName}):`, error);
    }
  };

  const handleDraw = () => handleContractAction(
    "DrawWinnerTicket", 
    "Draw raffle is in progress...", 
    "Draw has been completed"
  );

  const handleWithdrawCommission = () => handleContractAction(
    "WithdrawCommission", 
    "Withdrawing your commission...", 
    "Commission successfully withdrawn!"
  );

  const handleRestart = () => handleContractAction(
    "restartDraw", 
    "Restarting the draw...", 
    "Draw has been restarted!"
  );

  const handleReFundAll = () => handleContractAction(
    "RefundAll", 
    "Refunding the wallet...", 
    "Wallet has been refunded!"
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-controls-container">
      <h2 className="admin-title">Admin Controls</h2>
      <p className="commission-info">
        Total Commission to be withdrawn: {totalCommission} Ethers
      </p>
      <div className="admin-buttons-container">
        <button 
          className="admin-btn" 
          onClick={handleDraw}
        >
          🏆 Draw Winner
        </button>

        <button 
          className="admin-btn" 
          onClick={handleWithdrawCommission}
        >
          💰 Withdraw Commission
        </button>

        <button 
          className="admin-btn" 
          onClick={handleRestart}
        >
          🔄 Restart Draw
        </button>

        <button 
          className="admin-btn" 
          onClick={handleReFundAll}
        >
          ↩️ Refund All
        </button>
      </div>
    </div>
  );
}

export default AdminControls;