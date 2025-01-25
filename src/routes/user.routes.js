// routes/user.routes.js
const express = require("express");
const router = express.Router();
const { getAuthorPage } = require("../controllers/user.controller");

router.get("/:id", getAuthorPage);

module.exports = router;
