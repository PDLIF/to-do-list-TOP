const Task = function(title, description, dueDate, priority, project) {
    function getTitle() {
        return title;
    }

    function setTitle(newTitle) {
        title = newTitle;
    }

    function getDescription() {
        return description;
    }

    function setDescription(newDescription) {
        description = newDescription;
    }

    function getDueDate() {
        return dueDate;
    }

    function setDueDate(newDueDate) {
        dueDate = newDueDate;
    }

    function getPriority() {
        return priority;
    }

    function setPriority(newPriority) {
        priority = newPriority;
    }

    function getProject() {
        return project;
    }

    return { getTitle, setTitle, getDescription, setDescription, getDueDate, setDueDate, getPriority, setPriority, getProject }
}


const Project = function (title) {
    const tasks = [];

    function getTitle() {
        return title;
    }

    function getTasks() {
        return tasks;
    }

    function setTitle(newTitle) {
        title = newTitle();
    }

    return { getTitle, getTasks, setTitle }
}




const DOMController = (function () {
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





const TaskManager = (function () {
    const projects = [];

    function getProjects() {
        return projects;
    }

    function addProject(project) {
        projects.push(project);
    }

    function addTask(task, project) {
        project.getTasks().push(task);
    }
    
    function deleteTask(task, project) {
        const index = project.getTasks().indexOf(task);
        if (index !== -1) {
            project.getTasks().splice(index, 1);
        } else {
            console.log('error');
        }
    }

    return { getProjects, addProject, addTask, deleteTask }
})();



const App = (function () {
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

            const task = Task(title, description, dueDate, priority);

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

        document.querySelector(".add-task-btn").addEventListener("click", () => {
            addTaskForm.showModal();
        });

        document.querySelector(".add-project-btn").addEventListener("click", () => {
            addProjectForm.showModal();
        });
    }

    return { initialize }
})();


App.initialize()
