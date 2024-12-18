import React, { useState } from "react";
import axios from "axios";
import { connectWallet } from "../components/ConnectWallet";
import { ethers } from "ethers";
import HedemyDAO from "../contracts/HedemyDAO.json"; // Import your contract ABI

export default function OpenModal() {
  const [courseName, setCourseName] = useState('');
  const [courseDetails, setCourseDetails] = useState('');
  const [courseFee, setCourseFee] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [ipfsLink, setIpfsLink] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(null);

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

  const handleWalletConnection = async () => {
    const account = await connectWallet();
    if (account) {
      setWalletAddress(account);

      // Set up the Ether.js provider and contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const deployedNetwork = HedemyDAO.networks[await provider.getNetwork().then(n => n.chainId)];
      const contractInstance = new ethers.Contract(deployedNetwork.address, HedemyDAO.abi, signer);

      setContract(contractInstance);
      setWalletConnected(true);
    }
  };

  const handlePropose = async () => {
    try {
      if (!contract) {
        alert("Contract not initialized!");
        return;
      }

      const tx = await contract.proposeCourse(courseName, ipfsLink, {
        from: walletAddress
      });

      await tx.wait(); // Wait for the transaction to be mined
      alert("Course proposed successfully!");
    } catch (error) {
      console.error("Error proposing course: ", error);
      alert("An error occurred while proposing the course.");
    }
  };

  const isUploadButtonDisabled = !courseName || !courseDetails || !courseFee || !file;
  const isProposeButtonDisabled = uploadStatus !== "File Uploaded Successfully!" || !walletConnected;

  return (
    <div>
      <button className="btn btn-active btn-neutral px-6 py-2 text-white" onClick={() => document.getElementById('my_modal_4').showModal()}>
        Propose a Course
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
              <label htmlFor="courseFee" className="block text-sm font-medium text-white">Enter the Course Fee</label>
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
                Upload to IPFS
              </button>
            )}

            {uploadStatus === "File Uploaded Successfully!" && ipfsLink && (
              <a
                href={ipfsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success mt-2"
              >
                The content is successfully uploaded in IPFS
              </a>
            )}

            {/* Connect Wallet */}
            {!walletConnected && (
              <button
                type="button"
                className="btn btn-info mt-2"
                onClick={handleWalletConnection}
              >
                Connect Wallet
              </button>
            )}
            {walletConnected && (
              <button className="btn btn-outline btn-primary">Wallet Connected: {walletAddress}</button>
            )}

            {/* Propose on DAO */}
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-neutral"
                onClick={handlePropose}
                disabled={isProposeButtonDisabled}
              >
                Propose DAO
              </button>
              <button type="button" className="btn" onClick={() => document.getElementById('my_modal_4').close()}>Close</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
