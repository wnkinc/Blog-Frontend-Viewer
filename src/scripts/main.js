document.addEventListener("DOMContentLoaded", function () {
  // Handle reaction selection using event delegation
  document.body.addEventListener("click", function (event) {
    // Check if the clicked element is a reaction button
    if (event.target.classList.contains("reaction-option")) {
      const reaction = event.target.innerText; // Get the selected emoji
      const reactionContainer = event.target.closest(".reaction-container");
      const reactionButton =
        reactionContainer.querySelector(".reaction-button");
      const reactionCount = reactionButton.querySelector(".reaction-count");

      // Update the button to show the selected reaction
      reactionButton.innerHTML = `${reaction} <span class="reaction-count">${
        parseInt(reactionCount.innerText) + 1
      }</span>`;

      // TODO: Send the reaction to the backend via fetch API
    }
  });
});
