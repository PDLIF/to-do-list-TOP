export const TaskManager = (function () {
    const allTasks = [];
    const allProjects = [];
    const importantTasks = [];

    allProjects.forEach(project => {
        const projectTasks = project.getTasks();
        projectTasks.forEach(task => {
            allTasks.push(task);
        })
    })

    function getAllProjects() {
        return allProjects;
    }

    function getAllTasks() {
        return allTasks;
    }

    function clearAllTasks() {
        allTasks.splice(0, allTasks.length);
    }

    function clearAllProjects() {
        allProjects.splice(0, allProjects.length);
    }
    
    function getImportantTasks() {
        return importantTasks;
    }

    function addProject(project) {
        allProjects.push(project);
        
        const projectTasks = project.getTasks();
        projectTasks.forEach(task => allTasks.push(task));
    }

    function addTask(task, project) {
        project.getTasks().push(task);
    }

    function addImportantTask(task) {
        importantTasks.push(task);
    }

    function deleteTask(task, project) {
        const tasks = project.getTasks();
        const index = tasks.findIndex((t) => t.getTitle() === task.getTitle());
        
        if (index !== -1) {
            project.getTasks().splice(index, 1);
        } else {
            console.log('error');
        }
    }

    function deleteImportantTask(task) {
        const index = importantTasks.findIndex((t) => t.getTitle() === task.getTitle());

        if (index !== -1) {
            importantTasks.splice(index, 1);
        } else {
            console.log('error');
        }
    }

    function findProject(projectTitle) {
        return allProjects.find(project => project.getTitle() === projectTitle);
    }

    function findTask(taskName) {
        for (const project of allProjects) {
            const task = project.getTasks().find((task) => task.getTitle() === taskName);
            if (task) {
                return task; // Return the matching task directly
            }
        }
        return 'task not found'; // Return null if no task is found
    }

    function isImportant(task) {
        return importantTasks.some(t => t.getTitle() === task.getTitle());
    }

    return { getAllProjects, getAllTasks, getImportantTasks, addProject, addTask, clearAllTasks, clearAllProjects, addImportantTask, deleteTask, deleteImportantTask, findProject, findTask, isImportant }
})();

