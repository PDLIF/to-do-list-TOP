import { TaskManager } from './../task-manager-module/TaskManager.js'

import {
  rebuildProject
} from './TaskController.js'

export const StorageManager = (function() {
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

  return {
    saveToLocalStorage,
    loadFromLocalStorage,
  }
})();