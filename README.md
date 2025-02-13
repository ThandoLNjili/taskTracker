# Task Tracker

Task Tracker is a simple command-line application for managing tasks. You can add, update, delete, and list tasks, as well as mark them as in-progress or done.

https://roadmap.sh/projects/task-tracker

## Features

- Add a new task
- Update an existing task
- Delete a task
- Mark a task as in-progress or done
- List tasks by status or all tasks

## Installation

1. Clone the repository:
    ```sh
    https://github.com/ThandoLNjili/taskTracker
    ```
2. Navigate to the project directory:
    ```sh
    cd taskTracker
    ```

## Usage

Run the application using the following command:

```sh
node index.js <command> [arguments]
```
Examples
```sh
node index.js add "Buy groceries"
node index.js update 1 "Buy groceries and cook dinner"
node index.js delete 1
node index.js mark-in-progress 2
node index.js mark-done 2
node index.js list
node index.js list done
```