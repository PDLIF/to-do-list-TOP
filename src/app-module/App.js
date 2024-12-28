import { Task } from '../task-module/Task'
import { Project } from '../project-module/Project'
import { TaskManager } from '../task-manager-module/TaskManager'
import { DOMController } from '../dom-controller-module/DOMController'

export const App = (function () {
    function initialize() {
        const allProjects = TaskManager.getAllProjects();
        const defaultProject = Project('Default Project');
        const newProject = Project('New Project');
        const testTask = Task("Sample Task", "A project with this title already exists. Please choose a different title.A project with this title already exists. Please choose a different title.", "2024-12-20", "High", defaultProject);

        TaskManager.addProject(defaultProject);
        TaskManager.addProject(newProject);
        TaskManager.addTask(testTask, defaultProject);

        DOMController.renderTasks(defaultProject.getTasks());
        DOMController.renderProjects(allProjects);
        DOMController.updateProjectDropdown(TaskManager.getAllProjects());
    }
    
    return { initialize }
})();