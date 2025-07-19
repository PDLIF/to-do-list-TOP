import { TaskManager } from "../task-manager-module/TaskManager.js";
import { Project } from "../project-module/Project.js";
import { Task } from "../task-module/Task.js";

import {
  addProjectTab,
  createTaskHeading,
  createTaskDescription,
  createTaskDueDateMarker,
  createTaskPriorityMarker,
  createTaskImportantBtn,
  createTaskOptions,
  addTaskDiv,
} from './DOMRenderer.js'

export const DOMController = (function () {
  const projectsList = document.querySelector(".projects-list");
  const tasksList = document.querySelector(".tasks-list");
  const homeAndProjectsLists = document.querySelectorAll(
    ".home-list, .projects-list",
  );

  const addTaskForm = document.querySelector(".add-task-form");
  const addProjectForm = document.querySelector(".add-project-form");
  const editTaskForm = document.querySelector(".edit-task-form");

  const addTaskFormModal = document.querySelector(".add-task-form-dialog");
  const addProjectFormModal = document.querySelector(
    ".add-project-form-dialog",
  );
  const editTaskFormModal = document.querySelector(".edit-task-form-dialog");

  const addTaskFormModalExitBtn = document.querySelector(
    ".add-task-form-dialog .form-exit-btn",
  );
  const editTaskFormModalExitBtn = document.querySelector(
    ".edit-task-form-dialog .form-exit-btn",
  );
  const addProjectFormModalExitBtn = document.querySelector(
    ".add-project-form-dialog .form-exit-btn",
  );

  const allTasksTab = document.querySelector(".all-tasks-tab");
  const todayTasksTab = document.querySelector(".today-tasks-tab");
  const thisWeekTasksTab = document.querySelector(".this-week-tab");
  const importantTasksTab = document.querySelector(".important-tab");

  const addTaskBtn = document.querySelector(".add-task-btn");
  const addProjectBtn = document.querySelector(".add-project-btn");

  function rebuildProject(data) {
    const project = Project(data.title);

    data.tasks.forEach((taskData) => {
      const task = rebuildTask(taskData, project);
      project.addTask(task);
    });

    return project;
  }

  function rebuildTask(data, parentProject) {
    const rebuildParentProject = parentProject;
    return Task(
      data.title,
      data.description,
      data.dueDate,
      data.priority,
      rebuildParentProject,
      data.isImportant,
    );
  }

  function saveToLocalStorage() {
    const projects = TaskManager.getAllProjects(); // Assuming TaskManager holds your projects and tasks.
    const serializedData = projects.map((project) =>
      project.serializeProject(),
    );
    localStorage.setItem("todoAppData", JSON.stringify(serializedData)); // Save to localStorage.
  }

  function loadFromLocalStorage() {
    const data = localStorage.getItem("todoAppData");
    if (!data) return [];

    const parsedData = JSON.parse(data); // Plain objects
    return parsedData.map(rebuildProject); // Rebuild as Project objects
  }

  document.addEventListener("DOMContentLoaded", () => {
    TaskManager.clearAllProjects(); // Очищаем сначала
    TaskManager.clearAllTasks();
  
    const projects = loadFromLocalStorage(); // Потом загружаем
    projects.forEach((project) => TaskManager.addProject(project));
  
    DOMController.renderProjects(TaskManager.getAllProjects());
    DOMController.updateProjectDropdown(TaskManager.getAllProjects());
    renderAllTasks();
  });

  window.TaskManager = TaskManager;

  function onProjectDelete(projectDeleteBtn) {
      projectDeleteBtn.addEventListener("click", (event) => {
        const projectTab = event.currentTarget.closest(".tab");
        const projectTitle = projectTab.dataset.title;
        TaskManager.deleteProject(projectTitle);
        projectTab.remove();

        saveToLocalStorage();
    });
  }

  function onToggleImportantBtn(task) {
    const isImportant = task.getIsImportant();

    if (isImportant === false) {
      // Task is not in favourites, add it
      TaskManager.addImportantTask(task);
      task.setIsImportant(true);
    } else {
      // Task is already in favourites, remove it
      TaskManager.deleteImportantTask(task);
      task.setIsImportant(false);
    }

    saveToLocalStorage();
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

  function updateTaskUI(oldTaskId, newTaskId) {
    const taskDiv = document.querySelector(`[data-title="${oldTaskId}"]`);
    taskDiv.innerHTML = "";

    const task = TaskManager.findTask(newTaskId);
    const taskTitle = task.getTitle();
    taskDiv.setAttribute("data-title", taskTitle);

    if (!taskDiv) {
      console.error(`Task element with ID ${newTaskId} not found.`);
      return;
    }

    const heading = createTaskHeading(task);
    const description = createTaskDescription(task);
    const dueDateWrapper = createTaskDueDateMarker(task);
    const priorityWrapper = createTaskPriorityMarker(task);
    const importantBtn = createTaskImportantBtn(task, onToggleImportantBtn);
    const dropdownMenu = createTaskOptions({ openEditForm, handleDeleteTask });

    taskDiv.appendChild(heading);
    taskDiv.appendChild(description);
    taskDiv.appendChild(dueDateWrapper);
    taskDiv.appendChild(importantBtn);
    taskDiv.appendChild(dropdownMenu);

    if (priorityWrapper !== null) {
      taskDiv.appendChild(priorityWrapper);
    }
  }

  function editTaskFormSubmit(event) {
    event.preventDefault();

    const currentTask = editTaskForm.currentTask;
    const oldTitle = currentTask.getTitle();
    const newTaskTitle = editTaskForm.elements.title.value;

    const oldProject = currentTask.getProject(); //deleting the task from old project
    oldProject.deleteTask(currentTask);

    const newParentProjectTitle = editTaskForm.elements.project.value;
    const newParentProject = TaskManager.findProject(newParentProjectTitle);

    // Update task data
    const updatedTask = updateTaskData(currentTask, {
      title: editTaskForm.elements.title.value,
      description: editTaskForm.elements.description.value,
      dueDate: editTaskForm.elements.dueDate.value,
      priority: editTaskForm.elements.options.value,
      project: newParentProject,
    });

    newParentProject.addTask(updatedTask);

    if (updatedTask) {
      // Update UI
      updateTaskUI(oldTitle, newTaskTitle);
    }

    // Hide modal
    editTaskFormModal.close();
    saveToLocalStorage();
  }

  function handleDeleteTask(event) {
    const currentTaskDiv = event.currentTarget.closest(".task-div");
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

    const currentTaskDiv = event.currentTarget.closest(".task-div");

    const taskTitle = currentTaskDiv.dataset.title;

    const task = TaskManager.findTask(taskTitle);

    const titleField = document.querySelector(
      ".edit-task-form .task-title-input",
    );
    const descriptionField = document.querySelector(
      ".edit-task-form .description-input",
    );
    const dueDateField = document.querySelector(".edit-task-form .due-date");
    const priorityField = document.querySelector(".edit-task-form .priority");
    const parentProjectField = document.querySelector(
      ".edit-task-form .project-select",
    );

    titleField.value = task.getTitle();
    descriptionField.value = task.getDescription();
    dueDateField.value = task.getDueDate();
    priorityField.value = task.getPriority();
    parentProjectField.value = task.getProject().getTitle();

    editTaskForm.currentTask = task;
  }

  function addProjectFormSubmit(event) {
    event.preventDefault();

    const title = document.querySelector(".project-title-input").value;
    const existingProject = TaskManager.getAllProjects().find(
      (project) => project.getTitle() === title,
    );

    if (existingProject) {
      alert(
        "A project with this title already exists. Please choose a different title.",
      );
      return;
    }

    const project = Project(title);
    TaskManager.addProject(project);
    addProjectFormModal.close();

    DOMController.renderProjects(TaskManager.getAllProjects());
    DOMController.updateProjectDropdown(TaskManager.getAllProjects());
  }

  function addTaskFormSubmit(event) {
    event.preventDefault();

    const projects = TaskManager.getAllProjects();

    const title = document.querySelector(
      ".add-task-form .task-title-input",
    ).value;
    const description = document.querySelector(
      ".add-task-form .description-input",
    ).value;
    const dueDate = document.querySelector(".add-task-form .due-date").value;
    const priority = document.querySelector(".add-task-form .priority").value;
    const selectedProjectTitle = document.querySelector(
      ".add-task-form .project-select",
    ).value;
    const selectedProject = TaskManager.findProject(selectedProjectTitle);

    const existingTask = projects.some((project) => {
      return project.getTasks().some((task) => task.getTitle() === title);
    });

    if (existingTask) {
      alert(
        "A project with this title already exists. Please choose a different title.",
      );
      return;
    }

    const task = Task(title, description, dueDate, priority, selectedProject);
    TaskManager.addTask(task, selectedProject);

    const projectTab = document.querySelector(
      `.tab[data-title='${selectedProjectTitle}']`,
    );

    if (projectTab && projectTab.classList.contains("active")) {
      const tasks = selectedProject.getTasks();
      DOMController.renderTasks(tasks);
    } else {
      DOMController.renderAllTasks(selectedProject);
      const allTasksTab = document.querySelector(".all-tasks-tab");
      DOMController.makeTabActive(allTasksTab);
    }

    addTaskFormModal.close();
  }

  // render projects in the sidebar
  function renderProjects(projects) {
    projectsList.innerHTML = "";
    projects.forEach((project) => {
      const { tabElement, deleteBtn } = addProjectTab(project);
      onProjectDelete(deleteBtn, tabElement); // Attach listener
      projectsList.appendChild(tabElement);   // Add to DOM
    });
  }

  // display all tasks
  function renderAllTasks() {
    tasksList.innerHTML = "";

    const projects = TaskManager.getAllProjects();
    projects.forEach((project) => {
      const tasks = project.getTasks();
      tasks.forEach(task => addTaskDiv(task, tasksList, { openEditForm, handleDeleteTask }));
    });

    DOMController.makeTabActive(allTasksTab);
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
    tasksList.innerHTML = "";
    const projects = TaskManager.getAllProjects();

    projects.forEach((project) => {
      const projectTasks = project.getTasks();
      projectTasks.forEach((task) => {
        const isToday = isTodayTask(task);
        if (isToday) {
          addTaskDiv(task, tasksList, { openEditForm, handleDeleteTask });
        }
      });
    });
  }

  function renderThisWeekTasks() {
    tasksList.innerHTML = "";
    const projects = TaskManager.getAllProjects();

    projects.forEach((project) => {
      const projectTasks = project.getTasks();
      projectTasks.forEach((task) => {
        const isThisWeek = isThisWeekTask(task);
        if (isThisWeek) {
          addTaskDiv(task, tasksList, { openEditForm, handleDeleteTask });
        }
      });
    });
  }

  function renderImportantTasks() {
    tasksList.innerHTML = "";

    const importantTasks = TaskManager.getAllTasks().filter(
      (task) => task.getIsImportant() === true,
    );
    importantTasks.forEach((task) => {
      addTaskDiv(task, tasksList, { openEditForm, handleDeleteTask })
    });
  }

  // function setTaskImportantBtn(task, btn) {
  //   const isImportant = task.getIsImportant();

  //   if (isImportant === true) {
  //     task.setIsImportant(true);
  //     btn.classList.add("active");
  //   } else {
  //     task.setIsImportant(false);
  //     btn.classList.remove("active");
  //   }
  // }

  // render specific group of tasks (e.g. today tasks or tasks which belong to a specific project)
  function renderTasks(tasks) {
    tasksList.innerHTML = "";
    tasks.forEach(task => addTaskDiv(task, tasksList, { openEditForm, handleDeleteTask }));
  }

  // render add and edit forms' dropdowns for project selection
  function updateProjectDropdown(projects) {
    const addFormProjectSelect = document.querySelector(
      ".add-task-form .project-select",
    );
    const editFormProjectSelect = document.querySelector(
      ".edit-task-form .project-select",
    );

    addFormProjectSelect.innerHTML = ""; // Clear existing options
    editFormProjectSelect.innerHTML = ""; // Clear existing options

    projects.forEach((project) => {
      const addOption = document.createElement("option");
      addOption.value = project.getTitle(); // Assuming getTitle() returns a unique value
      addOption.textContent = project.getTitle();
      addFormProjectSelect.appendChild(addOption);

      // Create a separate option for edit-task-form
      const editOption = document.createElement("option");
      editOption.value = project.getTitle(); // Assuming getTitle() returns a unique value
      editOption.textContent = project.getTitle();
      editFormProjectSelect.appendChild(editOption);
    });
  }

  // make all tabs in sidebar inactive
  function deactivateTabs(className) {
    document.querySelectorAll(`${className}`).forEach((btn) => {
      btn.classList.remove("active"); // Remove 'active' from all buttons
    });
  }

  // make a specific tab active
  function makeTabActive(tab) {
    DOMController.deactivateTabs(".side-menu .tab");
    tab.classList.add("active");
  }

  // add project form submition
  addProjectForm.addEventListener("submit", (event) => {
    addProjectFormSubmit(event);
    saveToLocalStorage();
    addProjectForm.reset();
  });

  // add task form submition
  addTaskForm.addEventListener("submit", (event) => {
    addTaskFormSubmit(event);
    saveToLocalStorage();
    addTaskForm.reset();
  });

  editTaskForm.addEventListener("submit", (event) => {
    editTaskFormSubmit(event);
    saveToLocalStorage();
    editTaskForm.reset();
  });

  // adding event listeners to tabs and buttons in the sidebar
  allTasksTab.addEventListener("click", () => {
    renderAllTasks();
  });

  todayTasksTab.addEventListener("click", () => {
    renderTodayTasks();
  });

  thisWeekTasksTab.addEventListener("click", () => {
    renderThisWeekTasks();
  });

  importantTasksTab.addEventListener("click", () => {
    renderImportantTasks();
  });

  addTaskBtn.addEventListener("click", () => {
    addTaskFormModal.showModal();
  });

  addProjectBtn.addEventListener("click", () => {
    addProjectFormModal.showModal();
  });

  addTaskFormModalExitBtn.addEventListener("click", () => {
    addTaskFormModal.close();
    addTaskForm.reset();
  });

  editTaskFormModalExitBtn.addEventListener("click", () => {
    editTaskFormModal.close();
    editTaskForm.reset();
  });

  addProjectFormModalExitBtn.addEventListener("click", () => {
    addProjectFormModal.close();
    editTaskForm.reset();
  });

  addTaskFormModal.addEventListener("click", (event) => {
    // Close the modal if the click is outside the modal content
    if (!addTaskForm.contains(event.target)) {
      addTaskFormModal.close();
    }
  });

  editTaskFormModal.addEventListener("click", (event) => {
    // Close the modal if the click is outside the modal content
    if (!editTaskForm.contains(event.target)) {
      editTaskFormModal.close();
    }
  });

  addProjectFormModal.addEventListener("click", (event) => {
    // Close the modal if the click is outside the modal content
    if (!addProjectForm.contains(event.target)) {
      addProjectFormModal.close();
    }
  });

  // making a clicked tab active
  homeAndProjectsLists.forEach((list) => {
    list.addEventListener("click", (event) => {
      const clickedTab = event.target.closest(".tab");
      if (clickedTab) {
        DOMController.makeTabActive(clickedTab);
      }
    });
  });
  
  projectsList.addEventListener("click", (event) => {
    const clickedElement = event.target;
    const projectTitleElement = event.target.closest(".project-title");
    const projectTab = event.target.closest(".tab"); // Find the closest project tab

    if (
      clickedElement === projectTitleElement ||
      clickedElement === projectTab
    ) {
      const projectTitle = projectTab.getAttribute("data-title");
      const project = TaskManager.findProject(projectTitle);
      DOMController.renderTasks(project.getTasks());
    }
  });

  return {
    addProjectTab,
    addTaskDiv,
    renderProjects,
    renderAllTasks,
    renderTasks,
    updateProjectDropdown,
    deactivateTabs,
    makeTabActive,
    onToggleImportantBtn,
  };
})();