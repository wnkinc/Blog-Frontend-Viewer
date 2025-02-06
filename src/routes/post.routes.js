// routes/post.routes.js
const express = require("express");
const router = express.Router();
const {
  getPostBySlug,
  postComment,
} = require("../controllers/post.controller");

router.get("/:slug", getPostBySlug);
router.post("/:slug/comment", postComment);

module.exports = router;
