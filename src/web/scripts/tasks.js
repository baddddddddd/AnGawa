const taskInput = document.querySelector(".task-input input");
const taskClicked = document.querySelector(".clicked-card");
const cardHeading = document.querySelector(".task-name");
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".bottom-page .clear-btn"),
taskBox = document.querySelector(".task-box");

// For Calendar
const currentDate = document.querySelector(".current-date");
const deadlineButton = document.querySelector(".deadline-button");
const inputBox = document.querySelector(".input-box[data-placeholder]");
const currentButton = document.getElementById("current");
const openCalendarButton = document.getElementById("openCalendarButton");
daysTag = document.querySelector(".days"),
prevNextIcon = document.querySelectorAll(".icons span");

// For input box -> placeholder
document.addEventListener("DOMContentLoaded", setPlaceholder);

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
let todos = JSON.parse(localStorage.getItem("todo-list")); // getting local storage todo-list
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

// Show all tasks from storage
function showTodo(filter) {
    let li = "";
    if(todos) {
        todos.forEach((todo, id) => {
            // if todo status is completed, set the isCompleted value to checked
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                li += `<li draggable="true" onclick="clickTask(${id})" class="task" data-task-id="${todo.id}">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                        <p class="${isCompleted}"  id="selectedDateDisplay">${todo.name}</p>
                        <span class="date-display">${formatDate(todo.dueDate)}</span>
                    </label>
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
}
showTodo("all");

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

    // Set placeholder
    setPlaceholder();

    // Set content to the saved note or an empty string
    inputBox.innerText = todos[selectedTaskId].note || "";

    // Update note as the user types
    inputBox.addEventListener("input", updateNote);

    // clear placeholder
    inputBox.addEventListener("click", clearPlaceholder);
}

function setPlaceholder() {
    const placeholder = inputBox.getAttribute("data-placeholder");
    if (!inputBox.innerText.trim()) {
        inputBox.innerText = placeholder;
        inputBox.classList.add("placeholder");
    } else {
        inputBox.classList.remove("placeholder");
    }
}

// Update the input event listener for inputBox to handle the placeholder
inputBox.addEventListener("input", () => {
    setPlaceholder();
});

// Update click event listener to handle placeholder
inputBox.addEventListener("click", () => {
    if (inputBox.classList.contains("placeholder")) {
        clearPlaceholder();
    }
    inputBox.focus();
});

function updateNote() {
    todos[selectedTaskId].note = inputBox.innerText;
    setPlaceholder();
}

function clearPlaceholder() {
    inputBox.innerText = "";
    inputBox.classList.remove("placeholder");

    // Remove the input event listener to prevent setting the placeholder on subsequent input
    inputBox.removeEventListener("input", setPlaceholder);

    // Add the input event listener again to handle future input changes
    inputBox.addEventListener("input", setPlaceholder);
}

// Update click event listener for the deadline button to handle the placeholder 
deadlineButton.addEventListener("click", () => {
    openBox();
    setPlaceholder();
});

// for the task to handle the placeholder 
taskBox.addEventListener("click", (event) => {
    const taskElement = event.target.closest(".task");
    if (taskElement) {
        clearPlaceholder();
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

function deleteTask(deleteId) {
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

clearAll.addEventListener("click", () => {
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
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
    localStorage.setItem("todo-list", JSON.stringify(todos));
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
                status: "pending",
                note: "",
                dueDate: null
            };
            todos.push(taskInfo); // add new tasks to todos
        }
        else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo("all");
    }
});

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

            // Find the correct sibling after which the dragged task should be placed
            let sibling = dropTarget.nextSibling;

            // Insert the dragged task before the found sibling
            draggedTask.parentElement.insertBefore(draggedTask, sibling);

            // Remove visual feedback
            dropTarget.classList.remove("drag-over");
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

        console.log(dropIndex);

        // Remove the dragged task from its original position
        taskList.splice(originalIndex, 1);

        // Insert the dragged task at the new position
        taskList.splice(dropIndex, 0, draggedTask);

        // Update the DOM with the new task order
        taskList.forEach((task, index) => {
            draggedTask.parentElement.appendChild(task);
        });

        // Remove visual feedback
        dropTarget.classList.remove("drag-over")
    }

}

function handleDragEnd() {
    // Remove dragging class
    if (draggedTask) {
        draggedTask.classList.remove("dragging");
        console.log("dragging class removed");
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
currYear = date.getFullYear();
currMonth = date.getMonth();
let selectedDate = null;
let firstDayofMonth;

const months = ["January", "February", "March", "April", "May", "Juen", "July",
                "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
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
            todos[selectedTaskId].dueDate = null; // Clear due date in todos array
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

    renderCalendar();
    setPlaceholder();
}

document.getElementById("clear-button").addEventListener("click", clearDueDate);
currentButton.addEventListener("click", setCurrentDate);

inputBox.addEventListener("click", () => {
    clearPlaceholder();
    inputBox.focus();
});