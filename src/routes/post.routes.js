// routes/post.routes.js
const express = require("express");
const router = express.Router();
const {
  getPostBySlug,
  postComment,
  postReply,
  postReactions,
} = require("../controllers/post.controller");

router.get("/:slug", getPostBySlug);
router.post("/:slug/comment", postComment);
router.post("/:slug/reply", postReply);
router.post("/reactions", postReactions);

module.exports = router;
