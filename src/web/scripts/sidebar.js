document.addEventListener("DOMContentLoaded", () => {
    // Load header
    fetch("/src/web/includes/sidebar.html")
        .then(response => response.text())
        .then(data => {
            let head = document.getElementsByTagName("HEAD")[0];
            let body = document.querySelector("body");

            body.insertAdjacentHTML("beforeend", data);

            let sidebarCSS = document.createElement("link");
            sidebarCSS.rel = "stylesheet";
            sidebarCSS.type = "text/css";
            sidebarCSS.href = "/src/web/styles/sidebar.css";

            head.appendChild(sidebarCSS);

            // Sidebar script
            const sidebar = body.querySelector(".sidebar");

            sidebar.addEventListener("mouseenter", () => {
                sidebar.classList.remove("close");
            });


            sidebar.addEventListener("mouseleave", () => {
                sidebar.classList.add("close");
            });

            const cards = document.querySelectorAll(".card");

            cards.forEach(card => {
                card.addEventListener("dragstart", () => {
                    setTimeout(() => card.classList.add("dragging"), 0);
            });

            card.addEventListener("dragend", () => {
                card.classList.remove("dragging");
            });
            });
        });
});
