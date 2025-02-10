document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".filter-tab");
  const postsContainer = document.querySelector(".feed");
  const posts = Array.from(document.querySelectorAll(".feed-post"));

  // Function to filter and display posts
  function filterPosts(filterType, value = null) {
    let sortedPosts = [...posts];

    if (filterType === "relevant") {
      // Filter only posts by "wesleyklaassen"
      sortedPosts = sortedPosts.filter(
        (post) => post.getAttribute("data-author") === "wesleynklaassen"
      );
    } else if (filterType === "latest") {
      // Sort by date (most recent first)
      sortedPosts.sort(
        (a, b) =>
          new Date(b.getAttribute("data-date")) -
          new Date(a.getAttribute("data-date"))
      );
    } else if (filterType === "top") {
      // Sort by reactions count (highest first)
      sortedPosts.sort(
        (a, b) =>
          Number(b.getAttribute("data-reactions")) -
          Number(a.getAttribute("data-reactions"))
      );
    } else if (filterType === "author" && value) {
      // Filter posts by a specific author
      sortedPosts = sortedPosts.filter(
        (post) => post.getAttribute("data-author") === value
      );
    }

    // Clear the container and re-add sorted posts
    postsContainer.innerHTML = "";
    sortedPosts.forEach((post) => postsContainer.appendChild(post));
  }

  // Tab click event listener
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");
      filterPosts(filter);
    });
  });

  // Add event listeners for author name buttons
  document.querySelectorAll(".author-name button").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent navigation

      const author = this.getAttribute("data-author");
      filterPosts("author", author);
    });
  });
});
