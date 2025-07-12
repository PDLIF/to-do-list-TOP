import { TaskManager } from "./TaskManager.js";

test('addProject adds a project and its tasks to TaskManager', () => {
    const mockTask = { getTitle: () => 'Test task' };
    const mockProject = {
        getTitle: () => 'Project 1',
        getTasks: () => [mockTask]
    };

    TaskManager.clearAllProjects();
    TaskManager.clearAllTasks();

    TaskManager.addProject(mockProject);

    expect(TaskManager.getAllProjects()).toContain(mockProject);
    expect(TaskManager.getAllTasks()).toContain(mockTask);
});