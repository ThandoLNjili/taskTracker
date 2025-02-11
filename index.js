#!/usr/bin/env node

const fs = require("fs");
const path = 'tasks.json';
const args = process.argv.slice(2);

let data = [];

if (fs.existsSync(path)) {
    data = JSON.parse(fs.readFileSync(path, "utf8"));
}

const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;

function addTask(newId, newTask){
    let task = {id: newId, task: newTask}
    data.push(task);
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log(`Task added successfully (ID:${newId})`);
}

if (args[0].toLowerCase() == 'add') {
    addTask(newId, args[1])
}