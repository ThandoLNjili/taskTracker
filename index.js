#!/usr/bin/env node

const fs = require("fs").promises;
const path = 'tasks.json';
const args = process.argv.slice(2);

async function ensureFileExists(path) {
    try {
        await fs.access(path);
    } catch {
        await fs.writeFile(path, JSON.stringify([], null, 2));
        console.log(`Created new file: ${filePath}`);
    }
}

async function addTask(newTask, tasks) {
    try {
        const newId = tasks.length > 0 ? Math.max(...tasks.map(item => item.id)) + 1 : 1;
        newTask = {id: newId, task: newTask, status: 'todo'}
        tasks.push(newTask);
        await fs.writeFile(path, JSON.stringify(tasks, null, 2));
        console.log(`Task added successfully (ID:${newId})`);
    } catch (err) {
        console.log("Error adding task:", err);
    }
}

async function updateTask(id, updatedTask, tasks) {
    try {
        const taskIndex = tasks.findIndex(task => task.id == id);
        
        if (taskIndex === -1) {
            console.log(`Task with ID ${id} not found.`);
            return;
        }

        tasks[taskIndex].task = updatedTask;
        await fs.writeFile(path, JSON.stringify(tasks, null, 2));
        console.log("Task updated successfully!");    
    } catch (err) {
        console.log("Error updating task:", err);
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
        }
        
        const status = cmd == 'mark-done'? 'done' : 'in-progress';
        tasks[taskIndex]['status'] = status;
        console.log(tasks);
        await fs.writeFile(path, JSON.stringify(tasks, null, 2));;
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

        switch (status) {
            case 'done':
                const doneTasks = tasks.filter(task => task.status == status);
                doneTasks.forEach(task => {
                    console.log(`ID: ${task.id}, Task: ${task.task}, Status: ${task.status}`);
                });
                break;
            case 'todo':
                const todoTasks = tasks.filter(task => task.status == status);
                todoTasks.forEach(task => {
                    console.log(`ID: ${task.id}, Task: ${task.task}, Status: ${task.status}`);
                });
                break;
            case 'in-progress':
                const inProgressTasks = tasks.filter(task => task.status == status);
                inProgressTasks.forEach(task => {
                    console.log(`ID: ${task.id}, Task: ${task.task}, Status: ${task.status}`);
                });
                break;
            default:
                tasks.forEach(task => {
                    console.log(`ID: ${task.id}, Task: ${task.task}, Status: ${task.status}` );
                });
        }
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
                if (args[1]) listTasks(tasks, args[1]); 
                else listTasks(tasks);
                break;
            default:
                console.log(`Command "${command}" is unknown.`)
        }
    } catch (err) {
        console.error("Error reading file:", err);
    }
})();