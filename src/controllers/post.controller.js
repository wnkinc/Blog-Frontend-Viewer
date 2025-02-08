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
    const { post, reactions } = response.data; // Backend already formats reactions

    if (!post) {
      return res.status(404).render("404", { title: "Post Not Found" });
    }

    // Filter out top-level comments
    const topLevelComments = post.comments.filter(
      (comment) => !comment.parentId
    );

    // Ensure replies are attached correctly
    topLevelComments.forEach((comment) => {
      comment.replies = post.comments.filter(
        (reply) => reply.parentId === comment.id
      );
    });

    // Render the post view with the post data & reactions
    res.render("newpost", {
      pageTitle: post.title,
      post,
      comments: topLevelComments, // Now includes replies
      reactions, // No need for manual defaults, backend handles this
    });
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    next(error); // Forward to error handling middleware
  }
};

/**
 * -------------- POST comment ----------------
 */
const postComment = async (req, res, next) => {
  const { slug } = req.params; // Get post slug from URL
  const { comment } = req.body; // Get comment content from form

  try {
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/comments/${slug}`;

    // Send data to backend API
    await axios.post(apiUrl, {
      content: comment, // Comment text
    });

    // Redirect back to the post page @ comments
    res.redirect(`/post/${slug}#comments`);
  } catch (error) {
    console.error("Error posting comment:", error);
    next(error); // Forward to error handling middleware
  }
};

/**
 * -------------- POST reply ----------------
 */
const postReply = async (req, res, next) => {
  const { slug } = req.params; // Get post slug from URL
  const { reply, commentId } = req.body; // Get reply content and comment ID from form

  try {
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/comments/${slug}/reply`;

    // Send data to backend API
    await axios.post(apiUrl, {
      content: reply, // Reply text
      commentId, // ID of the comment being replied to
    });

    // Redirect back to the post page @ replies section
    res.redirect(`/post/${slug}#comments`);
  } catch (error) {
    console.error("Error posting reply:", error);
    next(error); // Forward to error handling middleware
  }
};

/**
 * -------------- POST reactions FRONTEND ----------------
 */
const postReactions = async (req, res, next) => {
  try {
    const { allSelections } = req.body;
    console.log("Received multiple reactions:", allSelections);
    // forward to your backend server:
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/posts/reactions`;
    const response = await axios.post(apiUrl, { allSelections });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error posting multiple reactions:", error);
    next(error);
  }
};

module.exports = {
  getPostBySlug,
  postComment,
  postReply,
  postReactions,
};
