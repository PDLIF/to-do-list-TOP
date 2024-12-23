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

        const addTaskForm = document.querySelector(".task-form-dialog");
        const addProjectForm = document.querySelector(".project-form-dialog");

        document.querySelector('.add-project-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const title = document.querySelector('.project-title-input').value;
            const existingProject = TaskManager.getProjects().find(project => project.getTitle() === title);

            if (existingProject) {
                alert('A project with this title already exists. Please choose a different title.');
                return;
            }
            
            const project = Project(title);
            TaskManager.addProject(project);
            addProjectForm.close();
            
            DOMController.renderProjects(TaskManager.getProjects());
            DOMController.updateProjectDropdown(TaskManager.getProjects());
        });

        document.querySelector('.add-task-form').addEventListener('submit', (event) => {
            event.preventDefault();
            
            const projects = TaskManager.getProjects();

            const title = document.querySelector('.task-title-input').value;
            const description = document.querySelector('.description-input').value;
            const dueDate = document.querySelector('.due-date').value;
            const priority = document.querySelector('.priority').value;
            const selectedProjectTitle = document.querySelector('.project-select').value;
            const project = TaskManager.findProject(selectedProjectTitle);

            const task = Task(title, description, dueDate, priority, project);

            const selectedProject = TaskManager.findProject(selectedProjectTitle);

            if (selectedProject) {
                TaskManager.addTask(task, selectedProject);
                DOMController.renderAllTasks(projects);
                addTaskForm.close();
            } else {
                console.log('ERROR: project not found');
            }
        });

        document.querySelector('.projects-list').addEventListener('click', (event) => {
            const clickedElement = event.target.closest('.projects-list-tab'); // Find the closest project div

            if (!clickedElement) {return}

            const projectTitle = clickedElement.getAttribute('data-title');
            const project = TaskManager.findProject(projectTitle);
            DOMController.renderTasks(project.getTasks());
        });
        
        document.querySelector(".add-task-btn").addEventListener("click", () => {
            addTaskForm.showModal();
        });

        document.querySelector(".add-project-btn").addEventListener("click", () => {
            addProjectForm.showModal();
        });

        document.querySelector('.all-tasks-tab').addEventListener('click', () => {
            DOMController.renderAllTasks();
        });

        // document.querySelector('.home-list').addEventListener('click', event => {
        //     const currentBtn = event.target.closest('.home-list-tab');
        //     console.log(currentBtn)

        //     DOMController.deactivateButtons('home-list-tab');
        //     currentBtn.classList.add('active');
        // });

        document.querySelectorAll('.side-menu .tab').forEach(tab => {
            tab.addEventListener('click', () => {
                DOMController.deactivateButtons('side-menu .tab');
                tab.classList.add('active');
            })
        });
    }
    
    return { initialize }
})();