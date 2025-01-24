// routes/post.routes.js
const express = require("express");
const router = express.Router();
const { getPostBySlug } = require("../controllers/post.controller");

router.get("/:slug", getPostBySlug);

module.exports = router;
