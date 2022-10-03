const usersController = require("../controllers/users.js");
const transactionController = require("../controllers/transactions.js");

const express = require("express");
const router = express.Router();

router.post("/auth/signup", usersController.signup);
router.post("/auth/login", usersController.login);
router.get("/auth/users", usersController.get_users);
router.post("/accounts/transfer", transactionController.transfer_money);
router.post("/accounts/withdraw", transactionController.withdraw_money);
router.get(
  "/accounts/transactions/:phoneNumber",
  transactionController.get_transaction_history
);
router.get(
  "/accounts/transactions",
  transactionController.get_all_transaction_history
);

router.get("/auth/user-Profile/:phoneNumber", usersController.userProfile);

module.exports = router;
