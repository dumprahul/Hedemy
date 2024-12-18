import React, { useState } from "react";
import axios from "axios";

const UploadToIPFS = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [ipfsLink, setIpfsLink] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file to Pinata
  const uploadToIPFS = async () => {
    if (!file) {
      alert("Please select a file to upload!");
      return;
    }

    setUploadStatus("Uploading...");

    // Pinata API keys
    const PINATA_API_KEY = "86246e280b8cbf709918";
    const PINATA_API_SECRET = "acb24c100054544eb8f3a11f417cf3f2a8cfb438bed6cb321416e1aa926f26ab";

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Pinata API URL
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Upload File to IPFS via Pinata</h1>

      {/* File Input */}
      <input
        type="file"
        onChange={handleFileChange}
        className="p-2 border border-gray-300 rounded mb-4"
      />

      {/* Upload Button */}
      <button
        onClick={uploadToIPFS}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Upload to IPFS
      </button>

      {/* Upload Status */}
      {uploadStatus && <p className="mt-4 text-gray-700">{uploadStatus}</p>}

      {/* IPFS Link */}
      {ipfsLink && (
        <p className="mt-4 text-green-600">
          File Link:{" "}
          <a
            href={ipfsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {ipfsLink}
          </a>
        </p>
      )}
    </div>
  );
};

export default UploadToIPFS;
