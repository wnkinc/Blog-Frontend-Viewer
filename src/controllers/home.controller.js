// controllers/home.controller.js
const axios = require("axios");

/**
 * -------------- GET posts ----------------
 */
const getHomepage = async (req, res, next) => {
  try {
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/posts`; // Ensure this is in your .env file
    const response = await axios.get(apiUrl, {
      params: {
        page: 1, // First page
        pageSize: 10, // Limit posts to 10
      },
    });

    const { posts, meta } = response.data;

    // Render the homepage with posts and metadata
    res.render("home", {
      title: "Homepage",
      description: "Welcome to the Blog Viewer!",
      posts,
      meta,
    });
  } catch (error) {
    console.error("Error fetching posts for homepage:", error);
    next(error); // Forward to error handling middleware
  }
};

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

    // Render the post view with the post data
    res.render("post", {
      title: post.title,
      post,
    });
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    next(error); // Forward to error handling middleware
  }
};

module.exports = {
  getHomepage,
  getPostBySlug,
};
