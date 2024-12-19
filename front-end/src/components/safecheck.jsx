import React, { useState } from "react";
import { ethers } from "ethers";
import Stake from "../abi/Hedemy_Stake_abi.json";

export default function StakeOpenModal() {
  const [amount, setAmount] = useState("20"); // Fixed amount of HBAR to send
  const [transactionStatus, setTransactionStatus] = useState("");
  const [txHash, setTxHash] = useState("");
  const [stakeSuccess, setStakeSuccess] = useState(false); // Tracks if stake was successful

  const { ethereum } = window;
  const contract_address = "0xa024EE8e12700AAEBA374AA3B4186Ba62e2C6645";
  const contract_abi = Stake.abi;

  const stake_function = async () => {
    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }
  
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contract_address, contract_abi, signer);
  
      // Convert the amount to tinybars (1 HBAR = 1,000,000 tinybars)
      const amountInTinybars = ethers.parseUnits(amount, "ether");
      console.log("amountin_tinybars", amountInTinybars);
  
      const tx = await contract.stake({ value: amountInTinybars });
      setTransactionStatus("Transaction in progress...");
      await tx.wait();
      setTransactionStatus("Stake transaction successful");
      setTxHash(tx.hash);
      setStakeSuccess(true); // Mark stake as successful
      console.log("Stake transaction details:", tx);
  
      // Immediately call return_creator after successful staking
      await return_creator();
    } catch (error) {
      console.error("Error on staking", error);
      setTransactionStatus("Stake transaction failed.");
    }
  };
  
  const return_creator = async () => {
    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contract_address, contract_abi, signer);
  
      const return_creator_tx = await contract.return_creator();
      setTransactionStatus("Creator return in progress...");
      await return_creator_tx.wait();
      setTransactionStatus("Creator return successful");
      setTxHash(return_creator_tx.hash);
      console.log("Creator return transaction details:", return_creator_tx.hash);
    } catch (error) {
      console.error("The error while returning to creator", error);
      setTransactionStatus("Creator return failed.");
    }
  };

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => document.getElementById("my_modal_4").showModal()}
      >
        Stake Now
      </button>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-3/4 max-w-5xl p-8">
          {!stakeSuccess ? (
            <>
              <h3 className="font-bold text-lg text-center mb-8 text-white">
                Welcome Course!
              </h3>
              <p className="py-2 text-xl text-white">
                Name of the Course: Hashgraph Explorer
              </p>
              <p className="py-2 text-xl text-white">
                Author of the Course: 0x62752de9CA838C71084d2B841Be1Aa71e45B4B7e
              </p>
              <p className="py-2 text-xl text-white">Course Fee: 50HBAR</p>
              <p className="py-2 text-xl text-white">
                Course Status: Approved by HedemyDAO
              </p>
              <p className="py-2 text-xl text-white">
                DAO Contract: 0x6338d15778C06Fa77042A635Fceb32e4a6Ee9dA7
              </p>
              <div className="modal-action mt-8 flex justify-center">
                <form method="dialog" className="flex items-center space-x-6">
                  <button className="btn btn-primary" onClick={stake_function}>
                    Stake 50 HBAR
                  </button>
                  <button className="btn">Close</button>
                </form>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-bold text-lg text-center mb-8 text-white">
                Access Course Contents Here
              </h3>
              <p className="py-2 text-xl text-center text-blue-500 underline">
                <a
                  href="https://hashscan.io/testnet/contract/0.0.5282523?pf=1&p=1&k=1734563726.031953311"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Hashscan
                </a>
              </p>
              <div className="modal-action mt-8 flex justify-center">
                <button className="btn btn-success">
                  Finish Test by Taking Test
                </button>
              </div>
            </>
          )}
          {transactionStatus && (
            <p className="text-center mt-4">{transactionStatus}</p>
          )}
          {txHash && (
            <p className="text-center mt-2">Tx Hash: {txHash}</p>
          )}
        </div>
      </dialog>
    </div>
  );
}
