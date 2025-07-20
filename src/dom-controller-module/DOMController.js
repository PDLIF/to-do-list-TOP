import { TaskManager } from "../task-manager-module/TaskManager.js";
// import { TaskController } from "../dom-controller-module/TaskController.js";
import { DOMRenderer } from "./DOMRenderer.js"
import { StorageManager } from "./StorageManager.js"
import { Project } from "../project-module/Project.js";
import { Task } from "../task-module/Task.js";

// Import rendering logic

export const DOMController = (function () {
  const projectsList = document.querySelector(".projects-list");
  // const tasksList = document.querySelector(".tasks-list");
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

  document.addEventListener("DOMContentLoaded", () => {
    TaskManager.clearAllProjects(); // Очищаем сначала
    TaskManager.clearAllTasks();
  
    const projects = StorageManager.loadFromLocalStorage(); // Потом загружаем
    projects.forEach((project) => TaskManager.addProject(project));
  
    DOMRenderer.renderProjects(TaskManager.getAllProjects());
    DOMRenderer.updateProjectDropdown(TaskManager.getAllProjects());
    DOMRenderer.renderAllTasks(DOMRenderer.openEditForm, handleDeleteTask);
  });

  window.TaskManager = TaskManager;

  function onProjectDelete(projectDeleteBtn) {
      projectDeleteBtn.addEventListener("click", (event) => {
        const projectTab = event.currentTarget.closest(".tab");
        const projectTitle = projectTab.dataset.title;
        TaskManager.deleteProject(projectTitle);
        projectTab.remove();

        StorageManager.saveToLocalStorage();
    });
  }

  function onToggleImportantBtn(task) {
    TaskManager.toggleImportant(task);
    StorageManager.saveToLocalStorage();
  }

  function editTaskFormSubmit(event) {
    event.preventDefault();

    const currentTask = editTaskForm.currentTask;
    const oldTitle = currentTask.getTitle();
    const newTitle = editTaskForm.elements.title.value;

    const newParentProjectTitle = editTaskForm.elements.project.value;
    const newParentProject = TaskManager.findProject(newParentProjectTitle);

    // Update task data
    const updatedTask = TaskManager.updateTask(currentTask, {
      title: editTaskForm.elements.title.value,
      description: editTaskForm.elements.description.value,
      dueDate: editTaskForm.elements.dueDate.value,
      priority: editTaskForm.elements.options.value,
      project: newParentProject,
    });

    if (updatedTask) {
      // Update UI
      DOMRenderer.updateTaskUI(oldTitle, newTitle, { onToggleImportantBtn, handleDeleteTask });
    }

    // Hide modal
    editTaskFormModal.close();
    StorageManager.saveToLocalStorage();
  }

  function handleDeleteTask(event) {
    const currentTaskDiv = event.currentTarget.closest(".task-div");
    const taskTitle = currentTaskDiv.dataset.title;
    const taskProject = currentTaskDiv.dataset.project;

    const task = TaskManager.findTask(taskTitle);
    const project = TaskManager.findProject(taskProject);

    TaskManager.deleteTask(task, project);
    currentTaskDiv.remove();

    StorageManager.saveToLocalStorage();
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

    DOMRenderer.renderProjects(TaskManager.getAllProjects());
    DOMRenderer.updateProjectDropdown(TaskManager.getAllProjects());
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
      DOMRenderer.renderTasks(tasks, DOMRenderer.openEditForm, handleDeleteTask);
    } else {
      DOMRenderer.renderTasks(selectedProject.getTasks(), DOMRenderer.openEditForm, handleDeleteTask);
      const allTasksTab = document.querySelector(".all-tasks-tab");
      makeTabActive(allTasksTab);
    }

    addTaskFormModal.close();
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
    StorageManager.saveToLocalStorage();
    addProjectForm.reset();
  });

  // add task form submition
  addTaskForm.addEventListener("submit", (event) => {
    addTaskFormSubmit(event);
    StorageManager.saveToLocalStorage();
    addTaskForm.reset();
  });

  editTaskForm.addEventListener("submit", (event) => {
    editTaskFormSubmit(event, editTaskForm);
    StorageManager.saveToLocalStorage();
    editTaskForm.reset();
  });

  // adding event listeners to tabs and buttons in the sidebar
  allTasksTab.addEventListener("click", () => {
    DOMRenderer.renderAllTasks(DOMRenderer.openEditForm, handleDeleteTask);
  });

  todayTasksTab.addEventListener("click", () => {
    DOMRenderer.renderTodayTasks(DOMRenderer.openEditForm, handleDeleteTask);
  });

  thisWeekTasksTab.addEventListener("click", () => {
    DOMRenderer.renderThisWeekTasks(DOMRenderer.openEditForm, handleDeleteTask);
  });

  importantTasksTab.addEventListener("click", () => {
    DOMRenderer.renderImportantTasks(DOMRenderer.openEditForm, handleDeleteTask);
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
      DOMRenderer.renderTasks(project.getTasks(), DOMRenderer.openEditForm, handleDeleteTask);
    }
  });

  return {
    deactivateTabs,
    makeTabActive,
    onToggleImportantBtn,
    onProjectDelete,
  };
})();