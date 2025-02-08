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
  const postId = document.body.getAttribute("data-post-id");
  let reactionBuffer = JSON.parse(localStorage.getItem("reactionBuffer")) || {};
  let batchBuffer = JSON.parse(localStorage.getItem("batchBuffer")) || {}; // Tracks only final selections
  let timerStarted = localStorage.getItem("reactionTimerStarted");

  if (!reactionBuffer[postId]) reactionBuffer[postId] = {};
  if (!batchBuffer[postId]) batchBuffer[postId] = {};

  function updateUI() {
    reactions.forEach((reaction) => {
      const type = reaction.getAttribute("data-reaction-type");
      const countElement = reaction.querySelector("small");
      let totalCount = parseInt(countElement.textContent, 10) || 0;

      // Highlight if the user selected this reaction
      if (reactionBuffer[postId][type]) {
        reaction.classList.add("selected");
      } else {
        reaction.classList.remove("selected");
      }

      // Ensure UI count reflects any changes
      countElement.textContent = totalCount;
    });
  }

  function handleReactionClick(event) {
    const reaction = event.currentTarget;
    const type = reaction.getAttribute("data-reaction-type");

    // Toggle reaction state for this post
    if (reactionBuffer[postId][type]) {
      delete reactionBuffer[postId][type]; // User unselects it, but no decrementing occurs
    } else {
      reactionBuffer[postId][type] = true; // User selects it
    }

    // Store only final selections for batch update (batchBuffer will hold only selected ones)
    batchBuffer[postId] = Object.keys(reactionBuffer[postId]);

    // Save to Local Storage
    localStorage.setItem("reactionBuffer", JSON.stringify(reactionBuffer));
    localStorage.setItem("batchBuffer", JSON.stringify(batchBuffer));

    // Start timer if this is the first reaction in this session
    if (!timerStarted) {
      timerStarted = true;
      localStorage.setItem("reactionTimerStarted", "true");
      setTimeout(batchUpdateReactions, 10 * 60 * 1000); // 10-minute delay
    }

    updateUI();
  }

  async function batchUpdateReactions() {
    if (!batchBuffer[postId] || batchBuffer[postId].length === 0) {
      console.log("No reactions to update.");
      return;
    }

    try {
      const response = await fetch("/post/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, reactions: batchBuffer[postId] }), // Send only selected reactions
      });

      if (response.ok) {
        console.log("Reactions updated successfully");
        localStorage.removeItem("batchBuffer"); // Clear batch buffer after sending
        localStorage.setItem("reactionTimerStarted", "false"); // Reset timer flag
        timerStarted = false;
      }
    } catch (error) {
      console.error("Error updating reactions:", error);
    }
  }

  // Attach event listeners to reactions
  reactions.forEach((reaction) => {
    reaction.addEventListener("click", handleReactionClick);
  });

  // Initialize UI
  updateUI();
});
