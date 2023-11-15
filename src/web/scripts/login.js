import { CookieManager } from "./cookies.js";


let loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // need bcrypt
    let pw_hash = password;

    async function verifyLogin() {
        await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": email,
                "pw_hash": pw_hash,
            }),
        }).then((response) => response.json())
        .then((result) => {
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
        })
        .catch((err) => console.err(err));
    }
    
    verifyLogin();    
});
