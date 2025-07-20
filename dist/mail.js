document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData);

  fetch("/send-mail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      showModal(
        result.message,
        result.message === "Email sent successfully" ? "Success!" : "Error"
      );
      if (result.message === "Email sent successfully") {
        this.reset(); // Reset the form on success
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showModal("An error occurred while sending the message.", "Error");
    });
});

function showModal(message, title) {
  const modal = document.getElementById("alertModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");

  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.classList.remove("hidden");

  document.getElementById("closeModal").onclick = function () {
    modal.classList.add("hidden");
  };

  // Close modal when clicking outside of it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.classList.add("hidden");
    }
  };
}
