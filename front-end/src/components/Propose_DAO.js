const express = require("express");
const { ethers } = require("ethers");
const Hedemy_DAO_abi = require('../abi/Hedemy_DAO_abi.json');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const courseSchema = new mongoose.Schema({
  proposalId: Number,
  courseDetails: String,
  coursePrice: Number,
});

const Course = mongoose.model("Course", courseSchema);

// Smart contract details
const contractAddress = "0x6338d15778C06Fa77042A635Fceb32e4a6Ee9dA7";
const contractABI =  Hedemy_DAO_abi.abi;

const provider = new ethers.providers.JsonRpcProvider(process.env.HEDERA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// API route to propose a course
app.post("/proposeCourse", async (req, res) => {
  try {
    const { courseName, courseIPFSHash, courseDetails, coursePrice } = req.body;

    if (!courseName || !courseIPFSHash || !courseDetails || !coursePrice) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Interact with the contract to propose the course
    const tx = await contract.proposeCourse(courseName, courseIPFSHash);
    const receipt = await tx.wait();

    // Extract the proposal ID from the event logs
    const event = receipt.events.find((e) => e.event === "ProposalCreated");
    if (!event) {
      return res.status(500).json({ error: "Event not found in transaction receipt" });
    }

    const { id: proposalId } = event.args;

    // Store additional course details in MongoDB
    const newCourse = new Course({
      proposalId: proposalId.toNumber(),
      courseDetails,
      coursePrice,
    });

    await newCourse.save();

    res.status(200).json({
      message: "Course proposal submitted successfully",
      proposalId: proposalId.toNumber(),
    });
  } catch (error) {
    console.error("Error in proposeCourse:", error);
    res.status(500).json({ error: "Failed to propose course" });
  }
});

// API route to fetch course details from MongoDB
app.get("/courseDetails/:proposalId", async (req, res) => {
  try {
    const { proposalId } = req.params;
    const course = await Course.findOne({ proposalId: parseInt(proposalId) });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error in fetching course details:", error);
    res.status(500).json({ error: "Failed to fetch course details" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
