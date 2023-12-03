import { CookieManager } from "./cookies.js";
import { APIConnector } from "./api_connector.js";


if (!CookieManager.getCookie("accessToken") && !(await APIConnector.refreshToken())) {
    document.location.replace("./login.html");
}

document.querySelector(".add-btn").onclick = () => {
    addTimeRange();
};

document.querySelector(".save-btn").onclick = () => {
    let energyLimit = document.querySelector(".energy-limit").value;
    let workHours = [];

    let timeRanges = document.querySelectorAll(".time-range-picker");
    timeRanges.forEach((timeRange) => {
        let timeInputs = timeRange.querySelectorAll(".time-range");

        let startTime = timeInputs[0].value + ":00";
        let endTime = timeInputs[1].value + ":00";

        workHours.push([startTime, endTime]);
    });

    APIConnector.updateSettings(energyLimit, workHours).then((result) => {
        document.location.href = "./dashboard.html";
    });
};

function addTimeRange(startTime, endTime) {
    let timeRange = document.querySelector(".time-range-picker");
    let workTimes = document.querySelector(".work-times");

    let newTimeRange = timeRange.cloneNode(true);
    newTimeRange.querySelector(".delete-btn").onclick = () => {
        newTimeRange.remove();
    };

    let timeRanges = newTimeRange.querySelectorAll(".time-range");
    timeRanges[0].value = startTime;
    timeRanges[1].value = endTime;

    workTimes.appendChild(newTimeRange);
}

async function intialize() {
    let result = await APIConnector.getUserSettings();

    let totalEnergy = result["total_energy"];
    let workingHoursJSON = JSON.parse(result["work_time"]);
    
    document.querySelector(".energy-limit").value = totalEnergy;

    workingHoursJSON.forEach((json) => {
        let timeStrings = json.split("-");

        let startTime = timeStrings[0].slice(0, -3);
        let endTime = timeStrings[1].slice(0, -3);

        addTimeRange(startTime, endTime);
    });

    document.querySelector(".time-range-picker").remove();
}

await intialize();