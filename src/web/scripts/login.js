import { CookieManager } from "./cookies.js";
import { APIConnector } from "./api_connector.js";


if (CookieManager.getCookie("refreshToken")) {
    document.location.replace("./dashboard.html");
}

let loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    APIConnector.verifyLogin(email, password);
});
