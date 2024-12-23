export const Project = function (title) {
    const tasks = [];

    function getTitle() {
        return title;
    }

    function getTasks() {
        return tasks;
    }

    function setTitle(newTitle) {
        title = newTitle();
    }

    function findTask(title) {
        return tasks.find(task => task.getTitle() === title);
    }

    return { getTitle, getTasks, setTitle, findTask }
}