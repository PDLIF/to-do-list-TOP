export const DOMController = (function () {
    const projectsList = document.querySelector('.projects-list');
    const tasksList = document.querySelector('.tasks-list');

    function updateProjectsList(project) {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');
        projectDiv.setAttribute('data-title', project.getTitle());

        const title = document.createElement('h3');
        title.classList.add('project-title');
        title.textContent = project.getTitle();

        projectDiv.appendChild(title);
        projectsList.appendChild(projectDiv);
    }
    
    function updateTasksList(task) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');

        const title = document.createElement('h3');
        title.classList.add('task-title');
        title.textContent = task.getTitle();

        const description = document.createElement('p');
        description.classList.add('task-description');
        description.textContent = task.getDescription();

        const dueDate = document.createElement('p');
        dueDate.classList.add('task-due-date');
        dueDate.textContent = task.getDueDate();

        const priority = document.createElement('p');
        priority.classList.add('task-priority');
        priority.textContent = task.getPriority();

        const parentProject = document.createElement('p');
        parentProject.classList.add('task-project');
        parentProject.textContent = task.getProject();

        taskDiv.appendChild(title);
        taskDiv.appendChild(description);
        taskDiv.appendChild(dueDate);
        taskDiv.appendChild(priority);
        taskDiv.appendChild(parentProject);

        tasksList.appendChild(taskDiv);
    }

    function renderProjects(projects) {
        projectsList.innerHTML = ''; 
        projects.forEach(updateProjectsList);
    }

    function renderAllTasks(projects) {
        tasksList.innerHTML = ''; 
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
    

    return { updateProjectsList, updateTasksList, renderProjects, renderAllTasks, renderTasks, updateProjectDropdown }
})();
