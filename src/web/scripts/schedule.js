let currentDate = new Date();

function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

function generateCalendar(day, month, year) {
    showWeekView(day, month, year);
    const calendarDays = document.getElementById('calendar-days');
    currentDate = new Date(year, month, 1);
    const daysInCurrentMonth = daysInMonth(month, year);
    const firstDayOfMonth = currentDate.getDay();

    calendarDays.innerHTML = '';

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('button');
        emptyDay.setAttribute('disabled', true);
        calendarDays.appendChild(emptyDay);
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
        const button = document.createElement('button');
        button.id = 'daysButton';
        button.textContent = i;
        if (i % 5 === 0) {
            button.classList.add('task-day');
        }
        button.addEventListener('click', () => showWeekView(i, month, year));
        calendarDays.appendChild(button);
    }
}

function showWeekView(selectedDay, month, year) {
    const weekDays = document.getElementById('week-days');
    weekDays.innerHTML = '';
    const weekTasks = document.getElementById('week-tasks');
    weekTasks.innerHTML = '';
    let firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = daysInMonth(year, month);
    
    if (firstDayOfMonth < 0) { 
        firstDayOfMonth = firstDayOfMonth - daysInCurrentMonth; 
    }
    
    const week = Math.floor((firstDayOfMonth + selectedDay - 1) / 7);
    const dayWeek = (firstDayOfMonth + selectedDay - 1 + 7) % 7;
    const startingDay = week * 7;

    for (let i = 0; i < 7; i++) {
        const dayIndex = startingDay + i - 2;
        const dayName = document.createElement('li');
        dayName.textContent = getDayName(i);
        weekDays.appendChild(dayName);

        const listItem = document.createElement('li');
        listItem.textContent = `Task for Day ${getDayInMonth(dayIndex, daysInCurrentMonth)}`;
        weekTasks.appendChild(listItem);
    }
    document.getElementById('weekNumber').textContent = `Week ${week+1} of November`;
    showDayView(selectedDay, dayWeek);
}

function showDayView(selectedDay, dayWeek) {
    const dayTasks = document.getElementById('day-tasks');
    const dayTime = document.getElementById('day-time');
    dayTasks.innerHTML = '';
    dayTime.innerHTML = '';

    for (let i = 1; i <= 3; i++) {
        const timeListItem = document.createElement('li');
        timeListItem.textContent = `Time ${i} for Day ${selectedDay}`;
        dayTime.appendChild(timeListItem);
    }

    for (let i = 1; i <= 3; i++) {
        const taskListItem = document.createElement('li');
        taskListItem.textContent = `Task ${i} on Day ${selectedDay}`;
        dayTasks.appendChild(taskListItem);
    }

    const dayName = getDayNameCom(dayWeek);
    document.getElementById('curDate').textContent = `November ${selectedDay}, 2023 - ${dayName}`;
}

function getDayNameCom(dayIndex) {
    const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return daysOfWeek[dayIndex];
}

function getDayName(dayIndex) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return daysOfWeek[dayIndex];
}

function getDayInMonth(day, daysInMonth) {
    return (day <= 0) ? daysInMonth + day : (day > daysInMonth) ? day - daysInMonth : day;
}

generateCalendar(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());
