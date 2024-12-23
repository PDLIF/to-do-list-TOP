import { TaskManager } from "../task-manager-module/TaskManager";

export const DOMController = (function () {
    const projectsList = document.querySelector('.projects-list');
    const tasksList = document.querySelector('.tasks-list');

    function updateProjectsList(project) {
        const projectBtn = document.createElement('li');
        projectBtn.classList.add('tab');
        projectBtn.classList.add('projects-list-tab');
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
        parentProject.textContent = `Project: ${task.getProject().getTitle()}`;

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

        // const deleteBtn = document.createElement('div');
        // editBtn.classList.add('task-delete-btn');
        // editBtn.textContent = 'Delete';

        taskDiv.appendChild(heading);
        taskDiv.appendChild(description);
        taskDiv.appendChild(dueDateWrapper);
        taskDiv.appendChild(priorityWrapper);
        taskDiv.appendChild(optionsWrapper);

        tasksList.appendChild(taskDiv);

        deleteOption.addEventListener('click', (event) => {                     // remove task
            const currentTask = event.currentTarget.closest('.task-div');
            const taskTitle = currentTask.dataset.title;
            const taskProject = currentTask.dataset.project;

            const task = TaskManager.findTask(taskTitle);
            const project = TaskManager.findProject(taskProject);

            TaskManager.deleteTask(task, project);
            currentTask.remove();
        });

        optionsBtn.addEventListener('click', () => {                            // make dropdown menu visible
            document.querySelector('.dropdown-menu').classList.toggle('show');
        });

        document.addEventListener('click', (event) => {                         // make dropdown menu disssapear if clicked outside
            const dropdownButton = document.querySelector('.task-options-btn');
            const dropdownMenu = document.querySelector('.dropdown-menu');
          
            // Check if elements exist before proceeding
            if (dropdownButton && dropdownMenu) {
              if (!dropdownMenu.contains(event.target) && !dropdownButton.contains(event.target)) {
                dropdownMenu.classList.remove('show');
              }
            }
          });
    }

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

    function updateProjectDropdown(projects) {
        const projectSelect = document.querySelector('.project-select');
        projectSelect.innerHTML = ''; // Clear existing options
    
        projects.forEach((project) => {
            const option = document.createElement('option');
            option.value = project.getTitle();
            option.textContent = project.getTitle();
            projectSelect.appendChild(option);
        });
    }

    function deactivateButtons(className) {
        document.querySelectorAll(`.${className}`).forEach((btn) => {
            btn.classList.remove('active'); // Remove 'active' from all buttons
        });
    }
    

    return { updateProjectsList, updateTasksList, renderProjects, renderAllTasks, renderTasks, updateProjectDropdown, deactivateButtons }
})();
