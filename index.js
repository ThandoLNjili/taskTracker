#!/usr/bin/env node

const fs = require("fs").promises;
const FILE_PATH = 'tasks.json';
const USER_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
const [command, ...args] = process.argv.slice(2);

/**
 * Ensures the tasks file exists, creates it if it doesn't.
 * @param {string} path - The path to the tasks file.
 */
async function ensureFileExists(path) {
    try {
        await fs.access(path);
    } catch {
        await fs.writeFile(path, JSON.stringify([], null, 2));
        console.log(`Created new file: ${path}`);
    }
}

/**
 * Adds a new task to the tasks list.
 * @param {string} newTask - The task description.
 * @param {Array} tasks - The current list of tasks.
 */
async function addTask(newTask, tasks) {
    try {
        const newId = tasks.length > 0 ? Math.max(...tasks.map(item => item.id)) + 1 : 1;
        const task = {
            id: newId,
            task: newTask,
            status: 'todo',
            createdAt: new Date().toLocaleString("en-US", { timeZone: USER_TIME_ZONE })
        };

        tasks.push(task);
        await fs.writeFile(FILE_PATH, JSON.stringify(tasks, null, 2));
        console.log(`Task added successfully (ID:${newId})`);
    } catch (err) {
        handleError("adding task", err);
    }
}

/**
 * Updates an existing task.
 * @param {number} id - The ID of the task to update.
 * @param {string} updatedTask - The updated task description.
 * @param {Array} tasks - The current list of tasks.
 */
async function updateTask(id, updatedTask, tasks) {
    try {
        const taskIndex = tasks.findIndex(task => task.id == id);

        if (taskIndex === -1) {
            console.log(`Task with ID ${id} not found.`);
            return;
        }

        tasks[taskIndex].task = updatedTask;
        tasks[taskIndex].updatedAt = new Date().toLocaleString("en-US", { timeZone: USER_TIME_ZONE });
        await fs.writeFile(FILE_PATH, JSON.stringify(tasks, null, 2));
        console.log("Task updated successfully!");
    } catch (err) {
        handleError("updating task", err);
    }
}

/**
 * Deletes a task from the tasks list.
 * @param {number} id - The ID of the task to delete.
 * @param {Array} tasks - The current list of tasks.
 */
async function deleteTask(id, tasks) {
    try {
        const updatedTasks = tasks.filter(task => task.id != id);

        if (updatedTasks.length === tasks.length) {
            console.log(`Task with ID ${id} not found.`);
            return;
        }

        await fs.writeFile(FILE_PATH, JSON.stringify(updatedTasks, null, 2));
        console.log(`Task ${id} removed successfully!`);
    } catch (err) {
        handleError("removing task", err);
    }
}

/**
 * Updates the status of a task.
 * @param {number} id - The ID of the task to update.
 * @param {string} cmd - The command to update the status.
 * @param {Array} tasks - The current list of tasks.
 */
async function updateTaskStatus(id, cmd, tasks) {
    try {
        const taskIndex = tasks.findIndex(task => task.id == id);

        if (taskIndex === -1) {
            console.log(`Task with ID ${id} not found.`);
            return;
        }
        
        const status = cmd === 'mark-done' ? 'done' : 'in-progress';
        tasks[taskIndex].status = status;
        tasks[taskIndex].updatedAt = new Date().toLocaleString("en-US", { timeZone: USER_TIME_ZONE });
        await fs.writeFile(FILE_PATH, JSON.stringify(tasks, null, 2));
        console.log(`Task ${id} status updated successfully.`);
    } catch (err) {
        handleError("updating status", err);
    }
}

/**
 * Lists tasks, optionally filtered by status.
 * @param {Array} tasks - The current list of tasks.
 * @param {string} [status] - The status to filter tasks by.
 */
function listTasks(tasks, status) {
    try {
        if (tasks.length === 0) {
            console.log("No tasks available.");
            return;
        }

        const filteredTasks = status ? tasks.filter(task => task.status === status) : tasks;
        filteredTasks.forEach(task => {
            console.log(`ID: ${task.id}, Task: ${task.task}, Status: ${task.status}`);
        });
    } catch (err) {
        handleError("listing tasks", err);
    }
}

/**
 * Handles errors by logging them to the console.
 * @param {string} action - The action being performed when the error occurred.
 * @param {Error} err - The error object.
 */
function handleError(action, err) {
    console.error(`Error ${action}:`, err);
}

(async () => {
    try {
        await ensureFileExists(FILE_PATH);
        const fileData = await fs.readFile(FILE_PATH, 'utf8');
        const tasks = JSON.parse(fileData);

        switch (command) {
            case 'add':
                await addTask(args[0], tasks);
                break;
            case 'update':
                await updateTask(args[0], args[1], tasks);
                break;
            case 'delete':
                await deleteTask(args[0], tasks);
                break;
            case 'mark-in-progress':
            case 'mark-done':
                await updateTaskStatus(args[0], command, tasks);
                break;
            case 'list':
                listTasks(tasks, args[0]);
                break;
            default:
                console.log(`Command "${command}" is unknown.`);
        }
    } catch (err) {
        handleError("reading file", err);
    }
})();