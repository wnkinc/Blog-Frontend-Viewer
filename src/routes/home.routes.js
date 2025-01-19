// routes/home.routes.js
const express = require("express");
const router = express.Router();
const {
  getHomepage,
  getPostBySlug,
} = require("../controllers/home.controller");

router.get("/", getHomepage);
router.get("/:slug", getPostBySlug);

module.exports = router;
