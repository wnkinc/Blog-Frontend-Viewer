document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const postsContainer = document.querySelector(".feed");
  const posts = Array.from(document.querySelectorAll(".feed-post"));

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");

      let sortedPosts = [...posts];

      if (filter === "relevant") {
        // Filter only posts by "wesleyklaassen"
        sortedPosts = sortedPosts.filter(
          (post) => post.getAttribute("data-author") === "wesleynklaassen"
        );
      } else if (filter === "latest") {
        // Sort by date (most recent first)
        sortedPosts.sort(
          (a, b) =>
            new Date(b.getAttribute("data-date")) -
            new Date(a.getAttribute("data-date"))
        );
      } else if (filter === "top") {
        // Sort by reactions count (highest first)
        sortedPosts.sort(
          (a, b) =>
            Number(b.getAttribute("data-reactions")) -
            Number(a.getAttribute("data-reactions"))
        );
      }

      // Clear the container and re-add sorted posts
      postsContainer.innerHTML = "";
      sortedPosts.forEach((post) => postsContainer.appendChild(post));
    });
  });
});
