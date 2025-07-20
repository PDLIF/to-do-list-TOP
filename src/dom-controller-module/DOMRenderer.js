import projectDeleteIconPath from "../assets/delete-project-btn/delete-project-icon.svg";

import { DOMController } from './DOMController.js';
import { TaskManager } from "../task-manager-module/TaskManager.js";

export const DOMRenderer = (function () {
  const projectsList = document.querySelector(".projects-list");
  const tasksList = document.querySelector(".tasks-list");
  const allTasksTab = document.querySelector(".all-tasks-tab");

  const editTaskForm = document.querySelector(".edit-task-form");
  const editTaskFormModal = document.querySelector(".edit-task-form-dialog");

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

  // DOMRenderer.js
  function addProjectTab(project) {
      const projectBtn = document.createElement("li");
      projectBtn.classList.add("tab", "projects-list-tab");
      projectBtn.setAttribute("data-title", project.getTitle());
    
      const title = document.createElement("p");
      title.classList.add("project-title");
      title.textContent = project.getTitle();
    
      const projectDeleteBtn = document.createElement("div");
      projectDeleteBtn.classList.add("project-delete-btn");
    
      const projectDeleteIcon = document.createElement("img");
      projectDeleteIcon.classList.add("project-delete-icon");
      projectDeleteIcon.src = projectDeleteIconPath;
    
      projectDeleteBtn.appendChild(projectDeleteIcon);
      projectBtn.appendChild(title);
      projectBtn.appendChild(projectDeleteBtn);

      return { tabElement: projectBtn, deleteBtn: projectDeleteBtn };
  }

    function createTaskHeading(task) {
      const heading = document.createElement("div");
      heading.classList.add("heading");

      const title = document.createElement("h3");
      title.classList.add("task-title");
      title.textContent = task.getTitle();

      const parentProject = document.createElement("p");
      parentProject.classList.add("project-title");
      const parentProjectTitle = task.getProject().getTitle();
      parentProject.textContent = `Project: ${parentProjectTitle}`;

      const description = document.createElement("p");
      description.classList.add("description");
      description.textContent = task.getDescription();

      heading.appendChild(title);
      heading.appendChild(parentProject);

      return heading;
  }

    function createTaskDescription(task) {
      const description = document.createElement("p");
      description.classList.add("description");
      description.textContent = task.getDescription();

      return description;
  }

    function createTaskDueDateMarker(task) {
      const dueDateWrapper = document.createElement("div");
      dueDateWrapper.classList.add("due-date-wrapper");
      const dueDate = document.createElement("p");
      dueDate.classList.add("due-date");
      dueDate.textContent = task.getDueDate();
      dueDateWrapper.appendChild(dueDate);

      return dueDateWrapper;
  }

    function createTaskPriorityMarker(task) {
      const priorityWrapper = document.createElement("div");
      priorityWrapper.classList.add("priority-wrapper");
      const priority = document.createElement("p");
      priority.classList.add("priority");

      const priorityValue = task.getPriority();
      priority.textContent = priorityValue;

      switch (priorityValue) {
        case "Low":
          priorityWrapper.classList.add("low-priority");
          break;
        case "Medium":
          priorityWrapper.classList.add("medium-priority");
          break;
        case "High":
          priorityWrapper.classList.add("high-priority");
          break;
        case "Critical":
          priorityWrapper.classList.add("critical-priority");
          break;
        case "None":
          return null;
        case "":
          return null;
      }

      priorityWrapper.appendChild(priority);

      return priorityWrapper;
  }

    function createTaskImportantBtn(task) {
      const importantBtn = document.createElement("div");
      importantBtn.classList.add("important-btn");

      if (task.getIsImportant()) {
          importantBtn.classList.add("active");
      }

      importantBtn.addEventListener("click", () => {
        importantBtn.classList.toggle("active");
        DOMController.onToggleImportantBtn(task);
      });

      return importantBtn;
  }

  function createTaskOptions({ openEditForm, handleDeleteTask }) {
      const optionsWrapper = document.createElement("div");
      optionsWrapper.classList.add("task-options-wrapper");

      const optionsBtn = document.createElement("div");
      optionsBtn.classList.add("task-options-btn");
      optionsBtn.textContent = "⋮";

      const dropdownContainer = document.createElement("div");
      dropdownContainer.classList.add("task-options-container");

      const options = [
        {
          label: "Edit",
          onClick: openEditForm,
        },
        {
          label: "Delete",
          onClick: handleDeleteTask,
        },
      ];

      options.forEach((option) => {
        const optionElement = document.createElement("div");
        optionElement.classList.add("dropdown-option");
        optionElement.textContent = option.label;
        optionElement.addEventListener("click", option.onClick);
        dropdownContainer.append(optionElement);
      });

      optionsBtn.addEventListener("click", () => {
        dropdownContainer.classList.toggle("show");
      });

      document.addEventListener("click", (event) => {
        if (
          !dropdownContainer.contains(event.target) &&
          !optionsBtn.contains(event.target)
        ) {
          dropdownContainer.classList.remove("show");
        }
      });

      optionsWrapper.appendChild(optionsBtn);
      optionsWrapper.appendChild(dropdownContainer);

      return optionsWrapper;
  }

    // render projects in the sidebar
  function renderProjects(projects) {
      projectsList.innerHTML = "";
      projects.forEach((project) => {
        const { tabElement, deleteBtn } = addProjectTab(project);
        DOMController.onProjectDelete(deleteBtn, tabElement); // Attach listener
        projectsList.appendChild(tabElement);   // Add to DOM
      });
  }

  function renderAllTasks(openEditForm, handleDeleteTask) {
      tasksList.innerHTML = "";

      const projects = TaskManager.getAllProjects();
      projects.forEach((project) => {
        const tasks = project.getTasks();
        tasks.forEach(task => addTaskDiv(task, tasksList, { openEditForm, handleDeleteTask }));
      });

      DOMController.makeTabActive(allTasksTab);
  }

  function renderImportantTasks(openEditForm, handleDeleteTask) {
      tasksList.innerHTML = "";

      const importantTasks = TaskManager.getAllTasks().filter(
        (task) => task.getIsImportant() === true,
      );
      importantTasks.forEach((task) => {
        addTaskDiv(task, tasksList, { openEditForm, handleDeleteTask })
      });
    }

  // render specific group of tasks (e.g. today tasks or tasks which belong to a specific project)
  function renderTasks(tasks, openEditForm, handleDeleteTask) {
      tasksList.innerHTML = "";
      tasks.forEach(task => addTaskDiv(task, tasksList, { openEditForm, handleDeleteTask }));
  }

  function renderTodayTasks( openEditForm, handleDeleteTask ) {
      tasksList.innerHTML = "";
      const projects = TaskManager.getAllProjects();

      function isTodayTask(task) {
          const todayDate = new Date();
          const taskDate = new Date(task.getDueDate());
      
          return (
            todayDate.getFullYear() === taskDate.getFullYear() &&
            todayDate.getMonth() === taskDate.getMonth() &&
            todayDate.getDate() === taskDate.getDate()
          );
      }

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

  function isThisWeekTask(task) {
    const today = new Date();
    const taskDate = new Date(task.getDueDate());

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    return taskDate >= startOfWeek && taskDate <= endOfWeek;
  }

  function renderThisWeekTasks(openEditForm, handleDeleteTask) {
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

  function addTaskDiv(task, tasksList, { openEditForm, handleDeleteTask }) {
      const div = document.createElement("div");
      div.classList.add("task-div");
      div.setAttribute("data-title", task.getTitle());
      div.setAttribute("data-project", task.getProject().getTitle());
    
      const heading = createTaskHeading(task);
      const description = createTaskDescription(task);
      const dueDate = createTaskDueDateMarker(task);
      const priority = createTaskPriorityMarker(task);
      const importantBtn = createTaskImportantBtn(task, DOMController.onToggleImportantBtn);
      const dropdownMenu = createTaskOptions({ openEditForm, handleDeleteTask });

      div.appendChild(heading);
      div.appendChild(description);
      div.appendChild(dueDate);
      div.appendChild(importantBtn);
      div.appendChild(dropdownMenu);

      if (priority !== null) div.appendChild(priority);
    
      tasksList.appendChild(div);
  }

  function updateTaskUI(oldTaskId, newTaskId, { onToggleImportantBtn, handleDeleteTask }) {
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

  return {
    addTaskDiv,
    renderProjects,
    renderTasks,
    renderAllTasks,
    renderImportantTasks,
    renderTodayTasks,
    renderThisWeekTasks,
    updateProjectDropdown,
    updateTaskUI,
    openEditForm,
  }
})();