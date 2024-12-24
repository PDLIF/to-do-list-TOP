import { Task } from '../task-module/Task'
import { Project } from '../project-module/Project'
import { TaskManager } from '../task-manager-module/TaskManager'
import { DOMController } from '../dom-controller-module/DOMController'

export const App = (function () {
    function initialize() {
        const allProjects = TaskManager.getProjects();
        const defaultProject = Project('Default Project');
        const newProject = Project('New Project');
        const testTask = Task("Sample Task", "A project with this title already exists. Please choose a different title.A project with this title already exists. Please choose a different title.", "2024-12-20", "High", defaultProject);

        TaskManager.addProject(defaultProject);
        TaskManager.addProject(newProject);
        TaskManager.addTask(testTask, defaultProject);

        DOMController.renderTasks(defaultProject.getTasks());
        DOMController.renderProjects(allProjects);
        DOMController.updateProjectDropdown(TaskManager.getProjects());

        const addTaskForm = document.querySelector(".add-task-form-dialog");
        const addProjectForm = document.querySelector(".add-project-form-dialog");

        // document.querySelector('.add-project-form').addEventListener('submit', (event) => {
        //     event.preventDefault();

        //     const title = document.querySelector('.project-title-input').value;
        //     const existingProject = TaskManager.getProjects().find(project => project.getTitle() === title);

        //     if (existingProject) {
        //         alert('A project with this title already exists. Please choose a different title.');
        //         return;
        //     }
            
        //     const project = Project(title);
        //     TaskManager.addProject(project);
        //     addProjectForm.close();
            
        //     DOMController.renderProjects(TaskManager.getProjects());
        //     DOMController.updateProjectDropdown(TaskManager.getProjects());
        // });

        document.querySelector('.add-task-form').addEventListener('submit', (event) => {
            event.preventDefault();
            
            const projects = TaskManager.getProjects();

            const title = document.querySelector('.add-task-form .task-title-input').value;
            const description = document.querySelector('.add-task-form .description-input').value;
            const dueDate = document.querySelector('.add-task-form .due-date').value;
            const priority = document.querySelector('.add-task-form .priority').value;
            const selectedProjectTitle = document.querySelector('.add-task-form .project-select').value;
            const selectedProject = TaskManager.findProject(selectedProjectTitle);

            const existingTask = projects.some(project => {
                return project.getTasks().some(task => task.getTitle() === title);
            });

            if (existingTask) {
                alert('A project with this title already exists. Please choose a different title.');
                return;
            }

            const task = Task(title, description, dueDate, priority, selectedProject);
            TaskManager.addTask(task, selectedProject);

            const projectTab = document.querySelector(`.tab[data-title='${selectedProjectTitle}']`);

            if (projectTab && projectTab.classList.contains('active')) {
                const tasks = selectedProject.getTasks();
                DOMController.renderTasks(tasks);
            } else {
                const task = Task(title, description, dueDate, priority, selectedProject);
                DOMController.renderAllTasks(selectedProject);
                const allTasksTab = document.querySelector('.all-tasks-tab');
                DOMController.makeTabActive(allTasksTab);
            }


            addTaskForm.close();
        });
        
        

        document.querySelectorAll('.side-menu .tab').forEach(tab => {
            tab.addEventListener('click', (event) => {
                const tab = event.currentTarget.closest('.tab');
                DOMController.makeTabActive(tab);
            })
        });
    }
    
    return { initialize }
})();