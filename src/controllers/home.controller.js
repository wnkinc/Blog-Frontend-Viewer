const axios = require("axios");

// Controller: Logic for rendering the homepage
const getHomepage = async (req, res, next) => {
  try {
    // Make API call to fetch posts
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/posts`; // Ensure this is in your .env file
    const response = await axios.get(apiUrl, {
      params: {
        page: 1, // First page
        pageSize: 10, // Limit posts to 10
      },
    });

    // Extract posts and metadata from API response
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

module.exports = {
  getHomepage,
};
