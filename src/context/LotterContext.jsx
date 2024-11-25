import React, {useEffect, useState} from "react";
import { ethers } from 'ethers';

import { contractABI, contractAddress } from "../utils/constants";


export const LotterContext = React.createContext();

const { etherium } = window;

const getEthereumContract = () => {
    const provider = ethers.providers.Web3Provider(etherium);
    const signer = provider.getSigner();
    const lotterContract = new etherium.Contract(contractAddress, contractABI, signer);
    console.log({
        provider,
        signer,
        lotterContract
    })
}

export const LotterProvider = ({ children }) => {
    return (
        <LotterContext.Provider value={{ value: 'test' }}>
            { children }
        </LotterContext.Provider>
    );
}