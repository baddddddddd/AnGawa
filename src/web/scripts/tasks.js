import { APIConnector } from "./api_connector.js";


const taskInput = document.querySelector(".task-input input");
const taskClicked = document.querySelector(".clicked-card");
const cardHeading = document.querySelector(".task-name");
let filters = document.querySelectorAll(".filters span");
let clearAll = document.querySelector(".bottom-page .clear-btn");
let taskBox = document.querySelector(".task-box");

// For Calendar
const currentDate = document.querySelector(".current-date");
const deadlineButton = document.querySelector(".deadline-button");
const inputBox = document.querySelector(".input-box");
const currentButton = document.getElementById("current");
const openCalendarButton = document.getElementById("openCalendarButton");
let daysTag = document.querySelector(".days");
let prevNextIcon = document.querySelectorAll(".icons span");

// For difficulty and time duration
const difficultyInput = document.querySelector(".difficulty")
const timeInput = document.querySelector(".minutes");


// For drag and drop
document.addEventListener("dragstart", handleDragStart);
document.addEventListener("dragover", handleDragOver);
document.addEventListener("dragenter", handleDragEnter);
document.addEventListener("dragleave", handleDragLeave);
document.addEventListener("drop", handleDrop);
document.addEventListener("dragend", handleDragEnd);

let draggedTask = null;
let originalIndex = null;

let editId;
let isEditedTask = false;
let todos;// = JSON.parse(localStorage.getItem("todo-list")); // getting local storage todo-list
let selectedCardTask = null;
let selectedTaskId = null;

// Event listener to close the sidebar when clicking outside of it
document.addEventListener("click", (e) => {
    if(!taskClicked.contains(e.target) && !taskBox.contains(e.target)) {
        closeTask();
    }
});

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
        closeTask();
    });
});


async function getTasks() {
    let result = await APIConnector.getTasks();
    let tasks = result["tasks"];

    todos = []
    
    tasks.forEach((task) => {
        let date = new Date(Date.parse(task["deadline"]));
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

        todos.push({
            name: task["task_name"], 
            difficulty: task["fatiguing_level"],
            timeDuration: task["duration"],
            status: task["status"],
            description: task["description"],
            dueDate: date,
            id: task["task_id"],
        });
    });

    console.log(todos);

    saveTodos();
}


// Show all tasks from storage
function showTodo(filter) {
    let li = "";


    if(todos) {
        todos.forEach((todo, id) => {
            
            if (typeof todo.dueDate == "string") {
                todo.dueDate = new Date(todo.dueDate);
            }

            // if todo status is completed, set the isCompleted value to checked
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                li += `<li draggable="true" onclick="clickTask(${id})" class="task" data-task-id="${todo.id}">
                    <div class="task-left">
                        <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                            <p class="${isCompleted}"  id="selectedDateDisplay">${todo.name}</p>
                        </label>
                        <span class="date-display">${formatDate(todo.dueDate)}</span>
                        <span class="time-display" id="timeDisplay-${id}"></span>
                    </div>
                    <div class="settings">
                        <i onclick="showMenu(this)" class='bx bx-dots-horizontal-rounded'></i>
                        <ul class="task-menu">
                            <li onclick="editTask(${id}, '${todo.name}')"><i class='bx bx-edit'></i>Edit</li>
                            <li onclick="deleteTask(${id})"><i class='bx bx-trash'></i>Delete</li>
                        </ul>
                    </div>
                </li>`;
            }
        }); 
    }
    taskBox.innerHTML = li || `<span>You don't have any task here</span>`;

    updateTimeDisplay(); 

}

getTasks().then(() => {
    showTodo("all");
});

function clickTask(taskId) {

    // Get the target element that was clicked
    const clickedElement = event.target;

    // Check if the clicked element is the checkbox, task name, or settings icon
    if (
        clickedElement.type === "checkbox" ||  
        clickedElement.classList.contains('bx-dots-horizontal-rounded') ||
        clickedElement.tagName === "P" // Add this condition for the task name
    ) {
        // Do nothing if the click is on the checkbox, task name, or settings icon
        return;
    }

    if (taskClicked.classList.contains("show")) {
        if (selectedTaskId == taskId) {
            closeTask();
        } else {
            exitTask(() => {
                openTask(taskId);
            });
        }
    } else {
        openTask(taskId);

    }
}

function exitTask(callback) {
    taskClicked.classList.remove("show");
    setTimeout(callback, 300);
}

// ********** Input Box **********
function openTask(taskId) {
    toggleTask();
    setCardHeading(taskId);

    // Reset note when opening a new task
    inputBox.innerText = "";

    selectedTaskId = taskId;

    // Set content to the saved note or an empty string
    inputBox.value = todos[selectedTaskId].description || "";
    difficultyInput.value = todos[selectedTaskId].difficulty;
    timeInput.value = todos[selectedTaskId].timeDuration;
}

// Update the input event listener for inputBox to handle the placeholder
inputBox.oninput = updateDescription;

function updateDescription() {
    if(selectedTaskId !== null) {
        const description = inputBox.value;
        todos[selectedTaskId].description = description;
    }

    saveTodos();
}

// Update click event listener to handle placeholder
inputBox.addEventListener("click", () => {
    inputBox.focus();
});

// Update click event listener for the deadline button to handle the placeholder 
deadlineButton.addEventListener("click", () => {
    openBox();
});

// for the task to handle the placeholder 
taskBox.addEventListener("click", (event) => {
    const taskElement = event.target.closest(".task");
    if (taskElement) {
        inputBox.focus();
    }
});

function setCardHeading(taskId) {
    cardHeading.textContent = todos[taskId].name;
}

function toggleTask() { 
    taskClicked.classList.toggle("show");
}

function closeTask() {
    taskClicked.classList.remove("show");
    closeBox();
}

function showMenu(selectedTask) {
    // get task menu div
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {
        // Remove show class from the task menu on the doc/body click
        if(e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    });
}

function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}

function getOrder() {
    let order = []
    document.querySelectorAll(".task").forEach((element) => {
        let id = element.getAttribute("data-task-id");

        order.push(id);
    });

    return order;
}

document.onclick = updateOrder;

setInterval(updateTasks, 10000);

async function updateTasks() {
    saveTodos();

    await APIConnector.updateTasks(todos);
}

async function updateOrder() {
    let order = getOrder();

    let orderedTodos = [];

    order.forEach((id) => {
        todos.forEach((todo) => {
            if (todo.id == id) {
                orderedTodos.push(todo);
            }
        });
    });

    
    todos = orderedTodos;
}

function deleteTask(deleteId) {
    todos.splice(deleteId, 1);

    return;
    APIConnector.deleteTasks(todos[deleteId].id).then(() => {
        saveTodos();
        showTodo("all");
    });
}

clearAll.addEventListener("click", () => {
    todos.splice(0, todos.length);
    saveTodos();
    showTodo("all");
});

function updateStatus(selectedTask) {
    // paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        // update status of checked task
        todos[selectedTask.id].status = "completed";
    } 
    else {
        taskName.classList.remove("checked");
        // update status of task to pending
        todos[selectedTask.id].status = "pending";
    }
    saveTodos();
}

difficultyInput.oninput = updateDifficulty;
timeInput.oninput = updateTimer;

function updateDifficulty() {
    if(selectedTaskId !== null) {
        const difficulty = difficultyInput.value;
        todos[selectedTaskId].difficulty = difficulty;
    }

    saveTodos();
}

function updateTimer() {
    if(selectedTaskId !== null) {
        const minutes = timeInput.value;
        todos[selectedTaskId].timeDuration = minutes;
    }

    saveTodos();
}


function getNextId() {
    const ids = todos.map(todo => todo.id);

    let minValue = Math.min(...ids);
    minValue = Math.min(0, minValue);


    for (let i = minValue; i < 100; i++) {
        if (!ids.includes(i)) {
            return i;
        }
    }

    return 0;
}

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask) {
        if(!isEditedTask) {
            if(!todos) {
                todos = [];
            }
            let taskInfo = {
                name: userTask, 
                difficulty: "1",
                timeDuration: "60",
                status: "pending",
                description: "",
                dueDate: getTodayMax(),
                id: getNextId(),
            };
            
            todos.push(taskInfo); // add new tasks to todos

            APIConnector.createTask(
                taskInfo.id,
                taskInfo.name,
                taskInfo.description,
                formatDateToYYYYMMDDHHMMSS(taskInfo.dueDate),
                taskInfo.timeDuration,
                taskInfo.difficulty
            ).then();


        }
        else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        saveTodos();
        showTodo("all");
    }
});

function getTodayMax() {
    const currentDate = new Date();

    currentDate.setHours(23, 59, 0, 0);

    return currentDate;
}

function saveTodos() {
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

// Drag and Drop function
function handleDragStart(e) {
    draggedTask = e.target;
    originalIndex = Array.from(draggedTask.parentElement.children).indexOf(draggedTask);

    setTimeout(() => {
        draggedTask.classList.add("dragging");
    }, 0);
}

function handleDragOver(e) {
    e.preventDefault();

    const dropTarget = e.target.closest(".task");
    if(dropTarget && dropTarget !== draggedTask) {
        dropTarget.classList.add("drag-over");
    }
}

function handleDragEnter(e) {
    // Add visual feedback
    e.preventDefault();

    const dropTarget = e.target.closest(".task");

    if (dropTarget && dropTarget !== draggedTask) {
        // Remove the visual feedback class from previous drop targets
        document.querySelectorAll(".task").forEach(task => {
            if (task !== dropTarget) {
                task.classList.remove("drag-over");
            }
        });

        // Add the visual feedback class to the current drop target
        dropTarget.classList.add("drag-over");

        // Move the tasks accordingly
        if (draggedTask) {
            const taskList = Array.from(draggedTask.parentElement.children);

            // Create an array of tasks excluding the dragged task
            const tasksWithoutDragged = taskList.filter(task => task !== draggedTask);

            const dropIndex = tasksWithoutDragged.indexOf(dropTarget);

            let movedTask = todos[dropIndex - 1];

            // Find the correct sibling after which the dragged task should be placed
            let sibling = dropTarget.nextSibling;

            // Insert the dragged task before the found sibling
            draggedTask.parentElement.insertBefore(draggedTask, sibling);

            // Remove visual feedback
            dropTarget.classList.remove("drag-over");

            saveTodos();
        }
    }
}

function handleDragLeave(e) {
    // Remove visual feedback
    const dropTarget = e.target.closest(".task");
    if (dropTarget && dropTarget !== draggedTask) {
        dropTarget.classList.remove("drag-over");
    }
}

function handleDrop(e) {
    e.preventDefault();

    const dropX = e.clientX;
    const dropY = e.clientY;

    // Move dragged task to new position
    const dropTarget = document.elementFromPoint(dropX, dropY);

    if(draggedTask && dropTarget && dropTarget.classList.contains("task")) {
        // Move the dragged task to the new position
        const dropIndex = Array.from(dropTarget.parentElement.children).indexOf(dropTarget);
        const taskList = Array.from(draggedTask.parentElement.children);

        // Remove the dragged task from its original position
        taskList.splice(originalIndex, 1);
        let movedTask = todos[originalIndex];
        todos.splice(originalIndex, 1);

        // Insert the dragged task at the new position
        taskList.splice(dropIndex, 0, draggedTask);
        todos.splice(dropIndex, 0, movedTask);

        // Update the DOM with the new task order
        taskList.forEach((task, index) => {
            draggedTask.parentElement.appendChild(task);
        });

        // Remove visual feedback
        dropTarget.classList.remove("drag-over");

        saveTodos();
    }

}

function handleDragEnd() {
    // Remove dragging class
    if (draggedTask) {
        draggedTask.classList.remove("dragging");
    }
}

// Add due date button function
function openBox() {
    var calendar = document.getElementById("calendar");
    var overlay = document.getElementById("overlay");
    
    if (calendar.style.display === "block") {
      // If the calendar is currently open, close it
      calendar.style.display = "none";
      overlay.style.display = "none";
    } else {
      // If the calendar is currently closed, open it
      calendar.style.display = "block";
      overlay.style.display = "block";
    }
}

// Get new date, current year and month
let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();
let selectedDate = null;
let firstDayofMonth;
let selectedTime;

// Time
document.getElementById("currentTime").addEventListener("input", function (event) {
    selectedTime = event.target.value;
    updateDueDate(selectedTime);
});

function updateDueDate(selectTime) {
    if (selectedTaskId !== null && selectedTime) {
        const [hours, minutes] = selectedTime.split(":");

        // Create a new Date object with the current date and the selected time
        const dueDate = new Date();
        dueDate.setHours(parseInt(hours, 10));
        dueDate.setMinutes(parseInt(minutes, 10));

        // Set the due date in the todos array
        todos[selectedTaskId].dueDate = dueDate;

        // Update the display
        updateTimeDisplay();
    }
}

function updateTimeDisplay() {
    if (todos) {
        todos.forEach((todo, id) => {
            const timeDisplay = document.getElementById(`timeDisplay-${id}`);
            if (timeDisplay) {
                if (todo.dueDate instanceof Date) {
                    const hours = todo.dueDate.getHours();
                    const minutes = todo.dueDate.getMinutes();
                    const amOrPm = hours >= 12 ? 'PM' : 'AM';
                    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
                    const formattedMinutes = minutes.toString().padStart(2, '0');
                    const timeString = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
                    timeDisplay.innerText = timeString;
                } else {
                    timeDisplay.innerText = ""; // Clear the time display if no due date
                }
            }
        });
    }

    saveTodos();
}

function formatDateToYYYYMMDDHHMMSS(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

const months = ["January", "February", "March", "April", "May", "Juen", "July",
                "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    firstDayofMonth = new Date(currYear, currMonth, 1).getDay(); // getting first day of month
    let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(); // getting last date of month
    let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(); // getting last day of month
    let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}" onclick="selectDate(${i})">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
}
renderCalendar();
                
prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});

function selectDate(day) {
    const prevActiveDate = document.querySelector('.days li.active');
    if (prevActiveDate) {
      prevActiveDate.classList.remove('active');
    }

    // Set the clicked date as the active date
    const dayIndex = day + firstDayofMonth;
    console.log(firstDayofMonth);
    const clickedDate = document.querySelector(`.days li:nth-child(${dayIndex})`);
    if (clickedDate) {
      clickedDate.classList.add('active');
    }

    if (selectedTaskId !== null) {
        selectedDate = new Date(currYear, currMonth, day);
        deadlineButton.innerText = formatDate(selectedDate);

        const selectedDateDisplay = document.querySelector('.date-display');
        if (selectedDateDisplay) {
            selectedDateDisplay.innerText = formatDate(selectedDate);
            todos[selectedTaskId].dueDate = selectedDate; // Store due date in todos array
        }

        saveTodos();

        showTodo("all");
    }

}

function formatDate(date) {
    if (date instanceof Date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    } else {
        return ""; // Handle the case where date is undefined
    }
}

function clearDueDate() {
    selectedDate = null;
    deadlineButton.innerText = "Add due date";

    if (selectedTaskId !== null) {
        const selectedDateDisplay = document.querySelector('.date-display');
        if (selectedDateDisplay) {
            selectedDateDisplay.innerText = "";
            todos[selectedTaskId].dueDate = getTodayMax(); // Clear due date in todos array
        }
        showTodo("all");
    }
}

// JavaScript to close the box
function closeBox() {
  document.getElementById("calendar").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

function setCurrentDate() {
    date = new Date();
    currYear = date.getFullYear();
    currMonth = date.getMonth();
    selectedDate = null;
    
    deadlineButton.innerText = formatDate(date);

    if (selectedTaskId !== null) {
        const selectedDateDisplay = document.querySelector('.date-display');
        if (selectedDateDisplay) {
            selectedDateDisplay.innerText = formatDate(date);
            todos[selectedTaskId].dueDate = date; // Store due date in todos array
        }
        showTodo("all");
    }

    selectedTime = null;

    renderCalendar();
}

document.getElementById("clear-button").addEventListener("click", clearDueDate);
currentButton.addEventListener("click", setCurrentDate);

inputBox.addEventListener("click", () => {
    inputBox.focus();
});

document.querySelector("#generate-btn").onclick = () => {
    updateTasks().then(() => {
        document.location.href = "./schedule.html";
    });
};

window.clickTask = clickTask;
window.updateStatus = updateStatus;
window.showMenu = showMenu;
window.deleteTask = deleteTask;
window.editTask = editTask;
window.selectDate = selectDate;