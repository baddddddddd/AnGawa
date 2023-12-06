import { CookieManager } from "./cookies.js";
import { APIConnector } from "./api_connector.js";


if (!CookieManager.getCookie("accessToken") && !(await APIConnector.refreshToken())) {
    document.location.replace("./login.html");
}

async function initialize() {
    let result = await APIConnector.getAccountInfo();

    let firstName = result["first_name"];
    let middleName = result["middle_name"];
    let lastName = result["last_name"];
    let nameExtension = result["name_ext"];
    let birthdateString = result["birthdate"];
    let gender = result["gender"];
    let email = result["email"];

    let birthdateFormatted = new Date(birthdateString).toLocaleDateString('en-GB');

    document.querySelector(".first-name").innerHTML = firstName;
    document.querySelector(".middle-name").innerHTML = middleName;
    document.querySelector(".last-name").innerHTML = lastName;
    document.querySelector(".name-extension").innerHTML = nameExtension;
    document.querySelector(".gender").innerHTML = gender;
    document.querySelector(".birthdate").innerHTML = birthdateFormatted;
    document.querySelector(".email-address").innerHTML = email;

    if (middleName.length == 0) {
        document.querySelector(".middle-name-container").remove();
    }

    if (nameExtension.length == 0) {
        document.querySelector(".name-extension-container").remove();
    }
}

await initialize();
