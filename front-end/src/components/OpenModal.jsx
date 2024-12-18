import React, { useState } from 'react';
import axios from "axios";

export default function OpenModal() {
  const [courseName, setCourseName] = useState('');
  const [courseDetails, setCourseDetails] = useState('');
  const [courseFee, setCourseFee] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [ipfsLink, setIpfsLink] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle the proposal submission logic here, such as interacting with the DAO.
    console.log({ courseName, courseDetails, courseFee, file });
  };

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
      console.log("The file has been uploaded to IPFS -", ipfsUrl);

      setUploadStatus("File Uploaded Successfully!");
      setIpfsLink(ipfsUrl);
    } catch (error) {
      console.error("Error uploading file: ", error);
      setUploadStatus("Upload failed. Please try again.");
    }
  };

  // Check if the "Upload to IPFS" button should be enabled
  const isUploadButtonDisabled = !courseName || !courseDetails || !courseFee || !file;

  // Check if the "Propose on DAO" button should be enabled
  const isProposeButtonDisabled = uploadStatus !== "File Uploaded Successfully!";

  return (
    <div>
      <button className="btn btn-active btn-neutral px-6 py-2 text-white" onClick={() => document.getElementById('my_modal_4').showModal()}>
        Propose a Course
      </button>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg text-white">Propose the Course</h3>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label htmlFor="courseName" className="block text-sm font-medium text-white">Enter the Course Name</label>
              <input
                type="text"
                id="courseName"
                name="courseName"
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
                name="courseDetails"
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
                name="courseFee"
                value={courseFee}
                onChange={(e) => setCourseFee(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="courseFile" className="block text-sm font-medium text-white">Upload File</label>
              <input
                type="file"
                id="courseFile"
                name="courseFile"
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
            </div>

            {/* Conditionally render "Upload to IPFS" button */}
            {file && !uploadStatus && (
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  className="btn btn-neutral"
                  onClick={uploadToIPFS}
                  disabled={isUploadButtonDisabled} // Disable if fields are not filled or no file selected
                >
                  Upload to IPFS
                </button>
              </div>
            )}

            {/* Show the upload success message and the link button */}
            {uploadStatus === "File Uploaded Successfully!" && ipfsLink && (
              <div className="mb-4 flex justify-end">
                <a
                  href={ipfsLink} // Link to the uploaded IPFS content
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success"
                >
                  The content is successfully uploaded in IPFS
                </a>
              </div>
            )}

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-neutral"
                disabled={isProposeButtonDisabled} // Disable if file is not uploaded successfully
              >
                Propose on DAO
              </button>
              <button type="button" className="btn" onClick={() => document.getElementById('my_modal_4').close()}>Close</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
