let currentDate = new Date();

function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

function generateCalendar(day, month, year) {
    const calendarDays = document.getElementById('calendar-days');
    currentDate = new Date(year, month, 1);
    const daysInCurrentMonth = daysInMonth(month, year);
    const firstDayOfMonth = currentDate.getDay();

    calendarDays.innerHTML = '';

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('button');
        emptyDay.id = 'daysButton'
        emptyDay.setAttribute('disabled', true);
        calendarDays.appendChild(emptyDay);
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
        const button = document.createElement('button');
        button.id = 'daysButton';
        button.textContent = i;
        const dayWeek = (firstDayOfMonth + i - 1 + 7) % 7;
        if (dayWeek === 0) { // Modify the button to indicate a task for the selected date.
            button.classList.add('red'); 
        }
        button.addEventListener('click', () => showDayView(i, dayWeek));
        calendarDays.appendChild(button);
        showDayView(i, dayWeek);
    }
}

generateCalendar(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());

function showDayView(selectedDay, dayWeek) {
    const dayTasks = document.getElementById('day-tasks');
    const dayTime = document.getElementById('day-time');
    dayTasks.innerHTML = '';
    dayTime.innerHTML = '';

    for (let i = 1; i <= 3; i++) { // Placeholder for the task list.
        const timeListItem = document.createElement('li');
        timeListItem.textContent = `${i+7}:00 am`;
        dayTime.appendChild(timeListItem);
    }

    for (let i = 1; i <= 3; i++) {
        const taskListItem = document.createElement('li');
        taskListItem.textContent = `Task ${i} on Day ${selectedDay}`;
        dayTasks.appendChild(taskListItem);
    }
    dayWeek = getDayName(dayWeek)
    document.getElementById('day').textContent = `${dayWeek}`;
    document.getElementById('date').textContent = `November ${selectedDay}`;
}

function getDayName(dayIndex) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
}