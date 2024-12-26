import { TaskManager } from "../task-manager-module/TaskManager";
import { Project } from '../project-module/Project';
import { Task } from '../task-module/Task';

export const DOMController = (function () {
    const projectsList = document.querySelector('.projects-list');
    const tasksList = document.querySelector('.tasks-list');

    const addTaskForm = document.querySelector(".add-task-form-dialog");
    const addProjectForm = document.querySelector(".add-project-form-dialog");
    const editTaskForm = document.querySelector(".edit-task-form-dialog");



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
        editTaskForm.showModal();

        const currentTaskDiv = event.currentTarget.closest('.task-div');

        const taskTitle = currentTaskDiv.dataset.title;
        const parentProjectTitle = currentTaskDiv.dataset.project;

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

        editTaskForm.currentTask = task;
    }
    
    
    
    function createDropdownMenu() {
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
        
        return dropdownContainer;
    }
    
    
    



    
    
    // adding a DOM project element to the sidebar
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
    
    // adding a DOM task element
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
        optionsBtn.textContent = '⋮';







    
        // const dropdownMenu = document.createElement('div');
        // dropdownMenu.classList.add('dropdown-menu');

        // const editOption = document.createElement('div');
        // editOption.classList.add('dropdown-item');
        // editOption.classList.add('task-edit-btn');
        // editOption.textContent = 'Edit';

        // const deleteOption = document.createElement('div');
        // deleteOption.classList.add('dropdown-item');
        // deleteOption.classList.add('task-delete-btn');
        // deleteOption.textContent = 'Delete';
    
        // dropdownMenu.appendChild(editOption);
        // dropdownMenu.appendChild(deleteOption);

        const dropdownMenu = createDropdownMenu();








        optionsWrapper.appendChild(optionsBtn);
        optionsWrapper.appendChild(dropdownMenu);

        taskDiv.appendChild(heading);
        taskDiv.appendChild(description);
        taskDiv.appendChild(dueDateWrapper);
        taskDiv.appendChild(priorityWrapper);
        taskDiv.appendChild(optionsWrapper);

        tasksList.appendChild(taskDiv);

        // make dropdown menu visible
        optionsBtn.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show');
        });
        
        // options btn event listener
        // editOption.addEventListener('click', (event) => {
        //     editTaskForm.showModal();

        //     const taskDiv = event.currentTarget.closest('.task-div');

        //     const taskTitle = taskDiv.dataset.title;
        //     const parentProjectTitle = taskDiv.dataset.project;

        //     const task = TaskManager.findTask(taskTitle);

        //     const titleField = document.querySelector('.edit-task-form .task-title-input');
        //     const descriptionField = document.querySelector('.edit-task-form .description-input');
        //     const dueDateField = document.querySelector('.edit-task-form .due-date');
        //     const priorityField = document.querySelector('.edit-task-form .priority');
        //     const parentProjectField = document.querySelector('.edit-task-form .project-select');

        //     titleField.value = title.textContent;
        //     descriptionField.value = description.textContent;
        //     dueDateField.value = dueDate.textContent;
        //     priorityField.value = priority.textContent;
        //     parentProjectField.value = parentProjectTitle;

        //     editTaskForm.currentTask = task;
        // });

        // remove task
        // deleteOption.addEventListener('click', (event) => {
        //     const currentTaskDiv = event.currentTarget.closest('.task-div');
        //     const taskTitle = currentTaskDiv.dataset.title;
        //     const taskProject = currentTaskDiv.dataset.project;

        //     const task = TaskManager.findTask(taskTitle);
        //     const project = TaskManager.findProject(taskProject);

        //     TaskManager.deleteTask(task, project);
        //     currentTaskDiv.remove();
        // });

        // make dropdown menu disssapear if clicked outside
        document.addEventListener('click', (event) => {
            // Check if elements exist before proceeding
            if (optionsBtn && dropdownMenu) {
                if (!dropdownMenu.contains(event.target) && !optionsBtn.contains(event.target)) {
                    dropdownMenu.classList.remove('show');
                }
            }
        });
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




    // edit task form submition
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

        taskDiv.setAttribute('data-title', newTitle);
        taskDiv.setAttribute('data-project', newParentProjectTitle);

        editTaskForm.close();
    });





    // render projects in the sidebar
    function renderProjects(projects) {
        projectsList.innerHTML = ''; 
        projects.forEach(updateProjectsList);
    }




    // display all tasks
    function renderAllTasks() {
        tasksList.innerHTML = ''; 
        const projects = TaskManager.getProjects();
        projects.forEach(project => {
            const tasks = project.getTasks();
            tasks.forEach(updateTasksList);
        });
    }




    // render specific group of tasks (e.g. today tasks or tasks which belong to a specific project)
    function renderTasks(tasks) {
        tasksList.innerHTML = ''; 
        tasks.forEach(updateTasksList);
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





    return { updateProjectsList, updateTasksList, renderProjects, renderAllTasks, renderTasks, updateProjectDropdown, deactivateTabs, makeTabActive }
})();
