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
        newTask = {id: newId, task: newTask}
        tasks.push(newTask);
        await fs.writeFile(path, JSON.stringify(tasks, null, 2));
        console.log(`Task added successfully (ID:${newId})`);
    } catch (err) {
        console.log("Error adding task:", err);
    }
}

async function updateTask(id, updatedTask, tasks) {
    console.log(updatedTask)
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

(async () => {
    try {

        await ensureFileExists(path);
        const fileData = await fs.readFile(path, 'utf8');
        const tasks = JSON.parse(fileData);

        if (args[0].toLowerCase() == 'add') {
            await addTask(args[1], tasks);
        } else if (args[0].toLowerCase() == 'update') {
            await updateTask(args[1], args[2], tasks);
        }
    } catch (err) {
        console.error("Error reading file:", err);
    }
})();