import { APIConnector } from "./api_connector.js";


let loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    APIConnector.verifyLogin(email, password);
});
