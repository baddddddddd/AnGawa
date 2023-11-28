// import { CookieManager } from "./cookies.js";
// import { APIConnector } from "./api_connector.js";


// if (!CookieManager.getCookie("accessToken") && !(await APIConnector.refreshToken())) {
//     document.location.replace("./login.html");
// }

//Top Portion of the Page
const usernameElement = document.getElementById('username');
const usernameText = usernameElement.textContent.trim();
const words = usernameText.split(' ');
const firstWord = words[0];
document.getElementById('welcome').textContent = `Welcome, ${firstWord}`;
const imageDescriptions = document.querySelectorAll('.image-description');
let currentIndex = 0;
let slideshowTimeout;

function showAds(index) {
    imageDescriptions.forEach(desc => desc.style.display = 'none');
    imageDescriptions[index].style.display = 'block';
}

function nextText() {
    currentIndex = (currentIndex + 1) % imageDescriptions.length;
    showAds(currentIndex);
    startSlideshowTimer();
}

function startSlideshowTimer() {
    clearTimeout(slideshowTimeout);
    slideshowTimeout = setTimeout(nextText, 2000);
}

//Date and Time
const currentDate = new Date();
const formattedDate = formatDate(currentDate);

function createElement(type, id, textContent, disabled = false) {
    const element = document.createElement(type);
    element.id = id;
    element.textContent = textContent;
    if (disabled) {
        element.setAttribute('disabled', true);
    }
    return element;
}

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

const dayTasks = document.getElementById('day-tasks');
const dayTime = document.getElementById('day-time');
dayTasks.innerHTML = '';
dayTime.innerHTML = '';

for (let i = 1; i <= 10; i++) { // Modify this to show the real task list
    const timeListItem = createElement('li', '', `${i + 7}:00 am`);
    dayTime.appendChild(timeListItem);

    const taskListItem = createElement('li', '', `Task ${i} today`);
    dayTasks.appendChild(taskListItem);
}

//Gender
function loadGenderIcon(gender) {
    const genderIconContainer = document.getElementById('gender-icon');

    if (genderIconContainer) {
        genderIconContainer.innerHTML = '';

        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute("width", "20px");
        svgElement.setAttribute("height", "20px");

        const svgPath = `../assets/${gender}.svg`;
        fetch(svgPath)
            .then(response => response.text())
            .then(svgData => {
                svgElement.innerHTML = svgData;
                genderIconContainer.appendChild(svgElement);
            })
            .catch(error => {
                console.error(`Error loading SVG: ${error}`);
            });
    } else {
        console.error("Element with id 'gender-icon' not found.");
    }
}

//Qoutes
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

//Recently Edited Notes
const recentOpenList = document.getElementById('recentOpen');

for (let i = 1; i <= 10; i++) {
    const link = document.createElement('a');
    link.href = `#link${i}`; //you can add the link here
    const button = document.createElement('button');
    button.textContent = `Recently Edited ${i}`;
    link.appendChild(button);
    const listItem = document.createElement('li');
    listItem.appendChild(link);
    recentOpenList.appendChild(listItem);
}

//Productivity Score
const semiCircles = document.querySelectorAll('.semi-circle');

semiCircles.forEach(semiCircle => {
    const dataValue = parseInt(semiCircle.getAttribute('data-value'));

    const rotationAngle = dataValue * 1.8;

    const arc = semiCircle.querySelector('.arc');
    arc.style.transform = `rotate(${rotationAngle}deg)`;
    arc.style.animation = 'rotate 1s linear';
});

//Top Portion of the Page
showAds(currentIndex);
startSlideshowTimer();
//Date and Time
document.getElementById('date').textContent = formattedDate;
setInterval(updateTime, 1000);
document.getElementById("time").textContent = updateTime();
//Gender
const gender = 'female';
loadGenderIcon(gender);
//Quote
displayMotivationalQuote();
