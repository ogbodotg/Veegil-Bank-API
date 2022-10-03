const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionType: { type: String, enum: ["Withdraw", "Transfer"] },
  phoneNumber: { type: String, required: "Recipient Phone Number is required" },
  sender: { type: String },
  transactionAmount: {
    type: Number,
    required: "please enter a transaction amount",
  },
  transactionTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("transaction", transactionSchema);
