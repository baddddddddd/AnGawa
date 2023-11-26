const getDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const getMonthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

function showDayView(selectedDay, dayWeek, month) {
    const dayTasks = document.getElementById('day-tasks');
    const dayTime = document.getElementById('day-time');
    dayTasks.innerHTML = '';
    dayTime.innerHTML = '';

    for (let i = 1; i <= 3; i++) { // Modify this to show the real task list
        const timeListItem = createElement('li', '', `${i + 7}:00 am`);
        dayTime.appendChild(timeListItem);

        const taskListItem = createElement('li', '', `Task ${i} on Day ${selectedDay}`);
        dayTasks.appendChild(taskListItem);
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
