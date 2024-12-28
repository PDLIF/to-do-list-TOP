import { TaskManager } from "../task-manager-module/TaskManager";
import { Project } from '../project-module/Project';
import { Task } from '../task-module/Task';
// import { LocalStorageManager } from '../local-storage';

export const DOMController = (function () {
    const projectsList = document.querySelector('.projects-list');
    const tasksList = document.querySelector('.tasks-list');
    const homeAndProjectsLists = document.querySelectorAll('.home-list, .projects-list');
    
    const addTaskForm = document.querySelector(".add-task-form");
    const addProjectForm = document.querySelector(".add-project-form");
    const editTaskForm = document.querySelector(".edit-task-form");

    const addTaskFormModal = document.querySelector(".add-task-form-dialog");
    const addProjectFormModal = document.querySelector(".add-project-form-dialog");
    const editTaskFormModal = document.querySelector(".edit-task-form-dialog");

    const allTasksTab = document.querySelector('.all-tasks-tab');
    const todayTasksTab = document.querySelector('.today-tasks-tab');
    const thisWeekTasksTab = document.querySelector('.this-week-tab');
    const importantTasksTab = document.querySelector('.important-tab');

    const addTaskBtn = document.querySelector(".add-task-btn");
    const addProjectBtn = document.querySelector(".add-project-btn");


    

    function rebuildProject(data) {
        const tasks = data.tasks || [];
        const project = Project(data.title);

        data.tasks.forEach(taskData => {
            const task = rebuildTask(taskData, project);
            project.addTask(task);
        });

        return project;
    }

    function rebuildTask(data, parentProject) {
        const rebuildParentProject = parentProject;
        return Task(data.title, data.description, data.dueDate, data.priority, rebuildParentProject);
    }

    

    function saveToLocalStorage() {
        const projects = TaskManager.getAllProjects(); // Assuming TaskManager holds your projects and tasks.
        const serializedData = projects.map(project => project.serializeProject());
        localStorage.setItem('todoAppData', JSON.stringify(serializedData)); // Save to localStorage.
    }

    function loadFromLocalStorage() {
        const data = localStorage.getItem('todoAppData');
        if (!data) return [];
    
        const parsedData = JSON.parse(data); // Plain objects
        return parsedData.map(rebuildProject); // Rebuild as Project objects
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        const projects = loadFromLocalStorage();
        renderProjects(projects);
        // DOMController.renderAllTasks();

        TaskManager.clearAllProjects();
        TaskManager.clearAllTasks();
        projects.forEach(project => TaskManager.addProject(project));
        DOMController.renderProjects(TaskManager.getAllProjects());
        renderAllTasks();
        DOMController.updateProjectDropdown(TaskManager.getAllProjects());
    });











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

        const heading = createTaskHeading(task);
        const description = createTaskDescription(task);
        const dueDateWrapper = createTaskDueDateMarker(task);
        const priorityWrapper = createTaskPriorityMarker(task);
        const importantBtn = createTaskImportantBtn(task);
        const dropdownMenu = createTaskOptions();

        taskDiv.appendChild(heading);
        taskDiv.appendChild(description);
        taskDiv.appendChild(dueDateWrapper);
        taskDiv.appendChild(priorityWrapper);
        taskDiv.appendChild(importantBtn);
        taskDiv.appendChild(dropdownMenu);

        tasksList.appendChild(taskDiv);
    }




    function createTaskHeading(task) {
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

        return heading;
    }



    function createTaskDescription(task) {
        const description = document.createElement('p');
        description.classList.add('description');
        description.textContent = task.getDescription();

        return description;
    }
    
    

    function createTaskDueDateMarker(task) {
        const dueDateWrapper = document.createElement('div');
        dueDateWrapper.classList.add('due-date-wrapper');
        const dueDate = document.createElement('p');
        dueDate.classList.add('due-date');
        dueDate.textContent = task.getDueDate();
        dueDateWrapper.appendChild(dueDate);

        return dueDateWrapper;
    }


    function createTaskImportantBtn(task) {
        const importantBtn = document.createElement('div');
        importantBtn.classList.add('important-btn');

        setTaskImportantBtn(task, importantBtn);

        importantBtn.addEventListener('click', () => {
            const taskIndex = TaskManager.getImportantTasks().indexOf(task);
    
            if (taskIndex === -1) {
                // Task is not in favourites, add it
                TaskManager.addImportantTask(task);
            } else {
                // Task is already in favourites, remove it
                TaskManager.deleteImportantTask(task);
            }
    
            importantBtn.classList.toggle('active');
        });

        return importantBtn;
    }

    function createTaskPriorityMarker(task) {
        const priorityWrapper = document.createElement('div');
        priorityWrapper.classList.add('priority-wrapper');
        const priority = document.createElement('p');
        priority.classList.add('priority');
        priority.textContent = task.getPriority();
        priorityWrapper.appendChild(priority);

        return priorityWrapper;
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





    function editTaskFormSubmit(event) {
        event.preventDefault();

        const currentTask = editTaskForm.currentTask;
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
        saveToLocalStorage();
    }
    

    


    function handleDeleteTask(event) {
        const currentTaskDiv = event.currentTarget.closest('.task-div');
        const taskTitle = currentTaskDiv.dataset.title;
        const taskProject = currentTaskDiv.dataset.project;

        const task = TaskManager.findTask(taskTitle);
        const project = TaskManager.findProject(taskProject);

        TaskManager.deleteTask(task, project);
        currentTaskDiv.remove();
        
        saveToLocalStorage();
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

        editTaskForm.currentTask = task;
    }
    
    








    function addProjectFormSubmit(event) {
        event.preventDefault();
        
        const title = document.querySelector('.project-title-input').value;
        const existingProject = TaskManager.getAllProjects().find(project => project.getTitle() === title);

        if (existingProject) {
            alert('A project with this title already exists. Please choose a different title.');
            return;
        }
        
        const project = Project(title);
        TaskManager.addProject(project);
        addProjectFormModal.close();
        
        DOMController.renderProjects(TaskManager.getAllProjects());
        DOMController.updateProjectDropdown(TaskManager.getAllProjects());
        // saveToLocalStorage();
    }
    
    
    




    function addTaskFormSubmit(event) {
        event.preventDefault();
        
        const projects = TaskManager.getAllProjects();

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

        addTaskFormModal.close();
        // saveToLocalStorage();
    }

    // render projects in the sidebar
    function renderProjects(projects) {
        projectsList.innerHTML = ''; 
        projects.forEach(addProjectTab);
    }

    // display all tasks
    function renderAllTasks() {
        tasksList.innerHTML = ''; 
        const projects = TaskManager.getAllProjects();
        projects.forEach(project => {
            const tasks = project.getTasks();
            tasks.forEach(addTaskDiv);
        });
    }


    function isTodayTask(task) {
        const todayDate = new Date();
        const taskDate = new Date(task.getDueDate());

        return (
            todayDate.getFullYear() === taskDate.getFullYear() &&
            todayDate.getMonth() === taskDate.getMonth() &&
            todayDate.getDate() === taskDate.getDate()
        );
    }

    function isThisWeekTask(task) {
        const today = new Date();
        const taskDate = new Date(task.getDueDate());
    
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
    
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    
        return taskDate >= startOfWeek && taskDate <= endOfWeek;
    }


    function renderTodayTasks() {
        tasksList.innerHTML = '';
        const projects = TaskManager.getAllProjects();

        projects.forEach(project => {
            const projectTasks = project.getTasks();
            projectTasks.forEach(task => {
                const isToday = isTodayTask(task);
                if (isToday) {
                    addTaskDiv(task);
                }
            })
        })
    }
    
    function renderThisWeekTasks() {
        tasksList.innerHTML = '';
        const projects = TaskManager.getAllProjects();

        projects.forEach(project => {
            const projectTasks = project.getTasks();
            projectTasks.forEach(task => {
                const isThisWeek = isThisWeekTask(task);
                if (isThisWeek) {
                    addTaskDiv(task);
                }
            })
        })
    }

    function renderImportantTasks() {
        tasksList.innerHTML = '';
        const importantTasks = TaskManager.getImportantTasks();
        importantTasks.forEach(task => {
            addTaskDiv(task);
        });
    }





    function setTaskImportantBtn(task, btn) {
        const isImportant = TaskManager.isImportant(task);

        if (isImportant) {
            btn.classList.add('active');
        }
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
    
    




    // add project form submition
    addProjectForm.addEventListener('submit', (event) => {       
        addProjectFormSubmit(event);
        saveToLocalStorage();
    });
    
    // add task form submition
    addTaskForm.addEventListener('submit', (event) => {
        addTaskFormSubmit(event);
        saveToLocalStorage();
    });
    
    editTaskForm.addEventListener("submit", (event) => {
        editTaskFormSubmit(event);
        saveToLocalStorage();
    });

    // adding event listeners to tabs and buttons in the sidebar
    allTasksTab.addEventListener('click', () => {
        renderAllTasks();
    });

    todayTasksTab.addEventListener('click', () => {
        renderTodayTasks();
    });

    thisWeekTasksTab.addEventListener('click', () => {
        renderThisWeekTasks();
    });

    importantTasksTab.addEventListener('click', () => {
        renderImportantTasks();
    });

    addTaskBtn.addEventListener("click", () => {
        addTaskFormModal.showModal();
    });

    addProjectBtn.addEventListener("click", () => {
        addProjectFormModal.showModal();
    });


    // making a clicked tab active
    function makeClickedTabActive() {
        homeAndProjectsLists.forEach(list => {
            list.addEventListener('click', event => {
                const clickedTab = event.target.closest('.tab');
                if (clickedTab) {
                    DOMController.makeTabActive(clickedTab);
                }
            });
        });
    }



    projectsList.addEventListener('click', (event) => {
        const clickedElement = event.target.closest('.projects-list-tab'); // Find the closest project div

        if (!clickedElement) {return}

        const projectTitle = clickedElement.getAttribute('data-title');
        const project = TaskManager.findProject(projectTitle);
        DOMController.renderTasks(project.getTasks());
    });


    makeClickedTabActive();


    return { addProjectTab, addTaskDiv, renderProjects, renderAllTasks, renderTasks, updateProjectDropdown, deactivateTabs, makeTabActive }
})();
