import { CookieManager } from "./cookies.js";
import { APIConnector } from "./api_connector.js";


if (CookieManager.getCookie("refreshToken")) {
    document.location.replace("./dashboard.html");
}

let signupForm = document.getElementById("signup-form");
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let firstName = document.getElementById("first-name").value;
    let middleName = document.getElementById("middle-name").value;
    let lastName = document.getElementById("last-name").value;
    let nameExtension = document.getElementById("name-extension").value;
    let birthdate = document.getElementById("birthdate").value;
    let gender = document.getElementById("gender").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    APIConnector.createAccount(firstName, middleName, lastName, nameExtension, birthdate, gender, email, password);
});
