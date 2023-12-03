import { CookieManager } from "./cookies.js";
import { APIConnector } from "./api_connector.js";


if (!CookieManager.getCookie("accessToken") && !(await APIConnector.refreshToken())) {
    document.location.replace("./login.html");
}


let tasksInfo = {};
let referenceTime = new Date();
referenceTime.setHours(referenceTime.getHours() - 3);
referenceTime.setMinutes(0, 0, 0);

const currentDate = new Date();
const formattedDate = formatDate(currentDate);

function updateTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours() % 12 || 12;
    const minutes = (currentTime.getMinutes() < 10 ? "0" : "") + currentTime.getMinutes();
    const meridiem = currentTime.getHours() >= 12 ? 'PM' : 'AM';

    return `${hours}:${minutes} ${meridiem}`;
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const dayName = date.toLocaleString('en-US', { weekday: 'long' });

    return `${dayName} ${day} ${month} ${year}`;
}

document.getElementById('date').textContent = formattedDate;
setInterval(updateTime, 1000);
document.getElementById("time").textContent = updateTime();

function addRecentFile(noteId, fileName, iconUrl, link) {
    var fileLink = document.createElement('a');
    fileLink.href = link;

    var fileButton = document.createElement('div');
    fileButton.classList.add('recentFile');

    fileButton.onclick = () => {
        CookieManager.setCookie("noteID", noteId);
    };

    var fileIcon = document.createElement('img');
    fileIcon.src = iconUrl;
    fileIcon.classList.add('fileIcon');

    var fileNameSpan = document.createElement('span');
    fileNameSpan.textContent = fileName;

    fileButton.appendChild(fileIcon);
    fileButton.appendChild(fileNameSpan);

    fileLink.appendChild(fileButton);

    document.getElementById('recentFilesContainer').appendChild(fileLink);
}

function createElement(tag, id, text, isButton, href, className, gridColumn, backgroundColor) {
    const element = document.createElement(tag);
    element.id = id;
    element.textContent = text;

    if (isButton) {
        element.href = href;
    }

    if (className) {
        element.className = className;
    }

    if (gridColumn) {
        element.style.gridColumn = gridColumn;
    }

    if (backgroundColor) {
        element.style.backgroundColor = backgroundColor;
    }

    return element;
}

function toTimeString(date) {
    const hours = date.getHours() % 12 || 12;
    const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    const meridiem = date.getHours() >= 12 ? 'PM' : 'AM';

    const timeString = `${hours}:${minutes} ${meridiem}`;
    return timeString;
}

const timeLabelContainer = document.getElementById('taskTop');
const taskContainer = document.getElementById('taskList');

for (let i = 1; i <= 10; i++) {
    let timeLabel = new Date(referenceTime);
    timeLabel.setHours(timeLabel.getHours() + i);

    const label = createElement('div', 'timeLabel', `${toTimeString(timeLabel)}`);

    const column = i * 60;
    const lineu = createElement('div', 'vertical-line-upper', '', null, null, null, `${column} / span 2`);
    const linel = createElement('div', 'vertical-line-lower', '', null, null, null, `${column} / span 2`);
    const linem = createElement('div', 'vertical-line-middle', '', null, null, null, `${column} / span 2`);

    timeLabelContainer.appendChild(label);
    taskContainer.appendChild(lineu);
    taskContainer.appendChild(linel);
    taskContainer.appendChild(linem);
}

function getRandomLightColor(usedColors) {
    const letters = 'ABCDEF';
    let color;

    do {
        color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 6)];
        } function getRandomLightColor(usedColors) {
            const letters = 'ABCDEF';
            let color;

            do {
                color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 6)];
                }
            } while (usedColors.includes(color));

            usedColors.push(color);
            return color;
        }

    } while (usedColors.includes(color));

    usedColors.push(color);
    return color;
}

const usedColors = [];

const buttonsData = [];

function addTask(id, title, start_time, end_time) {
    let duration = (end_time - start_time) / (1000 * 60);

    let startColumn = (start_time - referenceTime) / (1000 * 60);

    const buttonData = {
        id: id, 
        text: title, 
        href: './tasks.html', 
        className: 'custom-button', 
        gridColumn: `${startColumn} / span ${duration}`, 
        backgroundColor: getRandomLightColor(usedColors),
    };

    const button = createElement('a', buttonData.id, buttonData.text, true, buttonData.href, buttonData.className, buttonData.gridColumn, buttonData.backgroundColor);
    taskContainer.appendChild(button);
}

buttonsData.forEach(buttonData => {
    const button = createElement('a', buttonData.id, buttonData.text, true, buttonData.href, buttonData.className, buttonData.gridColumn, buttonData.backgroundColor);
    taskContainer.appendChild(button);
});


function updatePercentage(newPercentage) {
    const percentText = document.querySelector('.donut-percent');
    percentText.textContent = newPercentage + '%';
    const dashArray = `${newPercentage}, ${100 - newPercentage}`;
    document.querySelector('.donut-segment-2').setAttribute('stroke-dasharray', dashArray);
}

const motivationalQuotes = [
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "Believe you can and you're halfway there. -Theodore Roosevelt",
    "Don't watch the clock; do what it does. Keep going. -Sam Levenson",
    "The only way to achieve the impossible is to believe it is possible. - Charles Kingsleigh",
    "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
    "Opportunities don't happen. You create them. - Chris Grosser",
    "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
    "The only place where success comes before work is in the dictionary. - Vidal Sassoon",
    "Don't be afraid to give up the good to go for the great. - John D. Rockefeller",
    "Success is stumbling from failure to failure with no loss of enthusiasm. - Winston S. Churchill",
    "If you are not willing to risk the usual, you will have to settle for the ordinary. - Jim Rohn",
    "Hard work beats talent when talent doesn't work hard. - Tim Notke",
    "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
    "The road to success and the road to failure are almost exactly the same. - Colin R. Davis",
    "Success is not in what you have, but who you are. - Bo Bennett",
    "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
    "Success is not just about making money. It's about making a difference. - Unknown",
    "Your attitude, not your aptitude, will determine your altitude. - Zig Ziglar",
    "Do not wait to strike till the iron is hot, but make it hot by striking. - William Butler Yeats",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not just about reaching the destination; it's about enjoying the journey. - Unknown",
    "Your time is now. Start where you are, use what you have, do what you can. - Arthur Ashe",
    "Success is not for the chosen few, but for the few who choose it. - Unknown",
    "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
    "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
    "Success is not just about making money. It's about making a difference. - Unknown",
    "Your attitude, not your aptitude, will determine your altitude. - Zig Ziglar",
    "Do not wait to strike till the iron is hot, but make it hot by striking. - William Butler Yeats",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not just about reaching the destination; it's about enjoying the journey. - Unknown",
    "Your time is now. Start where you are, use what you have, do what you can. - Arthur Ashe",
    "Success is not for the chosen few, but for the few who choose it. - Unknown"
];

function displayMotivationalQuote() {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const quoteWithAuthor = motivationalQuotes[randomIndex].split('-');

    const quoteDiv = document.getElementById("quote");
    quoteDiv.textContent = quoteWithAuthor[0];

    const authorDiv = document.getElementById("author");
    authorDiv.textContent = quoteWithAuthor[1];
}

displayMotivationalQuote();


async function fetchSchedule() {
    let result = await APIConnector.generateSchedule();

    console.log(result);

    let scheduleTasks = result["scheduled_tasks"];


    scheduleTasks.forEach((task) => {
        let startTime = new Date(Date.parse(task["start_time"]));
        startTime.setMinutes(startTime.getMinutes() + startTime.getTimezoneOffset());
        task["start_time"] = startTime;

        let endTime = new Date(Date.parse(task["end_time"]));
        endTime.setMinutes(endTime.getMinutes() + endTime.getTimezoneOffset());
        task["end_time"] = endTime;

        let taskId = task["task_id"];
        let taskName = tasksInfo[taskId];

        let maxTime = new Date(referenceTime);
        maxTime.setHours(maxTime.getHours() + 9);

        if (startTime >= referenceTime && endTime <= maxTime) {
            addTask(taskId, taskName, startTime, endTime);
        }
    });
}

async function fetchNotes() {
    let notes = await APIConnector.getNotes();

    for (let i = 0; i < 5; i++) {
        if (!notes[i]) {
            break;
        }

        let noteId = notes[i]["note_id"];
        let noteTitle = notes[i]["note_title"];

        addRecentFile(noteId, noteTitle, '../assets/note.svg', './editor.html');
    }
}

async function fetchTasks() {
    let result = await APIConnector.getTasks();

    let tasks = result["tasks"];

    tasks.forEach((task) => {
        tasksInfo[task["task_id"]] = task["task_name"];
    });
}

async function fetchScore() {
    let result = await APIConnector.getProductivityScore();
    let score = Math.ceil(result["score"]);

    updatePercentage(score);
}


async function initialize() {
    await fetchScore();
    await fetchTasks();
    await fetchSchedule();
    await fetchNotes();
}

await initialize();
