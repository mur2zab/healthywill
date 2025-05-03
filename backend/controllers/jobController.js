const JobRequest = require("../models/JobRequests");

const createJob = async (req, res) => {
  try {
    const { patientName, address } = req.body;

    if (!patientName || !address) {
      return res.status(400).json({ message: "Patient name and address are required" });
    }

    const newJob = new JobRequest({
      patientName,
      address,
      createdBy: req.user.id, // from verifyToken
    });

    await newJob.save();
    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
  res.status(500).json({ message: "Server error", error: error.message });
}
};

module.exports = { createJob };
