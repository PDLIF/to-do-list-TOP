export const Task = function(title, description, dueDate, priority, project) {
    function getTitle() {
        return title;
    }

    function setTitle(newTitle) {
        title = newTitle;
    }

    function getDescription() {
        return description;
    }

    function setDescription(newDescription) {
        description = newDescription;
    }

    function getDueDate() {
        return dueDate;
    }

    function setDueDate(newDueDate) {
        dueDate = newDueDate;
    }

    function getPriority() {
        return priority;
    }

    function setPriority(newPriority) {
        priority = newPriority;
    }

    function getProject() {
        return project;
    }

    return { getTitle, setTitle, getDescription, setDescription, getDueDate, setDueDate, getPriority, setPriority, getProject }
}