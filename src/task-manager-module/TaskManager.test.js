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

test('deleteProject removes project and its tasks', () => {
    const mockTask = { getTitle: () => 'Task A' };
    const mockProject = {
        getTitle: () => 'Project A',
        getTasks: () => [mockTask]
    };

    TaskManager.clearAllProjects();
    TaskManager.clearAllTasks();
    TaskManager.addProject(mockProject);

    TaskManager.deleteProject('Project A');

    expect(TaskManager.getAllProjects()).not.toContain(mockProject);
    expect(TaskManager.getAllTasks()).not.toContain(mockTask);
})

test('addImportantTasks marks task as important', () => {
    const mockTask = {
        getTitle: () => 'Important Task',
        setIsImportant: jest.fn()
    }

    TaskManager.clearImportantTasks();
    TaskManager.addImportantTask(mockTask);

    expect(TaskManager.getImportantTasks()).toContain(mockTask);
    expect(mockTask.setIsImportant).toHaveBeenCalledWith(true);
})