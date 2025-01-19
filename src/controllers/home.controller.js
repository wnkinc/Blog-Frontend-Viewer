// /controller/home.controller.js

const getHomepage = async (req, res, next) => {
  try {
    // Example: Fetch data from an API or database (placeholder logic)
    const posts = []; // Replace this with an actual API call or DB query

    res.render("home", {
      title: "Homepage",
      description: "Welcome to the Blog Viewer!",
      posts, // Pass the fetched posts to the template
    });
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching homepage data:", error);
    next(error); // Pass error to the global error handler
  }
};

module.exports = {
  getHomepage,
};
