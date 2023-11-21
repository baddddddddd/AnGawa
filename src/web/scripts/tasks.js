const taskInput = document.querySelector(".task-input input");
const taskClicked = document.querySelector(".clicked-card");
const cardHeading = document.querySelector(".task-name");
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".bottom-page .clear-btn"),
taskBox = document.querySelector(".task-box");

let editId;
let isEditedTask = false;
let todos = JSON.parse(localStorage.getItem("todo-list")); // getting local storage todo-list
let selectedCardTask = null;

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
                li += `<li onclick="clickTask(${id})" class="task">
                    <label for="${id}">
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
    console.log(taskId);
    if(taskClicked.classList.contains("show")) {
        closeTask();
    }
    else {
        toggleTask();
        cardHeading.textContent = todos[taskId].name;
    }
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