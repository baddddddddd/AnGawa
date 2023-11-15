import { CookieManager } from "./cookies.js";


async function initializeCookies() {
    const refreshToken = CookieManager.getCookie("refreshToken");

    if (refreshToken == null) {
        return;
    }

    await fetch("http://localhost:5000/api/refresh", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
        },
    })
    .then((response) => response.json())
    .then((result) => {
        const accessToken = result["access_token"];

        CookieManager.setCookie("accessToken", accessToken, 0, 1);
        document.location.replace("./dashboard.html");

    }).catch((err) => console.error(err));
}


CookieManager.eraseCookie("refreshToken");

await initializeCookies();
