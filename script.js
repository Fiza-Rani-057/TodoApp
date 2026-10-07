const { createClient } = supabase;
const supabaseURL = 'https://fyitjrqdacpgpoehmrfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5aXRqcnFkYWNwZ3BvZWhtcmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNDUyMTAsImV4cCI6MjEwNTcyMTIxMH0.EHa1IEnDniSB1y_bDpZq2ycI64pqukv8Y_DpGz-aLVg';
const supabaseClient = createClient(supabaseURL, supabaseKey);

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = [];
// Display all tasks

// ADD TASK
async function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const { error } = await supabaseClient
        .from("todoapp")
        .insert({
            text: text,
            iscompleted: false
        });

    if (error) {
        console.error(error);
        alert("Task add nahi hui!");
        return;
    }

    taskInput.value = "";

    displayTasks();
}

async function getTodo() {
    const { data, error } = await supabaseClient
        .from('todoapp')
        .select('*');
    if (error) {
        console.log('there is an error', error);
    }

    tasks = data;
    displayTasks();
}
getTodo();

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "task";

        if (task.iscompleted) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span class="task-text">${task.text}</span>

            <div class="task-buttons">
                <button class="complete-btn" onclick="completeTask(${index})">
                    ${task.iscompleted ? "Undo" : "Done"}
                </button>

                <button class="edit-btn" onclick="editTask(${index})">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteTask(${index})">
                    Delete
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });

    updateStats();

    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";
}

    updateStats();
    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";



// COMPLETE / UNDO TASK
function completeTask(index) {
    tasks[index].completed = !tasks[index].completed;

    displayTasks();
}


// EDIT TASK
function editTask(index) {
    const newText = prompt("Edit your task:", tasks[index].text);

    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();

        displayTasks();
    }
}


// DELETE TASK
function deleteTask(index) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
        tasks.splice(index, 1);

        displayTasks();
    }
}


// UPDATE TASK COUNTERS
function updateStats() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.iscompleted
    ).length;

    const remaining = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    remainingTasks.textContent = remaining;
}


// ADD BUTTON
addBtn.addEventListener("click", addTask);


// ADD TASK WITH ENTER KEY
taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});


// SHOW TASKS WHEN PAGE LOADS
displayTasks();