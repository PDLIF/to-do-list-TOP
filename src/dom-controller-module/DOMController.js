import { TaskManager } from "../task-manager-module/TaskManager";
import { Project } from '../project-module/Project';
import { Task } from '../task-module/Task';

export const DOMController = (function () {
    const projectsList = document.querySelector('.projects-list');
    const tasksList = document.querySelector('.tasks-list');

    const addTaskForm = document.querySelector(".add-task-form-dialog");
    const addProjectForm = document.querySelector(".add-project-form-dialog");
    const editTaskFormModal = document.querySelector(".edit-task-form-dialog");

    const editTaskForm = document.querySelector(".edit-task-form");




    function updateTaskData(task, updates) {
        if (!task) {
            console.error(`Task with name ${task.getTitle()} not found.`);
            return null;
        }
    
        task.setTitle(updates.title);
        task.setDescription(updates.description);
        task.setDueDate(updates.dueDate);
        task.setPriority(updates.priority);
        task.setProject(updates.project);

        return task;
    }



    
    function updateTaskUI(oldTaskId, newTaskId, updatedTask) {
        const taskDiv = document.querySelector(`[data-title="${oldTaskId}"]`);

        const task = TaskManager.findTask(newTaskId);
        const taskTitle = task.getTitle();
        taskDiv.setAttribute('data-title', taskTitle);
        
        if (!taskDiv) {
            console.error(`Task element with ID ${newTaskId} not found.`);
            return;
        }
    
        taskDiv.querySelector(".task-title").textContent = updatedTask.getTitle();
        taskDiv.querySelector(".project-title").textContent = `Project: ${updatedTask.getProject().getTitle()}`;
        taskDiv.querySelector(".description").textContent = updatedTask.getDescription();
        taskDiv.querySelector(".due-date").textContent = updatedTask.getDueDate();
        taskDiv.querySelector(".priority").textContent = updatedTask.getPriority();
    }

    editTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const currentTask = editTaskFormModal.currentTask;
        const oldTitle = currentTask.getTitle();
        const newTaskTitle = editTaskForm.elements.title.value;

        const newParentProjectTitle = editTaskForm.elements.project.value;
        const newParentProject = TaskManager.findProject(newParentProjectTitle);
    
        // Update task data
        const updatedTask = updateTaskData(currentTask, {
            title: editTaskForm.elements.title.value,
            description: editTaskForm.elements.description.value,
            dueDate: editTaskForm.elements.dueDate.value,
            priority: editTaskForm.elements.options.value,
            project: newParentProject
        });
    
        if (updatedTask) {
            // Update UI
            updateTaskUI(oldTitle, newTaskTitle, updatedTask);
        }
    
        // Hide modal
        editTaskFormModal.close();
    });
    

    


    function handleDeleteTask(event) {
        const currentTaskDiv = event.currentTarget.closest('.task-div');
        const taskTitle = currentTaskDiv.dataset.title;
        const taskProject = currentTaskDiv.dataset.project;

        const task = TaskManager.findTask(taskTitle);
        const project = TaskManager.findProject(taskProject);

        TaskManager.deleteTask(task, project);
        currentTaskDiv.remove();
    }




    function openEditForm(event) {
        editTaskFormModal.showModal();

        const currentTaskDiv = event.currentTarget.closest('.task-div');

        const taskTitle = currentTaskDiv.dataset.title;

        const task = TaskManager.findTask(taskTitle);

        const titleField = document.querySelector('.edit-task-form .task-title-input');
        const descriptionField = document.querySelector('.edit-task-form .description-input');
        const dueDateField = document.querySelector('.edit-task-form .due-date');
        const priorityField = document.querySelector('.edit-task-form .priority');
        const parentProjectField = document.querySelector('.edit-task-form .project-select');

        titleField.value = task.getTitle();
        descriptionField.value = task.getDescription();
        dueDateField.value = task.getDueDate();
        priorityField.value = task.getPriority();
        parentProjectField.value = task.getProject().getTitle();

        editTaskFormModal.currentTask = task;
    }



    
    function createTaskOptions() {
        const optionsWrapper = document.createElement('div');
        optionsWrapper.classList.add('task-options-wrapper');
        
        const optionsBtn = document.createElement('div');
        optionsBtn.classList.add('task-options-btn');
        optionsBtn.textContent = '⋮';
        
        const dropdownContainer = document.createElement("div");
        dropdownContainer.classList.add("task-options-container");
        
        const options = [
            {
                label: "Edit",
                onClick: (event) => openEditForm(event)
            },
            {
                label: "Delete",
                onClick: (event) => handleDeleteTask(event)
            }
        ];
        
        options.forEach(option => {
            const optionElement = document.createElement("div");
            optionElement.classList.add("dropdown-option");
            optionElement.textContent = option.label;
            optionElement.addEventListener("click", option.onClick);
            dropdownContainer.append(optionElement);
        });

        optionsBtn.addEventListener('click', () => {
            dropdownContainer.classList.toggle('show');
        });

        document.addEventListener('click', (event) => {
            if (!dropdownContainer.contains(event.target) && !optionsBtn.contains(event.target)) {
                dropdownContainer.classList.remove('show');
            }
        });

        optionsWrapper.appendChild(optionsBtn);
        optionsWrapper.appendChild(dropdownContainer);
        
        return optionsWrapper;
    }
    
    
    



    
    
    // adding a DOM project element to the sidebar
    function addProjectTab(project) {
        const projectBtn = document.createElement('li');
        projectBtn.classList.add('tab', 'projects-list-tab');
        projectBtn.setAttribute('data-title', project.getTitle());

        const title = document.createElement('p');
        title.classList.add('project-title');
        title.textContent = project.getTitle();

        projectBtn.appendChild(title);
        projectsList.appendChild(projectBtn);
    }
    
    // adding a DOM task element
    function addTaskDiv(task) {
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

        const dropdownMenu = createTaskOptions();

        taskDiv.appendChild(heading);
        taskDiv.appendChild(description);
        taskDiv.appendChild(dueDateWrapper);
        taskDiv.appendChild(priorityWrapper);
        taskDiv.appendChild(dropdownMenu);

        tasksList.appendChild(taskDiv);
    }




    // add project form submition
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




    // add task form submition
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





    // render projects in the sidebar
    function renderProjects(projects) {
        projectsList.innerHTML = ''; 
        projects.forEach(addProjectTab);
    }




    // display all tasks
    function renderAllTasks() {
        tasksList.innerHTML = ''; 
        const projects = TaskManager.getProjects();
        projects.forEach(project => {
            const tasks = project.getTasks();
            tasks.forEach(addTaskDiv);
        });
    }




    // render specific group of tasks (e.g. today tasks or tasks which belong to a specific project)
    function renderTasks(tasks) {
        tasksList.innerHTML = ''; 
        tasks.forEach(addTaskDiv);
    }




    // render add and edit forms' dropdowns for project selection
    function updateProjectDropdown(projects) {
        const addFormProjectSelect = document.querySelector('.add-task-form .project-select');
        const editFormProjectSelect = document.querySelector('.edit-task-form .project-select');

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




    // make all tabs in sidebar inactive
    function deactivateTabs(className) {
        document.querySelectorAll(`${className}`).forEach((btn) => {
            btn.classList.remove('active'); // Remove 'active' from all buttons
        });
    }




    // make a specific tab active
    function makeTabActive(tab) {
        DOMController.deactivateTabs('.side-menu .tab');
        tab.classList.add('active');
    }




    // adding event listeners to tabs and buttons in the sidebar
    document.querySelector('.all-tasks-tab').addEventListener('click', () => {
        DOMController.renderAllTasks();
    });

    document.querySelector(".add-task-btn").addEventListener("click", () => {
        addTaskForm.showModal();
    });

    document.querySelector(".add-project-btn").addEventListener("click", () => {
        addProjectForm.showModal();
    });


    // making a clicked tab active
    document.querySelectorAll('.home-list, .projects-list').forEach(list => {
        list.addEventListener('click', event => {
            const clickedTab = event.target.closest('.tab');
            if (clickedTab) {
                DOMController.makeTabActive(clickedTab);
            }
        });
    });



    document.querySelector('.projects-list').addEventListener('click', (event) => {
        const clickedElement = event.target.closest('.projects-list-tab'); // Find the closest project div

        if (!clickedElement) {return}

        const projectTitle = clickedElement.getAttribute('data-title');
        const project = TaskManager.findProject(projectTitle);
        DOMController.renderTasks(project.getTasks());
    });





    return { addProjectTab, addTaskDiv, renderProjects, renderAllTasks, renderTasks, updateProjectDropdown, deactivateTabs, makeTabActive }
})();
