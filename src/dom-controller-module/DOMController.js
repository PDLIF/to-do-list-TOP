import { TaskManager } from "../task-manager-module/TaskManager";

export const DOMController = (function () {
    const projectsList = document.querySelector('.projects-list');
    const tasksList = document.querySelector('.tasks-list');

    const addTaskForm = document.querySelector(".add-task-form-dialog");
    const addProjectForm = document.querySelector(".add-project-form-dialog");

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




        const editProjectForm = document.querySelector(".edit-task-form-dialog");
        
        editOption.addEventListener('click', (event) => {
            editProjectForm.showModal();

            const taskTitle = event.currentTarget.closest('.task-title');
            const projectTitle = event.currentTarget.closest('.project-div');

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

            console.log(title.textContent);
        })
        
        
        
        

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
