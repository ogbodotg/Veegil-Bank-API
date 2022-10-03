const transaction = require("../models/transactions");
const User = require("../models/users.js");

const mongoose = require("mongoose"),
  Transaction = mongoose.model("transaction"),
  session = mongoose.startSession;

exports.find_user_byId = function (req, res) {
  User.findById(req.params.Id, function (err, user) {
    if (err) res.status(404).send("User Does not exist in the database");
    res.json(user);
  });
};

exports.get_all_transaction_history = async function (req, res) {
  const transaction = await Transaction.find({});
  res.status(200).json({ transaction, count: transaction.length });
};

exports.get_transaction_history = function (req, res) {
  Transaction.find(
    { phoneNumber: req.params.phoneNumber },
    function (err, transaction) {
      if (err)
        res
          .status(404)
          .send(`User with phone number ${phoneNumber} does not exist`);
      res.json({ transaction, count: transaction.length });
    }
  );
};

exports.get_sender_transaction_history = function (req, res) {
  Transaction.find(
    { sender: req.params.phoneNumber },
    function (err, transaction) {
      if (err)
        res.status(404).send(`User with phone number ${sender} does not exist`);
      res.json(transaction);
    }
  );
};

exports.transfer_money = async function (req, res) {
  try {
    const { phoneNumber, sender, transactionAmount } = req.body;
    if (!(phoneNumber && sender && transactionAmount)) {
      res.status(400).send("All input are required");
    }

    let beneficiary = await User.findOne({ phoneNumber });
    if (beneficiary === null) {
      res.status(400).send("User with this phone number does not exist");
    }

    let currentUser = await User.findOne({ phoneNumber: sender });
    if (transactionAmount > currentUser.balance && transactionAmount > 0) {
      res
        .status(400)
        .send("You do not have sufficient funds to make this transfer");
    }
    if (currentUser.phoneNumber === beneficiary.phoneNumber) {
      res
        .status(400)
        .send("Sorry you are not allowed to make transfers to yourself");
    }

    if (currentUser.phoneNumber !== beneficiary.phoneNumber) {
      beneficiary.balance = beneficiary.balance + transactionAmount;
      currentUser.balance = currentUser.balance - transactionAmount;
      let transactionDetails = {
        transactionType: "Transfer",
        phoneNumber: phoneNumber,
        sender: currentUser.phoneNumber,
        transactionAmount: transactionAmount,
      };
      await beneficiary.save();
      await currentUser.save();
      await Transaction.create(transactionDetails);

      res
        .status(200)
        .send(
          `Transfer of ${transactionAmount} to ${phoneNumber} was successful`
        );
    }
  } catch (err) {
    res.json({ message: err });
  }
};

exports.withdraw_money = async function (req, res) {
  try {
    const { transactionAmount, phoneNumber } = req.body;
    if (!transactionAmount) {
      res.status(400).send("Please input the amount you'd like to withdraw");
    }
    // let currentUser = await User.findById(req.user.user_id);
    let currentUser = await User.findOne({ phoneNumber });

    if (transactionAmount > currentUser.balance) {
      res
        .status(400)
        .send("You do not have sufficient funds to make this withdrawal");
    }
    currentUser.balance = currentUser.balance - transactionAmount;
    let transactionDetails = {
      transactionType: "Withdraw",
      phoneNumber: currentUser.phoneNumber,
      transactionAmount: transactionAmount,
    };
    await currentUser.save();
    await Transaction.create(transactionDetails);
    res.status(200).send(`Withdrawal of ${transactionAmount} was successful`);
  } catch (e) {
    res.json({ message: e });
  }
};
