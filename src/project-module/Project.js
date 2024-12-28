export const Project = function (title) {
    const tasks = [];

    function getTitle() {
        return title;
    }

    function getTasks() {
        return tasks;
    }

    function addTask(task) {
        tasks.push(task);
    }

    function setTitle(newTitle) {
        title = newTitle();
    }

    function findTask(title) {
        return tasks.find(task => task.getTitle() === title);
    }

    function deleteTask(task) {
        const index = tasks.indexOf(task);
        tasks.splice(index, 1);
    }

    function serializeProject() {
        return {title, tasks: tasks.map(task => task.serialize())}
    }
    

    return { getTitle, getTasks, addTask, setTitle, findTask, deleteTask, serializeProject }
}