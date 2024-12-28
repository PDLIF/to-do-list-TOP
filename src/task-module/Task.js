export const Task = function(title, description, dueDate, priority, project, isImportant) {
    
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

    function setProject(newProject) {
        project = newProject;
    }

    function serialize() {
        return {title, description, dueDate, priority, project, isImportant}
    }

    function getIsImportant() {
        return isImportant;
    }

    function setIsImportant(value) {
        isImportant = value;
    }

    return { getTitle, setTitle, getDescription, setDescription, getDueDate, setDueDate, getPriority, setPriority, getProject, setProject, getIsImportant, setIsImportant, serialize }
}