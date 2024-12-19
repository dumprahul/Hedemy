import React, { useState } from "react";
import { ethers } from "ethers";
import Stake from "../abi/Hedemy_Stake_abi.json";

export default function StakeOpenModal() {
  const [amount, setAmount] = useState("50"); // Fixed amount of HBAR to send
  const [transactionStatus, setTransactionStatus] = useState("");
  const [txHash, setTxHash] = useState("");
  const [stakeSuccess, setStakeSuccess] = useState(false); // Tracks if stake was successful
  const [showQuiz, setShowQuiz] = useState(false); // Tracks if quiz should be shown
  const [quizAnswers, setQuizAnswers] = useState([]); // Stores answers to quiz questions

  const { ethereum } = window;
  const contract_address = "0xE8BDC8AFaCb5219aAB50C567dacE2aA4D0a71f5d";
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


  const return_stake = async () => {
    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contract_address, contract_abi, signer);

      const returnstake = await contract.return_stake();
      setTransactionStatus("Transaction in progress...");
      await returnstake.wait();
      setTransactionStatus("Transaction successful");
      setTxHash(returnstake.hash);
      console.log("Transaction details:", returnstake);
    } catch (error) {
      console.error("Error while returning stake", error);
    }
  };

  const handleQuizAnswer = (questionIndex, answer) => {
    const updatedAnswers = [...quizAnswers];
    updatedAnswers[questionIndex] = answer;
    setQuizAnswers(updatedAnswers);
  };

  const handleFinishTest = () => {
    setShowQuiz(true); // Show quiz
  };

  const handleFinishCourse = () => {
    return_stake(); // Call return_stake on finishing course
  };

  const quizQuestions = [
    {
      question: "What is Hedera Hashgraph primarily known for?",
      options: ["Blockchain alternative", "Search engine"],
    },
    {
      question: "Which token is native to the Hedera Hashgraph network?",
      options: ["HBAR", "ETH"],
    },
    {
      question: "Hedera Hashgraph uses which consensus algorithm?",
      options: ["Asynchronous Byzantine Fault Tolerance (aBFT)", "Proof of Work (PoW)"],
    },
    {
      question: "What is the main advantage of Hedera over traditional blockchains?",
      options: ["Higher throughput and low latency", "Expensive transaction fees"],
    },
  ];

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
              <div className="modal-action mt-8 flex justify-center">
                <form method="dialog" className="flex items-center space-x-6">
                  <button className="btn btn-primary" onClick={stake_function}>
                    Stake 50 HBAR
                  </button>
                  <button className="btn">Close</button>
                </form>
              </div>
            </>
          ) : showQuiz ? (
            <>
              <h3 className="font-bold text-lg text-center mb-8 text-white">
                Quiz
              </h3>
              {quizQuestions.map((q, index) => (
  <div key={index} className="mb-6 flex flex-col items-start">
    <p className="text-xl text-white mb-4">{q.question}</p>
    <div className="flex flex-col space-y-2">
      {q.options.map((option, optionIndex) => (
        <label key={optionIndex} className="flex items-center space-x-2">
          <input
            type="radio"
            name={`question-${index}`}
            value={option}
            onChange={() => handleQuizAnswer(index, option)}
            className="radio radio-primary"
          />
          <span className="text-white">{option}</span>
        </label>
      ))}
    </div>
  </div>
))}

              {quizAnswers.length === quizQuestions.length && (
                <div className="modal-action mt-8 flex justify-center">
                  <button
                    className="btn btn-success"
                    onClick={handleFinishCourse}
                  >
                    Finish the Course
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="font-bold text-lg text-center mb-8 text-white">
                Access Course Contents Here
              </h3>
              <p className="py-2 text-xl text-center text-blue-500 underline">
                <a
                  href="https://gateway.pinata.cloud/ipfs/QmWk44a2v4B1VJ9Fx19hyyFABD5DDer3ZzYjmevPyP3iid"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View the full course content on IPFS
                </a>
              </p>
              <div className="modal-action mt-8 flex justify-center">
                <button
                  className="btn btn-success"
                  onClick={handleFinishTest}
                >
                  Finish Test by Taking Test
                </button>
              </div>
            </>
          )}
          {transactionStatus && (
            <p className="text-center mt-4">{transactionStatus}</p>
          )}
          {txHash && <p className="text-center mt-2">Tx Hash: {txHash}</p>}
        </div>
      </dialog>
    </div>
  );
}
