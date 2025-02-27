document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".filter-tab");
  const postsContainer = document.querySelector(".feed");
  const posts = Array.from(document.querySelectorAll(".feed-post"));

  // Function to sort posts while keeping them all visible
  function sortPosts(sortType, value = null) {
    let sortedPosts = [...posts];

    if (sortType === "relevant") {
      // Move "wesleyklaassen" posts to the top but keep others
      sortedPosts.sort((a, b) => {
        const isARelevant = a.getAttribute("data-author") === "wk";
        const isBRelevant = b.getAttribute("data-author") === "wk";
        return isBRelevant - isARelevant; // Sort relevant ones first
      });
    } else if (sortType === "latest") {
      // Sort by date (most recent first)
      sortedPosts.sort(
        (a, b) =>
          new Date(b.getAttribute("data-date")) -
          new Date(a.getAttribute("data-date"))
      );
    } else if (sortType === "top") {
      // Sort by reactions count (highest first)
      sortedPosts.sort(
        (a, b) =>
          Number(b.getAttribute("data-reactions")) -
          Number(a.getAttribute("data-reactions"))
      );
    } else if (sortType === "author" && value) {
      // Move selected author's posts to the top but keep all visible
      sortedPosts.sort((a, b) => {
        const isASelected = a.getAttribute("data-author") === value;
        const isBSelected = b.getAttribute("data-author") === value;
        return isBSelected - isASelected; // Sort selected author's posts first
      });
    }

    // Reorder posts in the container without hiding any
    sortedPosts.forEach((post) => postsContainer.appendChild(post));
  }

  // Tab click event listener
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      const sortType = this.getAttribute("data-filter");
      sortPosts(sortType);
    });
  });

  // Add event listeners for author name buttons
  document.querySelectorAll(".author-name button").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent navigation

      const author = this.getAttribute("data-author");
      sortPosts("author", author);
    });
  });
});
