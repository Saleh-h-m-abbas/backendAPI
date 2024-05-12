const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    studyUID: String,
    content: String,
    status: {
      type: String,
      enum: ["new", "completed", "verified"],
      default: "new",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: String,
    patientID: String,
    patientName: String,
  },
  { index: true, unique: true },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
