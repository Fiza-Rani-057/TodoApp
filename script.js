const { createClient } = supabase;

const supabaseURL = 'https://fyitjrqdacpgpoehmrfn.supabase.co';

const supabaseKey = 'YOUR_SUPABASE_KEY';

const supabaseClient = createClient(supabaseURL, supabaseKey);

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = [];

// GET TASKS

async function getTodo() {
    const { data, error } = await supabaseClient
        .from("todoapp")
        .select("*");

    if (error) {
        console.log("There is an error:", error);
        return;
    }

    tasks = data;
    displayTasks();
}

getTodo();

// DISPLAY TASKS

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

    getTodo();
}

// COMPLETE / UNDO TASK

async function completeTask(index) {

    const task = tasks[index];

    const { error } = await supabaseClient
        .from("todoapp")
        .update({
            iscompleted: !task.iscompleted
        })
        .eq("id", task.id);

    if (error) {
        console.error(error);
        return;
    }

    getTodo();
}

// EDIT TASK

async function editTask(index) {

    const newText = prompt(
        "Edit your task:",
        tasks[index].text
    );

    if (newText !== null && newText.trim() !== "") {

        const { error } = await supabaseClient
            .from("todoapp")
            .update({
                text: newText.trim()
            })
            .eq("id", tasks[index].id);

        if (error) {
            console.error(error);
            return;
        }

        getTodo();
    }
}

// DELETE TASK

async function deleteTask(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {

        const { error } = await supabaseClient
            .from("todoapp")
            .delete()
            .eq("id", tasks[index].id);

        if (error) {
            console.error(error);
            return;
        }

        getTodo();
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
