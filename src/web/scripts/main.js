import { CookieManager } from "./cookies.js";

let head = document.getElementsByTagName("HEAD")[0];

let headerCSS = document.createElement("link");
headerCSS.rel = "stylesheet";
headerCSS.type = "text/css";
headerCSS.href = "/src/web/styles/header.css";

let footerCSS = document.createElement("link");
footerCSS.rel = "stylesheet";
footerCSS.type = "text/css";
footerCSS.href = "/src/web/styles/footer.css";

let boxiconsCSS = document.createElement("link");
footerCSS.rel = "stylesheet";
footerCSS.type = "text/css";
footerCSS.href = "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css";


head.appendChild(headerCSS);
head.appendChild(footerCSS);
head.appendChild(boxiconsCSS);


// Add header and footer via AJAX
document.addEventListener("DOMContentLoaded", () => {
    // Load header
    fetch("/src/web/includes/header.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("body").insertAdjacentHTML("afterbegin", data);

            if (CookieManager.getCookie("accessToken") || APIConnector.refreshToken()) {
                let headerContent = document.getElementById("header-content");
                console.log(headerContent);
                headerContent.innerHTML = `<a href="../pages/account.html"><img class="user-icon" src="/src/web/assets/user-circle.png"></a>`;
            }
        });

    // Load footer
    fetch("/src/web/includes/footer.html")
        .then(response => response.text())
        .then(data => document.querySelector("body").insertAdjacentHTML("beforeend", data));
});

