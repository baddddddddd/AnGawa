import { CookieManager } from "./cookies.js";

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

    // need bcrypt
    let pw_hash = password;

    async function createUser(firstName, middleName, lastName, nameExtension, birthdate, gender, email, pw_hash) {
        try {
            const response = await fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "first_name": firstName,
                "middle_name": middleName,
                "last_name": lastName,
                "name_ext": nameExtension,
                "birthdate": birthdate,
                "gender": gender,
                "email": email,
                "pw_hash": pw_hash,
            }),
            });

            await response.json().then((result) => {
                let accessToken = result["access_token"];
                let refreshToken = result["refresh_token"];

                if (accessToken == null || refreshToken == null) {
                    return;
                } else {
                    console.log(result);
                }

                CookieManager.setCookie("accessToken", accessToken, 0, 1);
                CookieManager.setCookie("refreshToken", refreshToken, 30);

                document.location.replace("./dashboard.html");
            });

        } catch (error) {
            console.error(error);
        }
    }

    createUser(firstName, middleName, lastName, nameExtension, birthdate, gender, email, pw_hash);
});
