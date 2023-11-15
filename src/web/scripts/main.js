// Add header and footer via AJAX
document.addEventListener("DOMContentLoaded", () => {
    // Load header
    fetch("../includes/header.html")
        .then(response => response.text())
        .then(data => document.querySelector("body").insertAdjacentHTML("afterbegin", data));

    // Load footer
    fetch("../includes/footer.html")
        .then(response => response.text())
        .then(data => document.querySelector("body").insertAdjacentHTML("beforeend", data));
});
