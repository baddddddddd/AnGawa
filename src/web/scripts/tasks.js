const taskInput = document.querySelector(".task-input input");
const taskClicked = document.querySelector(".clicked-card");
const cardHeading = document.querySelector(".task-name");
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".bottom-page .clear-btn"),
taskBox = document.querySelector(".task-box");

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
                li += `<li draggable="true" onclick="clickTask(${id})" class="task">
                    <label for="${id}">
                        <img src="../drag.png" class="drag"></img>
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                        <p class="${isCompleted}">${todo.name}</p>
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
    if(taskClicked.classList.contains("show")) {
        if(selectedTaskId == taskId) {
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

function openTask(taskId) {
    toggleTask();
    setCardHeading(taskId);
    selectedTaskId = taskId;
}

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
            let taskInfo = {name: userTask, status: "pending"};
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
            const dropIndex = taskList.indexOf(dropTarget);

            console.log(dropTarget);

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