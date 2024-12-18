import React, { useState } from "react";
import { ethers } from "ethers";

export const connectWallet = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    alert("MetaMask is not installed! Please install it to use this feature.");
    return null;
  }

  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected account:", accounts[0]);
    return accounts[0]; // Return the connected account
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return null;
  }
};
