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

    return { getTitle, getTasks, setTitle }
}