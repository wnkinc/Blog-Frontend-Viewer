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

  // Load reaction data from Local Storage
  let userReactions = JSON.parse(localStorage.getItem("userReactions")) || {};

  // Function to update UI from stored reactions
  function updateUI() {
    reactions.forEach((reaction) => {
      const type = reaction.getAttribute("data-reaction-type");
      const countElement = reaction.querySelector("small");
      countElement.textContent = userReactions[type] || 0;

      // Highlight reaction if user has selected it
      if (localStorage.getItem(`selected-${type}`) === "true") {
        reaction.classList.add("selected");
      } else {
        reaction.classList.remove("selected");
      }
    });
  }

  // Function to handle reaction click
  function handleReactionClick(event) {
    const reaction = event.currentTarget;
    const type = reaction.getAttribute("data-reaction-type");
    const countElement = reaction.querySelector("small");
    let count = parseInt(countElement.textContent, 10);

    // Check if user already clicked this reaction
    if (localStorage.getItem(`selected-${type}`) === "true") {
      // Undo the reaction
      count--;
      localStorage.removeItem(`selected-${type}`);
    } else {
      // Add the reaction
      count++;
      localStorage.setItem(`selected-${type}`, "true");
    }

    // Store updated count
    userReactions[type] = count;
    localStorage.setItem("userReactions", JSON.stringify(userReactions));

    // Update UI
    updateUI();
  }

  // Attach event listeners to reactions
  reactions.forEach((reaction) => {
    reaction.addEventListener("click", handleReactionClick);
  });

  // Initialize UI from Local Storage
  updateUI();
});
