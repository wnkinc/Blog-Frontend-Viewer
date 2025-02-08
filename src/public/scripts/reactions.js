document.addEventListener("DOMContentLoaded", () => {
  const reactionsContainer = document.querySelector(".reactions-container");
  const reactionsMenu = document.querySelector(".reactions-menu");
  const sidebarItem = document.querySelector(".sidebar-item");
  let menuTimeout;

  function showElements() {
    clearTimeout(menuTimeout);
    reactionsMenu.style.visibility = "visible";
    reactionsMenu.style.opacity = "1";
    sidebarItem.classList.add("tooltip-visible");
  }

  function hideElements() {
    menuTimeout = setTimeout(() => {
      reactionsMenu.style.visibility = "hidden";
      reactionsMenu.style.opacity = "0";
      sidebarItem.classList.remove("tooltip-visible");
    }, 600); // Delay hiding both elements
  }

  reactionsContainer.addEventListener("mouseenter", showElements);
  reactionsMenu.addEventListener("mouseenter", showElements);
  reactionsContainer.addEventListener("mouseleave", hideElements);
  reactionsMenu.addEventListener("mouseleave", hideElements);
});

document.addEventListener("DOMContentLoaded", () => {
  const reactions = document.querySelectorAll(".reaction");
  const postId = document.body.getAttribute("data-post-id"); // Ensure post ID is set on the page
  let reactionBuffer = JSON.parse(localStorage.getItem("reactionBuffer")) || {};

  // Ensure reactions exist for this post in storage
  if (!reactionBuffer[postId]) {
    reactionBuffer[postId] = {};
  }

  function updateUI() {
    reactions.forEach((reaction) => {
      const type = reaction.getAttribute("data-reaction-type");
      const countElement = reaction.querySelector("small");
      let totalCount = parseInt(countElement.textContent, 10) || 0;

      // If the user previously clicked this reaction, highlight it
      if (reactionBuffer[postId][type]) {
        reaction.classList.add("selected");
      } else {
        reaction.classList.remove("selected");
      }

      // Ensure UI count reflects any changes the user made
      countElement.textContent =
        totalCount + (reactionBuffer[postId][type] ? 1 : 0);
    });
  }

  function handleReactionClick(event) {
    const reaction = event.currentTarget;
    const type = reaction.getAttribute("data-reaction-type");
    const countElement = reaction.querySelector("small");
    let totalCount = parseInt(countElement.textContent, 10) || 0;

    // Toggle reaction state for this post
    if (reactionBuffer[postId][type]) {
      totalCount--; // Remove reaction
      delete reactionBuffer[postId][type];
    } else {
      totalCount++; // Add reaction
      reactionBuffer[postId][type] = true;
    }

    // Update UI
    countElement.textContent = totalCount;
    reaction.classList.toggle("selected");

    // Save to Local Storage
    localStorage.setItem("reactionBuffer", JSON.stringify(reactionBuffer));
  }

  // Attach event listeners to reactions
  reactions.forEach((reaction) => {
    reaction.addEventListener("click", handleReactionClick);
  });

  // Initialize UI
  updateUI();
});
