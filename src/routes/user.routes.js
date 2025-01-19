// routes/user.routes.js
const express = require("express");
const router = express.Router();
const { getAuthorPage } = require("../controllers/user.controller");

// Route: Author page (posts by a specific author)
router.get("/:id", getAuthorPage);

module.exports = router;
