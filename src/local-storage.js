// import { TaskManager } from "../task-manager-module/TaskManager";
// import { Project } from '../project-module/Project';
// import { Task } from '../task-module/Task';

export const LocalStorageManager = (function() {
    function saveToLocalStorage() {
        const projects = TaskManager.getAllProjects(); // Assuming TaskManager holds your projects and tasks.
        const serializedData = JSON.stringify(projects); // Convert to JSON string.
        localStorage.setItem('todoAppData', serializedData); // Save to localStorage.
    }

    function loadFromLocalStorage() {
        const data = localStorage.getItem('todoAppData'); // Get data from localStorage.
        if (!data) return; // If no data is saved, exit.
    
        const parsedData = JSON.parse(data); // Convert JSON string to objects.
    
        parsedData.forEach(projectData => {
            const project = Project(projectData.title); // Create a Project instance.
            
            projectData.tasks.forEach(taskData => {
                const task = Task(
                    taskData.title,
                    taskData.description,
                    taskData.dueDate,
                    taskData.priority,
                    project
                ); // Create a Task instance.
                project.addTask(task); // Add task to the project.
            });
    
            TaskManager.addProject(project); // Add project to TaskManager.
        });
    }

    return { saveToLocalStorage, loadFromLocalStorage }
})();