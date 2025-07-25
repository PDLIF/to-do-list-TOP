import { Task } from '../task-module/Task.js';
import { Project } from '../project-module/Project.js';
import { TaskManager } from '../task-manager-module/TaskManager.js';
import { DOMRenderer } from '../dom-renderer/DOMRenderer.js';

export const App = (function () {
    function initialize() {
        const allProjects = TaskManager.getAllProjects();
        const defaultProject = Project('Default Project');
        const newProject = Project('New Project');
        const testTask = Task("Sample Task", "Hey there! I'm a sample task created specifically for demonstrating that the functionality works as expected.", "2024-12-20", "Low", defaultProject);

        TaskManager.addProject(defaultProject);
        TaskManager.addProject(newProject);
        TaskManager.addTask(testTask, defaultProject);

        DOMRenderer.renderTasks(TaskManager.getAllTasks());
        DOMRenderer.renderProjects(allProjects);
        DOMRenderer.updateProjectDropdown(TaskManager.getAllProjects());
    }
    
    return { initialize }
})();