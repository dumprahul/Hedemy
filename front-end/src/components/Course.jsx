import React, { useState } from "react";
import bg_img from '../img/bg.jpg';
import HedemyDAO from "../abi/Hedemy_DAO_abi.json";
import { ethers } from "ethers";

function Course() {
  const { ethereum } = window;
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [proposalCount, setProposalCount] = useState(null);
  const [proposalId, setProposalId] = useState("");
  const [voteOption, setVoteOption] = useState("");
  const [isVoteEnabled, setIsVoteEnabled] = useState(false);

  const contract_address = "0x6338d15778C06Fa77042A635Fceb32e4a6Ee9dA7";
  const contract_abi = HedemyDAO.abi;

  const connect_wallet = async () => {
    if (!ethereum) {
      alert("MetaMask is not installed!");
      return;
    }
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setWalletConnected(true);
      setWalletAddress(accounts[0]);
      console.log("Connected account:", accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const totalproposal = async () => {
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contract_address, contract_abi, signer);
      const count = await contract.proposalCount();
      console.log("Proposal Count:", count.toString());
      setProposalCount(count.toString());
    } catch (error) {
      console.error("Error fetching total proposals:", error);
      setProposalCount("Error fetching data");
    }
  };

  const vote_proposal = async () => {
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contract_address, contract_abi, signer);

      console.log("The proposal id is ",proposalId);
      console.log("The option value is ",voteOption)
      const vote = await contract.voteOnProposal(proposalId, voteOption);
      await vote.wait();
      console.log("The vote:", vote);
      console.log("The vote has:", vote.hash);
    } catch (error) {
      console.log("The error while voting-", error);
    }
  };

  const handleProposalIdChange = (e) => {
    const id = e.target.value;
    setProposalId(id);
    setIsVoteEnabled(id && voteOption);
  };

  const handleVoteOptionChange = (e) => {
    const option = e.target.value;
    setVoteOption(option);
    setIsVoteEnabled(proposalId && option);
  };

  return (
    <div>
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{
          backgroundImage: `url(${bg_img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-5xl font-bold mb-4 text-white">
          Cast your votes to approve the courses.
        </h1>
        <p className="text-lg text-center mb-6 px-2 text-white font-bold">
          Only the DAO Members can vote. Connect Wallet to see your eligibility in the DAO.
        </p>
        {!walletConnected ? (
          <button
            className="btn btn-active btn-neutral px-6 py-2 text-white"
            onClick={connect_wallet}
          >
            Check Your Eligibility
          </button>
        ) : (
          <div className="flex space-x-4">
            <button
              className="btn btn-active btn-neutral px-6 py-2 text-white"
              onClick={() => document.getElementById('vote_modal').showModal()}
            >
              Vote
            </button>
            <button
              className="btn btn-active btn-neutral px-6 py-2 text-white"
              onClick={() => {
                totalproposal();
                document.getElementById('proposal_modal').showModal();
              }}
            >
              Total Proposals
            </button>
            <button className="btn btn-active btn-neutral px-6 py-2 text-white">
              Finalize the Proposal
            </button>
          </div>
        )}
      </div>

      {/* Vote Modal */}
        <dialog id="vote_modal" className="modal">
        <div className="modal-box">
            <h3 className="font-bold text-lg text-white">Vote</h3>
            <p className="py-4 text-white">Cast your vote on a proposal. Enter the ProposalID:</p>
            <input
            type="text"
            placeholder="Enter Proposal ID"
            className="input input-bordered w-full mb-4"
            value={proposalId}
            onChange={handleProposalIdChange}
            />
            <h4 className="font-bold text-md mb-2 text-white">Choose your vote below:</h4>
            <div className="flex flex-col space-y-2 mb-4">
            <label className="cursor-pointer">
                <input
                type="radio"
                name="voteOption"
                value="true"
                className="radio"
                onChange={handleVoteOptionChange}
                /> Approve Course
            </label>
            <label className="cursor-pointer">
                <input
                type="radio"
                name="voteOption"
                value="false"
                className="radio"
                onChange={handleVoteOptionChange}
                /> Reject Course
            </label>
            </div>
            <button
            className="btn btn-outline btn-primary w-full text-sm"
            disabled={!isVoteEnabled}
            onClick={vote_proposal}
            >
            Vote Now
            </button>
            <div className="modal-action">
            <form method="dialog">
                <button className="btn">Close</button>
            </form>
            </div>
        </div>
        </dialog>


      {/* Total Proposals Modal */}
      <dialog id="proposal_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Total Proposals</h3>
          <p className="py-4">
            {proposalCount === null
              ? "Fetching the total number of proposals..."
              : `The total number of proposals passed in Hedemy DAO are ${proposalCount}.`}
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Course;
