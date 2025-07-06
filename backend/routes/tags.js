const express = require("express");
const router = express.Router();
const {getAllTags} = require("../controllers/tagController");

router.get("/", getAllTags);

module.exports = router;