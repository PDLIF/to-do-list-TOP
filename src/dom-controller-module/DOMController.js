import { TaskManager } from "../task-manager-module/TaskManager";
import { Project } from '../project-module/Project';
import { Task } from '../task-module/Task';

export const DOMController = (function () {
    const projectsList = document.querySelector('.projects-list');
    const tasksList = document.querySelector('.tasks-list');

    const addTaskForm = document.querySelector(".add-task-form-dialog");
    const addProjectForm = document.querySelector(".add-project-form-dialog");
    const editTaskForm = document.querySelector(".edit-task-form-dialog");

    function updateProjectsList(project) {
        const projectBtn = document.createElement('li');
        projectBtn.classList.add('tab', 'projects-list-tab');
        projectBtn.setAttribute('data-title', project.getTitle());

        const title = document.createElement('p');
        title.classList.add('project-title');
        title.textContent = project.getTitle();

        projectBtn.appendChild(title);
        projectsList.appendChild(projectBtn);
    }
    
    function updateTasksList(task) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task-div');
        taskDiv.setAttribute('data-title', task.getTitle());
        taskDiv.setAttribute('data-project', task.getProject().getTitle());

        const heading = document.createElement('div');
        heading.classList.add('heading');

        const title = document.createElement('h3');
        title.classList.add('task-title');
        title.textContent = task.getTitle();

        const parentProject = document.createElement('p');
        parentProject.classList.add('project-title');
        const parentProjectTitle = task.getProject().getTitle();
        parentProject.textContent = `Project: ${parentProjectTitle}`;

        const description = document.createElement('p');
        description.classList.add('description');
        description.textContent = task.getDescription();

        heading.appendChild(title);
        heading.appendChild(parentProject);

        const dueDateWrapper = document.createElement('div');
        dueDateWrapper.classList.add('due-date-wrapper');
        const dueDate = document.createElement('p');
        dueDate.classList.add('due-date');
        dueDate.textContent = task.getDueDate();
        dueDateWrapper.appendChild(dueDate);

        const priorityWrapper = document.createElement('div');
        priorityWrapper.classList.add('priority-wrapper');
        const priority = document.createElement('p');
        priority.classList.add('priority');
        priority.textContent = task.getPriority();
        priorityWrapper.appendChild(priority);

        const optionsWrapper = document.createElement('div');
        optionsWrapper.classList.add('task-options-wrapper');
        
        const optionsBtn = document.createElement('div');
        optionsBtn.classList.add('task-options-btn');
        optionsBtn.textContent = '⋮'; // Vertical ellipsis for dropdown icon
    
        const dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add('dropdown-menu'); // Start hidden

        const editOption = document.createElement('div');
        editOption.classList.add('dropdown-item');
        editOption.classList.add('task-edit-btn');
        editOption.textContent = 'Edit';

        const deleteOption = document.createElement('div');
        deleteOption.classList.add('dropdown-item');
        deleteOption.classList.add('task-delete-btn');
        deleteOption.textContent = 'Delete';
    
        dropdownMenu.appendChild(editOption);
        dropdownMenu.appendChild(deleteOption);

        optionsWrapper.appendChild(optionsBtn);
        optionsWrapper.appendChild(dropdownMenu);

        taskDiv.appendChild(heading);
        taskDiv.appendChild(description);
        taskDiv.appendChild(dueDateWrapper);
        taskDiv.appendChild(priorityWrapper);
        taskDiv.appendChild(optionsWrapper);

        tasksList.appendChild(taskDiv);

        optionsBtn.addEventListener('click', () => {                            // make dropdown menu visible
            dropdownMenu.classList.toggle('show');
        });
        
        editOption.addEventListener('click', (event) => {
            editTaskForm.showModal();

            const taskDiv = event.currentTarget.closest('.task-div');

            const taskTitle = taskDiv.dataset.title;
            const parentProjectTitle = taskDiv.dataset.project;

            const task = TaskManager.findTask(taskTitle);

            const titleField = document.querySelector('.edit-task-form .task-title-input');
            const descriptionField = document.querySelector('.edit-task-form .description-input');
            const dueDateField = document.querySelector('.edit-task-form .due-date');
            const priorityField = document.querySelector('.edit-task-form .priority');
            const parentProjectField = document.querySelector('.edit-task-form .project-select');

            titleField.value = title.textContent;
            descriptionField.value = description.textContent;
            dueDateField.value = dueDate.textContent;
            priorityField.value = priority.textContent;
            parentProjectField.value = parentProjectTitle;

            editTaskForm.currentTask = task;
        });

        deleteOption.addEventListener('click', (event) => {                     // remove task
            const currentTask = event.currentTarget.closest('.task-div');
            const taskTitle = currentTask.dataset.title;
            const taskProject = currentTask.dataset.project;

            const task = TaskManager.findTask(taskTitle);
            const project = TaskManager.findProject(taskProject);

            TaskManager.deleteTask(task, project);
            currentTask.remove();
        });

        document.addEventListener('click', (event) => {                         // make dropdown menu disssapear if clicked outside
            // Check if elements exist before proceeding
            if (optionsBtn && dropdownMenu) {
                if (!dropdownMenu.contains(event.target) && !optionsBtn.contains(event.target)) {
                    dropdownMenu.classList.remove('show');
                }
            }
        });
    }




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





    editTaskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const task = editTaskForm.currentTask;
        if (!task) return;
        
        const newTitle = document.querySelector('.edit-task-form .task-title-input').value;
        const newDescription = document.querySelector('.edit-task-form .description-input').value;
        const newDueDate = document.querySelector('.edit-task-form .due-date').value;
        const newPriority = document.querySelector('.edit-task-form .priority').value;
        const newParentProjectTitle = document.querySelector('.edit-task-form .project-select').value;
        const newParentProject = TaskManager.findProject(newParentProjectTitle);

        const taskDiv = document.querySelector(`.task-div[data-title="${task.getTitle()}"]`);
        const titleElement = taskDiv.querySelector('.task-title');
        const descriptionElement = taskDiv.querySelector('.description');
        const dueDateElement = taskDiv.querySelector('.due-date');
        const priorityElement = taskDiv.querySelector('.priority');
        const parentProjectElement = taskDiv.querySelector('.project-title');

        const oldProject = task.getProject();
        oldProject.deleteTask(task);
        
        task.setTitle(newTitle);
        task.setDescription(newDescription);
        task.setDueDate(newDueDate);
        task.setPriority(newPriority);
        task.setProject(newParentProject);

        newParentProject.addTask(task);

        titleElement.textContent = newTitle;
        descriptionElement.textContent = newDescription;
        dueDateElement.textContent = newDueDate;
        priorityElement.textContent = newPriority;
        parentProjectElement.textContent = `Project: ${newParentProjectTitle}`;
        
        // title.textContent = newTitle;
        // parentProject.textContent = `Project: ${newSelectedProjectTitle}`;
        // description.textContent = newDescription;
        // dueDate.textContent = newDueDate;
        // priority.textContent = newPriority;

        taskDiv.setAttribute('data-title', newTitle);
        taskDiv.setAttribute('data-project', newParentProjectTitle);

        editTaskForm.close();
    });






    function renderProjects(projects) {
        projectsList.innerHTML = ''; 
        projects.forEach(updateProjectsList);
    }





    function renderAllTasks() {
        tasksList.innerHTML = ''; 
        const projects = TaskManager.getProjects();
        projects.forEach(project => {
            const tasks = project.getTasks();
            tasks.forEach(updateTasksList);
        });
    }




    
    function renderTasks(tasks) {
        tasksList.innerHTML = ''; 
        tasks.forEach(updateTasksList);
    }





    const addFormProjectSelect = document.querySelector('.add-task-form .project-select');
    const editFormProjectSelect = document.querySelector('.edit-task-form .project-select');




    
    function updateProjectDropdown(projects) {
        addFormProjectSelect.innerHTML = ''; // Clear existing options
        editFormProjectSelect.innerHTML = ''; // Clear existing options
    
        projects.forEach((project) => {
            const addOption = document.createElement('option');
            addOption.value = project.getTitle(); // Assuming getTitle() returns a unique value
            addOption.textContent = project.getTitle();
            addFormProjectSelect.appendChild(addOption);
            
            // Create a separate option for edit-task-form
            const editOption = document.createElement('option');
            editOption.value = project.getTitle(); // Assuming getTitle() returns a unique value
            editOption.textContent = project.getTitle();
            editFormProjectSelect.appendChild(editOption);
        });
    }





    function deactivateTabs(className) {
        document.querySelectorAll(`${className}`).forEach((btn) => {
            btn.classList.remove('active'); // Remove 'active' from all buttons
        });
    }





    function makeTabActive(tab) {
        DOMController.deactivateTabs('.side-menu .tab');
        tab.classList.add('active');
    }





    document.querySelector('.all-tasks-tab').addEventListener('click', () => {
        DOMController.renderAllTasks();
    });

    document.querySelector(".add-task-btn").addEventListener("click", () => {
        addTaskForm.showModal();
    });

    document.querySelector(".add-project-btn").addEventListener("click", () => {
        addProjectForm.showModal();
    });





    document.querySelector('.projects-list').addEventListener('click', (event) => {
        const clickedElement = event.target.closest('.projects-list-tab'); // Find the closest project div

        if (!clickedElement) {return}

        const projectTitle = clickedElement.getAttribute('data-title');
        const project = TaskManager.findProject(projectTitle);
        DOMController.renderTasks(project.getTasks());
    });





    return { updateProjectsList, updateTasksList, renderProjects, renderAllTasks, renderTasks, updateProjectDropdown, deactivateTabs, makeTabActive }
})();
