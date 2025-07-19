import projectDeleteIconPath from "../assets/delete-project-btn/delete-project-icon.svg";

import { DOMController } from './DOMController.js';

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

  export { addProjectTab,
           createTaskHeading,
           createTaskDescription,
           createTaskDueDateMarker,
           createTaskPriorityMarker,
           createTaskImportantBtn,
           createTaskOptions,
           addTaskDiv
        }