import { Task } from '../task-module/Task.js'
import { Project } from '../project-module/Project.js'
import { TaskManager } from '../task-manager-module/TaskManager.js'
import { DOMController } from '../dom-controller-module/DOMController.js'

export const App = (function () {
    function initialize() {
        const allProjects = TaskManager.getAllProjects();
        const defaultProject = Project('Default Project');
        const newProject = Project('New Project');
        const testTask = Task("Sample Task", "Hey there! I'm a sample task created specifically for demonstrating that the functionality works as expected.", "2024-12-20", "Low", defaultProject);

        TaskManager.addProject(defaultProject);
        TaskManager.addProject(newProject);
        TaskManager.addTask(testTask, defaultProject);

        DOMController.renderTasks(TaskManager.getAllTasks());
        DOMController.renderProjects(allProjects);
        DOMController.updateProjectDropdown(TaskManager.getAllProjects());
    }
    
    return { initialize }
})();