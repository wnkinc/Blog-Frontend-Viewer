// ****************** SAVE ******************
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".save-button").forEach((button) => {
    button.addEventListener("click", function () {
      const icon = this.querySelector(".save-icon");

      // Toggle filled class first
      icon.classList.toggle("filled");

      // Add animation class
      icon.classList.add("animate");

      // Remove animation class after animation completes
      setTimeout(() => {
        icon.classList.remove("animate");
      }, 200);
    });
  });
});

// ****************** RESHARE ******************
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".reshare-button").forEach((button) => {
    button.addEventListener("click", function () {
      const postUrl = `${window.location.origin}${button.getAttribute(
        "data-url"
      )}`;

      // Create and show the custom modal
      showCopyModal(postUrl);
    });
  });
});

// Function to create and display the modal with overlay
function showCopyModal(postUrl) {
  // Remove any existing modal or overlay
  document
    .querySelectorAll("#copy-modal, #copy-modal-overlay")
    .forEach((el) => el.remove());

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "copy-modal-overlay";
  overlay.classList.add("copy-modal-overlay");

  // Create modal container
  const modal = document.createElement("div");
  modal.id = "copy-modal";
  modal.classList.add("copy-modal");

  // Modal content
  modal.innerHTML = `
      <div class="copy-modal-content">
        <p>Share this post:</p>
        <input type="text" id="copy-input" value="${postUrl}" readonly>
        <button id="copy-btn">Copy Link</button>
        <button id="close-btn">Close</button>
      </div>
    `;

  // Append overlay and modal to body
  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  // Copy to clipboard functionality
  document.getElementById("copy-btn").addEventListener("click", function () {
    const copyInput = document.getElementById("copy-input");
    copyInput.select();
    document.execCommand("copy");
    this.textContent = "Copied! ✅"; // Change button text after copying
    setTimeout(() => (this.textContent = "Copy Link"), 2000); // Reset text after 2s
  });

  // Close button functionality
  document.getElementById("close-btn").addEventListener("click", function () {
    modal.remove();
    overlay.remove(); // Remove overlay when modal closes
  });

  // Close modal if overlay is clicked
  overlay.addEventListener("click", function () {
    modal.remove();
    overlay.remove();
  });
}
