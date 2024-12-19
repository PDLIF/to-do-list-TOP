export const TaskManager = (function () {
    const projects = [];

    function getProjects() {
        return projects;
    }

    function addProject(project) {
        projects.push(project);
    }

    function addTask(task, project) {
        project.getTasks().push(task);
    }
    
    function deleteTask(task, project) {
        const index = project.getTasks().indexOf(task);
        if (index !== -1) {
            project.getTasks().splice(index, 1);
        } else {
            console.log('error');
        }
    }

    return { getProjects, addProject, addTask, deleteTask }
})();

