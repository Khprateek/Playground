import React, {useEffect, useState} from "react";
import { ethers } from 'ethers';

import { contractAbi, contractAddress } from "../utils/constants";


export const LotterContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    if(!window.ethereum){
        throw new Error("Ethereum Object not found. Install MetaMask")
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const lotteryContract = new ethereum.Contract(contractAddress, contractAbi, signer);
    console.log({
        provider,
        signer,
        lotteryContract
    })

    return lotteryContract;
}

export const LotterProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState("");

    const checkIfWalletIsConnected = async () => {

        try {
            if(!ethereum) return alert("Please install metamask");
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if(accounts.length){
                setCurrentAccount(accounts[0]);
                //getALL
            }else{
                console.log("No account Found");
            }
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }

    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);

        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);


    return (
        <LotterContext.Provider value={{ connectWallet, currentAccount }}>
            { children }
        </LotterContext.Provider>
    );
}