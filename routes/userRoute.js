const express = require("express");

const {
  registerUser,
  loginUser,
  getUserDetails,
  getAllUsers,
  getSingleUser,
  deleteUser,
  
} = require("../controllers/userController");

const { authorizeRoles, isAuthenticatedUser}  = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/me").get(isAuthenticatedUser, authorizeRoles("admin", "user"), getUserDetails);

router.route("/users").get( isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

router.route("/users/:id")
.get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)

module.exports = router;