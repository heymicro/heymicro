const form = document.getElementById("feedback-form");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const status = document.getElementById("feedback-status");
    if (button.disabled) return;
    button.disabled = true;
    button.textContent = "Sending…";
    status.textContent = "";
    try {
      const response = await fetch(form.action, {
        method: "POST",
        credentials: "omit",
        headers: { "Accept": "application/json" },
        body: new URLSearchParams(new FormData(form))
      });
      const result = await response.json();
      if (!response.ok || result.status !== "received") {
        status.textContent = response.status === 429
          ? "Too many submissions. Please try again later."
          : response.status === 404
          ? "This form is not accepting feedback right now."
          : "Could not send your feedback. Check your details and try again.";
        return;
      }
      form.hidden = true;
      const receipt = document.getElementById("feedback-received");
      receipt.hidden = false;
      receipt.focus();
    } catch {
      status.textContent = "We couldn’t confirm receipt. Your message is still here; please check your connection before trying again.";
    } finally {
      button.disabled = false;
      button.textContent = "Send feedback";
    }
  });
}

