import { Task } from '../task-module/Task'
import { Project } from '../project-module/Project'
import { TaskManager } from '../task-manager-module/TaskManager'
import { DOMController } from '../dom-controller-module/DOMController'

export const App = (function () {
    function initialize() {
        const allProjects = TaskManager.getProjects();
        const defaultProject = Project('Default Project');
        const newProject = Project('New Project');
        TaskManager.addProject(defaultProject);
        TaskManager.addProject(newProject);
        const testTask = Task("Sample Task", "Description", "2024-12-20", "High", defaultProject.getTitle());
        TaskManager.addTask(testTask, defaultProject);
        DOMController.renderTasks(defaultProject.getTasks());
        DOMController.renderProjects(allProjects);
        DOMController.updateProjectDropdown(TaskManager.getProjects());

        document.querySelector('.add-project-btn').addEventListener('click', (event) => {
            event.preventDefault();

            const title = document.querySelector('.project-title-input').value;

            const existingProject = TaskManager.getProjects().find(project => project.getTitle() === title);

            if (existingProject) {
                alert('A project with this title already exists. Please choose a different title.');
                return;
            }
            
            const project = Project(title);
            TaskManager.addProject(project);
            
            DOMController.renderProjects(TaskManager.getProjects());
            DOMController.updateProjectDropdown(TaskManager.getProjects());
        });

        document.querySelector('.add-task-btn').addEventListener('click', (event) => {
            event.preventDefault();
            
            const projects = TaskManager.getProjects();
            const title = document.querySelector('.task-title-input').value;
            const description = document.querySelector('.description-input').value;
            const dueDate = document.querySelector('.due-date').value;
            const priority = document.querySelector('.priority').value;
            const selectedProjectTitle = document.querySelector('.project-select').value;

            const task = Task(title, description, dueDate, priority);

            const selectedProject = TaskManager.getProjects().find(project => project.getTitle() === selectedProjectTitle);

            if (selectedProject) {
                TaskManager.addTask(task, selectedProject);

                DOMController.renderAllTasks(projects);
                
                // DOMController.renderTasks(selectedProject.getTasks());
            } else {
                console.log('ERROR: project not found');
            }
        });

        document.querySelector('.projects-list').addEventListener('click', (event) => {
            const clickedElement = event.target.closest('.project'); // Find the closest project div
            if (clickedElement) {
                const projectTitle = clickedElement.getAttribute('data-title');
                const project = TaskManager.getProjects().find(project => project.getTitle() === projectTitle);
        
                if (project) {
                    DOMController.renderTasks(project.getTasks());
                } else {
                    console.log('Project not found');
                }
            }
        });
    }

    return { initialize }
})();