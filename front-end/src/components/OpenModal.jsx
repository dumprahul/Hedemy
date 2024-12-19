import React, { useState } from "react";
import axios from "axios";
import { connectWallet } from "../";
import { ethers } from "ethers";
import HedemyDAO from "../abi/Hedemy_DAO_abi.json"; // Import your contract ABI

export default function OpenModal() {
  const { ethereum } = window;
  const [courseName, setCourseName] = useState('');
  const [courseDetails, setCourseDetails] = useState('');
  const [courseFee, setCourseFee] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [ipfsLink, setIpfsLink] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(null);

  const [transactionStatus, setTransactionStatus] = useState("");
  const [txHash, setTxHash] = useState("");
  


  const contract_address="0xE814b3047c05EFCa5428B854bc6BB71f5bA9BFD3";
  const contract_abi=HedemyDAO.abi;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToIPFS = async () => {
    if (!file) {
      alert("Please select a file to upload!");
      return;
    }

    setUploadStatus("Uploading...");

    const PINATA_API_KEY = "86246e280b8cbf709918";
    const PINATA_API_SECRET = "acb24c100054544eb8f3a11f417cf3f2a8cfb438bed6cb321416e1aa926f26ab";

    try {
      const formData = new FormData();
      formData.append("file", file);

      const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
        },
      });

      const ipfsHash = res.data.IpfsHash;
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

      setUploadStatus("File Uploaded Successfully!");
      setIpfsLink(ipfsUrl);
    } catch (error) {
      console.error("Error uploading file: ", error);
      setUploadStatus("Upload failed. Please try again.");
    }
  };

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

  const send_proposal = async() => {
    if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contract_address, contract_abi, signer);
  
        // console.log("Check the params before passing to contract");
        // console.log(`course name is ${courseName}and the ipfs link is ${ipfsLink}`);
        const tx = await contract.proposeCourse(courseName,ipfsLink);
        setTransactionStatus("Transaction in progress...");
        await tx.wait();
        setTransactionStatus("Transaction successful");
        setTxHash(tx.hash);
        console.log("Transaction details:", tx);


        const count = await contract.proposalCount();
        console.log("Proposal Count:", count.toString());

        // const vote= await contract.voteOnProposal(8,"true");
        // await vote.wait();
        // console.log("the vote",vote);
        // console.log("the vote has",vote.hash);

        // const get_proposals= await contract.voteOnProposal(8);
        // await get_proposals.wait();
        // console.log("proposal details",get_proposals);

        // const finalize_proposal= await contract.finalizeProposal(8);
        // await finalize_proposal.wait();
        // console.log("proposal details",finalize_proposal);


      } catch (error) {
        console.error("Error on send proposal", error);
        setTransactionStatus("Transaction failed.");
      }
  }

  

  const handlePropose = async () => {
    await send_proposal();

  };
  

  const isUploadButtonDisabled = !courseName || !courseDetails || !courseFee || !file;
  const isProposeButtonDisabled = uploadStatus !== "File Uploaded Successfully!" || !walletConnected;

  return (
    <div>
      <button className="btn btn-active btn-neutral px-6 py-2 text-white" onClick={() => document.getElementById('my_modal_4').showModal()}>
        Propose a Course🎉
      </button>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg text-white">Propose the Course</h3>
          <form onSubmit={(e) => { e.preventDefault(); handlePropose(); }}>
            {/* Course Details */}
            <div className="mb-4">
              <label htmlFor="courseName" className="block text-sm font-medium text-white">Enter the Course Name</label>
              <input
                type="text"
                id="courseName"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="courseDetails" className="block text-sm font-medium text-white">Enter the Course Details</label>
              <textarea
                id="courseDetails"
                value={courseDetails}
                onChange={(e) => setCourseDetails(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="courseFee" className="block text-sm font-medium text-white">Enter the Course Fee in HBAR</label>
              <input
                type="number"
                id="courseFee"
                value={courseFee}
                onChange={(e) => setCourseFee(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label htmlFor="courseFile" className="block text-sm font-medium text-white">Upload File</label>
              <input
                type="file"
                id="courseFile"
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
            </div>

            {/* Upload to IPFS */}
            {file && !uploadStatus && (
              <button
                type="button"
                className="btn btn-neutral mt-2"
                onClick={uploadToIPFS}
                disabled={isUploadButtonDisabled}
              >
                Upload to IPFS 🔗
              </button>
            )}

            {uploadStatus === "File Uploaded Successfully!" && ipfsLink && (
              <a
                href={ipfsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success mt-2"
              >
                The content is successfully uploaded in IPFS 🧿
              </a>
            )}
            {/* Connect Wallet */}
            {!walletConnected ? (
              <button
                type="button"
                className="btn btn-info mt-2"
                onClick={connect_wallet}
              >
                Connect Wallet 🔗
              </button>
            ) : (
              <button className="btn btn-outline btn-primary">Wallet Connected: {walletAddress} ✅</button>
            )}

            {/* Propose on DAO */}
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-neutral"
                onClick={handlePropose}
                disabled={isUploadButtonDisabled}
                
              >
                Propose DAO 🎉
              </button>
              <button type="button" className="btn" onClick={() => document.getElementById('my_modal_4').close()}>Close</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
