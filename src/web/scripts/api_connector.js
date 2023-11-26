import { CookieManager } from "./cookies.js";
    

export class APIConnector {
    static BASE_URL = "http://localhost:5000/api/";

    static DEFAULT_HEADERS = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    };

    static async sendRequest(method, route, body = null, requireAuth = true) {
        var headers = {...APIConnector.DEFAULT_HEADERS};

        if (requireAuth) {
            var accessToken = CookieManager.getCookie("accessToken");

            if (accessToken == null) {
                APIConnector.refreshToken();
                accessToken = CookieManager.getCookie("accessToken");
            }

            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        let response = await fetch(APIConnector.BASE_URL + route, {
            method: method,
            headers: headers,
            body: (body) ? JSON.stringify(body) : null,
        });

        if (requireAuth && response.status === 401) {
            await APIConnector.refreshToken();
            return APIConnector.sendRequest(method, route, body, requireAuth);
        } else {
            return response;   
        }
    }   

    static async refreshToken() {
        const refreshToken = CookieManager.getCookie("refreshToken");

        if (refreshToken == null) {
            return false;
        }

        await fetch(APIConnector.BASE_URL + "refresh", {
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
        })
        .catch((err) => console.err(err));

        return true;
    }

    static async verifyLogin(email, password) {
        var body = {
            "email": email,
            "pw_hash": password,
        };

        var response = await APIConnector.sendRequest("POST", "login", body, false);

        if (response.status == 200) {
            let result = await response.json();
            let accessToken = result["access_token"];
            let refreshToken = result["refresh_token"];

            CookieManager.setCookie("accessToken", accessToken, 0, 1);
            CookieManager.setCookie("refreshToken", refreshToken, 30);

            document.location.replace("./dashboard.html");
        } else {
            let result = await response.json();

            console.log(result);
        }

        return response;
    }

    static async createAccount(firstName, middleName, lastName, nameExtension, birthdate, gender, email, pw_hash) {
        var body = {
            "first_name": firstName,
            "middle_name": middleName,
            "last_name": lastName,
            "name_ext": nameExtension,
            "birthdate": birthdate,
            "gender": gender,
            "email": email,
            "pw_hash": pw_hash,
        };

        var response = await APIConnector.sendRequest("POST", "signup", body, false);

        if (response.status == 200) {
            let result = await response.json();
            let accessToken = result["access_token"];
            let refreshToken = result["refresh_token"];

            CookieManager.setCookie("accessToken", accessToken, 0, 1);
            CookieManager.setCookie("refreshToken", refreshToken, 30);

            document.location.replace("./dashboard.html");

        } else {
            let result = await response.json();
            
            console.log(result);
        }

        return response;
    }

    static async getNotes() {
        let response = await APIConnector.sendRequest("GET", "notes/all", null, true);

        return await response.json();
    }

    static async createNote() {
        let response = await APIConnector.sendRequest("POST", "notes", null, true);

        return await response.json();
    }

    static async getNote(noteID) {
        let body = {
            "note_id": noteID,
        };

        let response = await APIConnector.sendRequest("POST", "notes/one", body, true);
        
        let result = await response.json();

        return result;
    }

    static async saveNote(noteID, noteTitle, noteContent) {
        let body = {
            "note_id": noteID,
            "note_title": noteTitle,
            "note_content": noteContent,
        };

        let response = await APIConnector.sendRequest("PUT", "notes", body, true);

        let result = await response.json();
        
        return result;
    }
}
