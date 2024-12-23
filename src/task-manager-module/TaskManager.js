export const TaskManager = (function () {
    const projects = [];

    function getProjects() {
        return projects;
    }

    function addProject(project) {
        projects.push(project);
    }

    function findProject(projectTitle) {
        return projects.find(project => project.getTitle() === projectTitle);
    }

    function findTask(taskName) {
        for (const project of projects) {
            const task = project.getTasks().find((task) => task.getTitle() === taskName);
            if (task) {
                return task; // Return the matching task directly
            }
        }
        return 'task not found'; // Return null if no task is found
    }

    function addTask(task, project) {
        project.getTasks().push(task);
    }
    
    function deleteTask(task, project) {
        const tasks = project.getTasks();
        const index = tasks.findIndex((t) => t.getTitle() === task.getTitle());
        
        console.log('task.getTitle():', task.getTitle());
        console.log('tasks.map => t.getTitle()):', tasks.map((t) => t.getTitle()));
        
        if (index !== -1) {
            project.getTasks().splice(index, 1);
        } else {
            console.log('error');
        }
    }

    return { getProjects, addProject, findProject, findTask, addTask, deleteTask }
})();

