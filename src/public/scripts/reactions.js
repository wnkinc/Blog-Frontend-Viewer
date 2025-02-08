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
  // Force the timer to false at the start of each page load
  localStorage.setItem("reactionTimerStarted", "false");

  const postId = document.body.getAttribute("data-post-id");
  const reactions = document.querySelectorAll(".reaction");

  // reactionBuffer:  { [postId]: { like: true, funny: true } }
  // batchBuffer:     { [postId]: ["like","funny"] }
  let reactionBuffer = JSON.parse(localStorage.getItem("reactionBuffer")) || {};
  let batchBuffer = JSON.parse(localStorage.getItem("batchBuffer")) || {};
  let timerStarted = false; // We'll reset this each page load

  // Ensure structures for the current post
  if (!reactionBuffer[postId]) reactionBuffer[postId] = {};
  if (!batchBuffer[postId]) batchBuffer[postId] = [];

  /*****************************************
   * updateUI():
   *   - Read DB count from <small>
   *   - If user has reaction selected, increment by 1
   *   - Otherwise, show just the DB count
   *****************************************/
  function updateUI() {
    reactions.forEach((reactionEl) => {
      const type = reactionEl.getAttribute("data-reaction-type");
      const countEl = reactionEl.querySelector("small");
      let dbCount = parseInt(countEl.textContent, 10) || 0;

      if (reactionBuffer[postId][type]) {
        reactionEl.classList.add("selected");
        countEl.textContent = dbCount + 1;
      } else {
        reactionEl.classList.remove("selected");
        countEl.textContent = dbCount;
      }
    });
  }

  /*****************************************
   * handleReactionClick():
   *   - Toggle local selection
   *   - Immediately increment or decrement UI
   *   - Update batchBuffer[postId]
   *****************************************/
  function handleReactionClick(event) {
    const reactionEl = event.currentTarget;
    const type = reactionEl.getAttribute("data-reaction-type");
    const countEl = reactionEl.querySelector("small");
    let displayedCount = parseInt(countEl.textContent, 10) || 0;

    if (reactionBuffer[postId][type]) {
      // Unselect => decrement UI
      delete reactionBuffer[postId][type];
      countEl.textContent = displayedCount - 1;
      reactionEl.classList.remove("selected");
    } else {
      // Select => increment UI
      reactionBuffer[postId][type] = true;
      countEl.textContent = displayedCount + 1;
      reactionEl.classList.add("selected");
    }

    // Update batchBuffer for the current post
    batchBuffer[postId] = Object.keys(reactionBuffer[postId]);

    // Persist in localStorage
    localStorage.setItem("reactionBuffer", JSON.stringify(reactionBuffer));
    localStorage.setItem("batchBuffer", JSON.stringify(batchBuffer));

    // Start timer if not already started
    if (!timerStarted) {
      timerStarted = true;
      localStorage.setItem("reactionTimerStarted", "true");
      console.log("Timer started: will send all reactions in 2 minutes.");
      setTimeout(batchUpdateReactions, 10 * 1000); // or 10 * 1000 for testing
    }
  }

  /*****************************************
   * batchUpdateReactions():
   *   - Check EVERY post in batchBuffer
   *   - If ANY has a non-empty array, send them
   *   - Clear entire batchBuffer after success
   *****************************************/
  async function batchUpdateReactions() {
    console.log("Running batchUpdateReactions() ...");

    // Reload from localStorage in case it changed
    batchBuffer = JSON.parse(localStorage.getItem("batchBuffer")) || {};

    // Build an object for posts that actually have data
    // e.g. { "101": ["like","funny"], "202": ["unicorn"] }
    let hasData = false;
    const allSelections = {};

    for (const pid in batchBuffer) {
      if (batchBuffer[pid].length > 0) {
        hasData = true;
        allSelections[pid] = batchBuffer[pid];
      }
    }

    if (!hasData) {
      console.log(
        "No reactions to update for any post. Resetting timerStarted."
      );
      localStorage.setItem("reactionTimerStarted", "false");
      timerStarted = false;
      return;
    }

    // We have at least one post with selected reactions
    console.log("Sending fetch POST to /post/reactions with multiple posts...");
    try {
      // Send the ENTIRE object of post -> [reactions]
      const response = await fetch("/post/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allSelections }),
      });

      if (response.ok) {
        console.log("Reactions updated successfully for all posts in DB.");
        // Clear entire batchBuffer
        batchBuffer = {};
        localStorage.setItem("batchBuffer", JSON.stringify(batchBuffer));
      } else {
        console.error("Server responded with error:", response.status);
      }
    } catch (error) {
      console.error("Error updating reactions in DB:", error);
    }

    // Always reset timer after attempt
    localStorage.setItem("reactionTimerStarted", "false");
    timerStarted = false;
  }

  /*****************************************
   * Attach event listeners & init UI
   *****************************************/
  reactions.forEach((reactionEl) => {
    reactionEl.addEventListener("click", handleReactionClick);
  });
  updateUI();
});
