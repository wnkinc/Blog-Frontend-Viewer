// controllers/post.controller.js
const axios = require("axios");

/**
 * -------------- GET post ----------------
 */
const getPostBySlug = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/posts/${slug}`;
    const response = await axios.get(apiUrl);
    const { post } = response.data;

    if (!post) {
      return res.status(404).render("404", { title: "Post Not Found" });
    }

    const comments = post.comments || []; // Ensure comments are included

    // Ensure replies are properly structured within comments
    comments.forEach((comment) => {
      comment.replies = comment.replies || []; // Ensure replies exist
    });

    // Render the post view with the post data
    res.render("newpost", {
      pageTitle: post.title,
      post,
      comments, // Now includes replies
    });
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    next(error); // Forward to error handling middleware
  }
};

/**
 * -------------- POST comment ----------------
 */
const postComment = async (req, res, next) => {};

module.exports = {
  getPostBySlug,
  postComment,
};
