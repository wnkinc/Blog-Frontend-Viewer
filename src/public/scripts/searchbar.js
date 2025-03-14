import algoliasearch from "https://cdn.jsdelivr.net/npm/algoliasearch@4/dist/algoliasearch-lite.esm.browser.js";

const client = algoliasearch("36IYS3Z8AJ", "5f06f4319ee250c21b0db5a8eb6a697f");
const index = client.initIndex("posts");

const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("search-results");

function stripHTML(html) {
  return html.replace(/<\/?[^>]+(>|$)/g, ""); // Removes all HTML tags
}

searchInput.addEventListener("input", async (event) => {
  const query = event.target.value.trim();
  console.log("Search query:", query);
  if (query.length < 2) {
    resultsContainer.innerHTML = ""; // Clear results if query is too short
    return;
  }

  try {
    const { hits } = await index.search(query);
    resultsContainer.innerHTML = hits
      .map(
        (hit) => `
        <a href="/post/${hit.slug}" class="search-result">
          <h3>${
            hit.title.length > 35 ? hit.title.slice(0, 35) + "..." : hit.title
          }</h3>
          <p>${stripHTML(hit.content).slice(0, 70)}...</p>
          <small>By ${hit.author}</small>
        </a>
      `
      )
      .join("");
  } catch (error) {
    console.error("Algolia search error:", error);
    resultsContainer.innerHTML = "<p>Search error</p>";
  }
});

searchInput.addEventListener("blur", () => {
  setTimeout(() => {
    resultsContainer.style.display = "none"; // Hide results after delay
  }, 150); // Adjust delay time (milliseconds)
});

searchInput.addEventListener("focus", () => {
  resultsContainer.style.display = "block"; // Show results again when clicked
});
