document.addEventListener("DOMContentLoaded", async () => {
  console.log("Homepage loaded: Checking batchBuffer...");

  // 1) Load batchBuffer from localStorage
  let batchBuffer = JSON.parse(localStorage.getItem("batchBuffer")) || {};

  // 2) Gather all post IDs & reactions
  let hasData = false;
  const allSelections = {}; // e.g. { "101": ["like","funny"], "202": ["wow"] }

  for (const pid in batchBuffer) {
    if (batchBuffer[pid].length > 0) {
      hasData = true;
      allSelections[pid] = batchBuffer[pid];
    }
  }

  // 3) If nothing to send, do nothing
  if (!hasData) {
    console.log("No queued reactions to send. batchBuffer is empty.");
    return;
  }

  // 4) Send allSelections to your route (e.g., "/post/reactions")
  console.log("Sending queued reactions to /post/reactions:", allSelections);

  try {
    const response = await fetch("/post/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allSelections }),
    });

    if (!response.ok) {
      console.error("Failed to send queued reactions:", response.status);
      return;
    }

    console.log("Queued reactions updated successfully in DB.");

    // 5) Clear the batchBuffer after success
    localStorage.removeItem("batchBuffer");
    console.log("batchBuffer cleared from localStorage.");
  } catch (error) {
    console.error("Error sending queued reactions:", error);
  }
});
