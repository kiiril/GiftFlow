const express = require("express");
const {updateUser, getUser} = require("../controllers/userController");
const isAuthenticated = require("../middleware/auth");
const router = express.Router();

router.get("/me", isAuthenticated, getUser);

router.put("/me", isAuthenticated, updateUser);

module.exports = router;