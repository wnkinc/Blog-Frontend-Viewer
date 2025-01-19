// controllers/user.controller.js
const axios = require("axios");

/**
 * -------------- GET author/posts ----------------
 */
const getAuthorPage = async (req, res, next) => {
  const { id } = req.params;

  try {
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/users/${id}/posts`;
    const response = await axios.get(apiUrl);

    if (!response.data.success) {
      return res.status(404).render("404", { title: "User Not Found" });
    }

    const posts = response.data.data;

    if (!posts.length) {
      return res.render("author", {
        title: "No Posts Found",
        authorId: id,
        posts: [],
        message: "This user has not published any posts yet.",
      });
    }

    // Extract author details from the first post (assuming all posts share the same author)
    const author = posts[0].author;

    // Render the author page with user details and posts
    res.render("author", {
      title: `Posts by ${author.username}`,
      author,
      posts,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    next(error); // Forward to the global error handler
  }
};

module.exports = {
  getAuthorPage,
};
