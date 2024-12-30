import { Task } from '../task-module/Task'
import { Project } from '../project-module/Project'
import { TaskManager } from '../task-manager-module/TaskManager'
import { DOMController } from '../dom-controller-module/DOMController'

export const App = (function () {
    function initialize() {
        const allProjects = TaskManager.getAllProjects();
        const defaultProject = Project('Default Project');
        const newProject = Project('New Project');
        const testTask = Task("Sample Task", "Hey there! I'm a sample task created specifically for demonstrating that the functionality works as expected.", "2024-12-20", "Low", defaultProject);

        TaskManager.addProject(defaultProject);
        TaskManager.addProject(newProject);
        TaskManager.addTask(testTask, defaultProject);

        DOMController.renderTasks(defaultProject.getTasks());
        DOMController.renderProjects(allProjects);
        DOMController.updateProjectDropdown(TaskManager.getAllProjects());
    }
    
    return { initialize }
})();