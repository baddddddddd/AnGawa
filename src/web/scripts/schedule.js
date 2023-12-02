import { APIConnector } from "./api_connector.js";


const getDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const getMonthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let schedule = {};
let tasksInfo = {};


function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

function createElement(type, id, textContent, disabled = false) {
    const element = document.createElement(type);
    element.id = id;
    element.textContent = textContent;
    if (disabled) {
        element.setAttribute('disabled', true);
    }
    return element;
}

function generateCalendar(day, month, year) {
    const monthName = getMonthName[month];
    document.getElementById('topMonth').textContent = monthName;
    document.getElementById('topYear').textContent = year;

    const calendarDays = document.getElementById('calendar-days');
    const currentDate = new Date(year, month, 1);
    const daysInCurrentMonth = daysInMonth(month, year);
    const firstDayOfMonth = currentDate.getDay();

    calendarDays.innerHTML = '';

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = createElement('button', 'daysButton', '', true);
        calendarDays.appendChild(emptyDay);
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
        const button = createElement('button', 'daysButton', i);
        const dayWeek = (firstDayOfMonth + i - 1 + 7) % 7;
        if (dayWeek === 0) {
            button.classList.add('red');
        }
        button.addEventListener('click', () => showDayView(i, dayWeek, month));
        calendarDays.appendChild(button);
    }

    showDayView(day, (firstDayOfMonth + day - 1 + 7) % 7, month);
}

function toTimeString(date) {
    const hours = date.getHours() % 12 || 12;
    const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    const meridiem = date.getHours() >= 12 ? 'PM' : 'AM';

    const timeString = `${hours}:${minutes} ${meridiem}`;
    return timeString;
}

function showDayView(selectedDay, dayWeek, month) {
    const dayTasks = document.getElementById('day-tasks');
    const dayTime = document.getElementById('day-time');
    dayTasks.innerHTML = '';
    dayTime.innerHTML = '';

    if (schedule[month] && schedule[month][selectedDay]) {
        let tasks = schedule[month][selectedDay];

        tasks.forEach((task) => {
            let startTime = toTimeString(task["start_time"]);
            let endTime = toTimeString(task["end_time"]);
            let taskName = tasksInfo[task["task_id"]];
            
            const timeListItem = createElement('li', '', `${startTime} - ${endTime}`);
            timeListItem.style.whiteSpace = "nowrap";
            dayTime.appendChild(timeListItem);

            const taskListItem = createElement('li', '', `${taskName}`);
            dayTasks.appendChild(taskListItem);
        });
    }

    dayWeek = getDayName[dayWeek];
    document.getElementById('day').textContent = dayWeek;
    document.getElementById('date').textContent = `${getMonthName[month]} ${selectedDay}`;
}

function updateMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    generateCalendar(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());
}

function previousMonth() {
    updateMonth(-1);
}

function nextMonth() {
    updateMonth(1);
}

function updateTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours() % 12 || 12;
    const minutes = (currentTime.getMinutes() < 10 ? "0" : "") + currentTime.getMinutes();
    const meridiem = currentTime.getHours() >= 12 ? 'PM' : 'AM';

    const timeString = `${hours}:${minutes} ${meridiem}`;
    document.getElementById("time").textContent = timeString;
}

setInterval(updateTime, 1000);
updateTime();

const currentDate = new Date();
generateCalendar(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());

window.previousMonth = previousMonth;
window.nextMonth = nextMonth;

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

        let monthIndex = startTime.getMonth();
        if (!(monthIndex in schedule)) {
            schedule[monthIndex] = {};
        }

        let date = startTime.getDate();

        if (!(date in schedule[monthIndex])) {
            schedule[monthIndex][date] = [];
        }

        schedule[monthIndex][date].push(task);
    });
}

async function fetchTasks() {
    let result = await APIConnector.getTasks();

    let tasks = result["tasks"];

    tasks.forEach((task) => {
        tasksInfo[task["task_id"]] = task["task_name"];
    });
}

async function initialize() {
    await fetchSchedule();
    await fetchTasks();
}

await initialize();
