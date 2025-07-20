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

    function clearImportantTasks() {
        importantTasks.splice(0, importantTasks.length);
    }
    
    function getImportantTasks() {
        return importantTasks;
    }

    function addProject(project) {
        allProjects.push(project);
        
        const projectTasks = project.getTasks();
        projectTasks.forEach(task => allTasks.push(task));
    }

    function addTaskToAll(task) {
        allTasks.push(task)
    }
    
    function addTask(task, project) {
        project.getTasks().push(task);
    }

    function addImportantTask(task) {
        importantTasks.push(task);
        task.setIsImportant(true);
    }

    function deleteTask(task, project) {
        const tasks = project.getTasks();
        const index = tasks.findIndex((t) => t.getTitle() === task.getTitle());
        
        if (index !== -1) {
            tasks.splice(index, 1);

            // Also remove from allTasks
            const allTaskIndex = allTasks.findIndex(t => t.getTitle() === task.getTitle());
            if (allTaskIndex !== -1) {
                allTasks.splice(allTaskIndex, 1);
            }
        } else {
            throw new Error("Task or Project not found");
        }
    }

    function deleteImportantTask(task) {
        const index = importantTasks.findIndex((t) => t.getTitle() === task.getTitle());

        importantTasks.splice(index, 1);
        task.setIsImportant(false);
    }

    function toggleImportant(task) {
        const isImportant = task.getIsImportant();

        if (isImportant === false) {
          // Task is not in favourites, add it
          task.setIsImportant(true);
          TaskManager.addImportantTask(task);
        } else {
          // Task is already in favourites, remove it
          task.setIsImportant(false);
          TaskManager.deleteImportantTask(task);
        }
    }

    function updateTask(task, updates) {
        const oldProject = task.getProject();
        oldProject.deleteTask(task);
        const newProject = TaskManager.findProject(updates.project.getTitle());
        
        if (newProject === "project not found") throw new Error("Project Not Found");
    
        task.setTitle(updates.title);
        task.setDescription(updates.description);
        task.setDueDate(updates.dueDate);
        task.setPriority(updates.priority);
        task.setProject(newProject);
    
        addTask(task, newProject);
    
        return task;
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

    function deleteProject(projectTitle) {
        const projectToDelete = findProject(projectTitle);

        const projectTasks = projectToDelete.getTasks();
        projectTasks.forEach(task => deleteTask(task, projectToDelete));

        const projectToDeleteIndex = allProjects.findIndex((p) => p.getTitle() === projectToDelete.getTitle());
        allProjects.splice(projectToDeleteIndex, 1);
    }

    function findProject(projectTitle) {
        const wantedProject = allProjects.find(project => project.getTitle() === projectTitle);
        if (wantedProject) {
            return wantedProject;
        }
        return 'project not found';
    }

    return {
        getAllProjects,
        getAllTasks,
        getImportantTasks,
        addProject,
        addTask,
        clearAllTasks,
        clearAllProjects,
        clearImportantTasks,
        addImportantTask,
        deleteProject,
        deleteTask,
        deleteImportantTask,
        updateTask,
        findProject,
        findTask,
        isImportant,
        addTaskToAll,
        toggleImportant,
    }
})();

