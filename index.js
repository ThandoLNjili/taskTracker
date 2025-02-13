#!/usr/bin/env node

const fs = require("fs").promises;
const path = 'tasks.json';
const args = process.argv.slice(2);

async function ensureFileExists(path) {
    try {
        await fs.access(path);
    } catch {
        await fs.writeFile(path, JSON.stringify([], null, 2));
        console.log(`Created new file: ${path}`);
    }
}

async function addTask(newTask, tasks) {
    try {
        const newId = tasks.length > 0 ? Math.max(...tasks.map(item => item.id)) + 1 : 1;
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        newTask = {
            id: newId, 
            task: newTask, 
            status: 'todo',
            createdAt: new Date().toLocaleString("en-US", { timeZone: userTimeZone })
        };

        tasks.push(newTask);
        await fs.writeFile(path, JSON.stringify(tasks, null, 2));
        console.log(`Task added successfully (ID:${newId})`);
    } catch (err) {
        console.error("Error adding task:", err);
    }
}

async function updateTask(id, updatedTask, tasks) {
    try {
        const taskIndex = tasks.findIndex(task => task.id == id);
        
        if (taskIndex === -1) {
            console.log(`Task with ID ${id} not found.`);
            return;
        }

        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        tasks[taskIndex].task = updatedTask;
        tasks[taskIndex].updatedAt = new Date().toLocaleString("en-US", { timeZone: userTimeZone });
        await fs.writeFile(path, JSON.stringify(tasks, null, 2));
        console.log("Task updated successfully!");    
    } catch (err) {
        console.error("Error updating task:", err);
    }
}

async function deleteTask(id, tasks) {
    try {
        const updatedTasks = tasks.filter(task => task.id != id);

        if (updatedTasks.length === tasks.length) {
            console.log(`Task with ID ${id} not found.`);
            return;
        }

        await fs.writeFile(path, JSON.stringify(updatedTasks, null, 2));
        console.log(`Task ${id} removed successfully!`);
    } catch (err) {
        console.error("Error removing task:", err);
    }
}

async function updateTaskStatus(id, cmd, tasks) {
    try {
        const taskIndex = tasks.findIndex(task => task.id == id);

        if (taskIndex === -1) {
            console.log(`Task with ID ${id} not found.`);
            return;
        }
        
        const status = cmd == 'mark-done' ? 'done' : 'in-progress';
        tasks[taskIndex].status = status;
        await fs.writeFile(path, JSON.stringify(tasks, null, 2));
        console.log(`Task ${id} status updated successfully.`);
    } catch (err) {
        console.error("Error updating status:", err);
    }
}

function listTasks(tasks, status) {
    try {
        if (tasks.length === 0) {
            console.log("No tasks available.");
            return;
        }

        const filteredTasks = status ? tasks.filter(task => task.status == status) : tasks;
        filteredTasks.forEach(task => {
            console.log(`ID: ${task.id}, Task: ${task.task}, Status: ${task.status}`);
        });
    } catch (err) {
        console.error("Error listing tasks:", err);
    }
}

(async () => {
    try {
        await ensureFileExists(path);
        const fileData = await fs.readFile(path, 'utf8');
        const tasks = JSON.parse(fileData);
        const command = args[0].toLowerCase();

        switch (command) {
            case 'add':
                await addTask(args[1], tasks);
                break;
            case 'update':
                await updateTask(args[1], args[2], tasks);
                break;
            case 'delete':
                await deleteTask(args[1], tasks);
                break;
            case 'mark-in-progress':
            case 'mark-done':
                await updateTaskStatus(args[1], args[0], tasks);
                break;
            case 'list':
                listTasks(tasks, args[1]);
                break;
            default:
                console.log(`Command "${command}" is unknown.`);
        }
    } catch (err) {
        console.error("Error reading file:", err);
    }
})();