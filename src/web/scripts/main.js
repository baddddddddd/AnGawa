import { CookieManager } from "./cookies.js";
import { APIConnector } from "./api_connector.js"

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

let favicon = document.createElement("link");
favicon.rel = "icon";
favicon.href = "/src/web/assets/Logo.svg";

head.appendChild(favicon);
head.appendChild(headerCSS);
head.appendChild(footerCSS);
head.appendChild(boxiconsCSS);


function updateHeader() {
    let headerContent = document.getElementById("header-content");
    headerContent.innerHTML = `
        <div class="auth-buttons">
            <a href="/src/web/pages/dashboard.html"><button class="btn">VIEW DASHBOARD</button></a>
            <a href="/src/web/pages/account.html"><img class="user-icon" src="/src/web/assets/user-circle.png"></a>
        </div>
    `;
}

// Add header and footer via AJAX
document.addEventListener("DOMContentLoaded", () => {
    // Load header
    fetch("/src/web/includes/header.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("body").insertAdjacentHTML("afterbegin", data);

            if (CookieManager.getCookie("accessToken")) {
                updateHeader();
            } else {
                APIConnector.refreshToken().then((success) => {
                    if (success) {
                        updateHeader();
                    }
                });
            }
        });

    // Load footer
    fetch("/src/web/includes/footer.html")
        .then(response => response.text())
        .then(data => document.querySelector("body").insertAdjacentHTML("beforeend", data));
});

