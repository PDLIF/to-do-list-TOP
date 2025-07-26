import { jest } from '@jest/globals';

jest.unstable_mockModule("../task-module/Task.js", () => ({
    Task: jest.fn(),
}));
  
jest.unstable_mockModule("../project-module/Project.js", () => ({
    Project: jest.fn(),
}));

const { TaskManager } = await import("./TaskManager.js");
const { Task } = await import("../task-module/Task.js");
const { Project } = await import("../project-module/Project.js");

describe('ACTIONS WITH PROJECTS', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
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
    });

    test('findProject finds a project by name among all projects', () => {
        const mockProject = {
            getTitle: () => 'Project X',
            getTasks: () => []
        };

        TaskManager.clearAllProjects();
        TaskManager.addProject(mockProject);

        const result = TaskManager.findProject('Project X');
        expect(result).toBe(mockProject);
    });

    test('findProject returns "project not found" if no project matches', () => {
        TaskManager.clearAllProjects();

        const result = TaskManager.findProject('Nonexistent Project');
        expect(result).toBe('project not found');
    });

    test('rebuildProject reconstructs a task with proper arguments', () => {
        const mockTask1 = { title: 'Task 1' }
        const mockTask2 = { title: 'Task 2' }

        const mockAddTask = jest.fn();

        const mockProjectInstance = {
            addTask: mockAddTask,
        }

        Project.mockReturnValue(mockProjectInstance);

        Task
            .mockReturnValueOnce(mockTask1)
            .mockReturnValueOnce(mockTask2);

        const inputData = {
            title: 'My Project',
            tasks: [
                {
                    title: 'Task 1',
                    description: 'Desc 1',
                    dueDate: '2025-08-01',
                    priority: 'high',
                    isImportant: false,
                },
                {
                    title: 'Task 2',
                    description: 'Desc 2',
                    dueDate: '2025-08-02',
                    priority: 'low',
                    isImportant: true,
                }
            ]
        };

        const result = TaskManager.rebuildProject(inputData);

        expect(Project).toHaveBeenCalledWith('My Project');

        expect(Task).toHaveBeenCalledTimes(2);

        expect(Task).toHaveBeenCalledWith(
            'Task 1',
            'Desc 1',
            '2025-08-01',
            'high',
            mockProjectInstance,
            false
        );
    
        expect(Task).toHaveBeenCalledWith(
            'Task 2',
            'Desc 2',
            '2025-08-02',
            'low',
            mockProjectInstance,
            true
        );

        expect(mockAddTask).toHaveBeenCalledWith(mockTask1);
        expect(mockAddTask).toHaveBeenCalledWith(mockTask2);

        expect(result).toBe(mockProjectInstance);
    });
});

describe('ACTIONS WITH TASKS', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test('addTask adds a task to a project', () => {
        const tasksArray = [];
        
        const mockTask = {
            getTitle: () => 'New Task',
        }

        const mockProject = {
            getTitle: () => 'Project A',
            getTasks: () => tasksArray
        }
        
        TaskManager.clearAllProjects();
        TaskManager.addProject(mockProject);
        TaskManager.addTask(mockTask, mockProject)

        expect(mockProject.getTasks()).toContain(mockTask);
    });

    test('addTaskToAll adds a task to the global task list', () => {
        const mockTask = { getTitle: () => 'Global Task' };
    
        TaskManager.clearAllTasks();
        TaskManager.addTaskToAll(mockTask);
    
        expect(TaskManager.getAllTasks()).toContain(mockTask);
    });

    test('deleteTask deletes a task from a project', () => {
        
        const mockTask = {
            getTitle: () => 'New Task',
        }

        const tasksArray = [mockTask];

        const mockProject = {
            getTitle: () => 'Project A',
            getTasks: () => tasksArray
        }

        TaskManager.addProject(mockProject);
        TaskManager.deleteTask(mockTask, mockProject)

        expect(mockProject.getTasks()).not.toContain(mockTask);
    });

    test('findTask finds a task by name among all tasks', () => {
        const mockTask = {
            getTitle: () => 'Task A'
        }

        const mockProject = {
            getTitle: () => 'Project A',
            getTasks: () => [mockTask]
        }

        TaskManager.clearAllProjects();
        TaskManager.addProject(mockProject);

        const result = TaskManager.findTask('Task A');
        expect(result).toBe(mockTask);
    });

    test('findTask returns "task not found" if no task matches', () => {
        const mockProject = {
            getTitle: () => 'Project A',
            getTasks: () => []
        }

        TaskManager.clearAllProjects();
        TaskManager.addProject(mockProject);

        const result = TaskManager.findTask('Nonexistent task');
        expect(result).toBe('task not found');
    });
    
    test('addImportantTasks marks task as important', () => {
        const mockTask = {
            getTitle: () => 'Important Task',
            setIsImportant: jest.fn()
        }
    
        TaskManager.clearImportantTasks();
        TaskManager.addImportantTask(mockTask);
    
        expect(TaskManager.getImportantTasks()).toContain(mockTask);
        expect(mockTask.setIsImportant).toHaveBeenCalledWith(true);
    });

    test('deleteImportantTask unmarks a task as important', () => {
        const mockTask = {
            getTitle: () => 'Important Task',
            setIsImportant: jest.fn()
        }

        TaskManager.clearImportantTasks();
        TaskManager.addImportantTask(mockTask);
        TaskManager.deleteImportantTask(mockTask);

        expect(mockTask.setIsImportant).toHaveBeenCalledWith(false);
        expect(TaskManager.getImportantTasks()).not.toContain(mockTask);
    });

    test('isImportant returns true for important task', () => {
        const mockTask = {
            getTitle: () => 'Important Task',
            setIsImportant: jest.fn()
        }

        TaskManager.clearAllTasks();

        const result = TaskManager.isImportant(mockTask);
        expect(result).toBe(false);
    });

    test('isImportant returns false for non-important task', () => {
        const mockTask = {
            getTitle: () => 'Important Task',
            setIsImportant: jest.fn()
        }

        TaskManager.clearAllTasks();
        TaskManager.addImportantTask(mockTask);

        const result = TaskManager.isImportant(mockTask);
        expect(result).toBe(true);
    });

    test('rebuildTask reconstructs a task with proper arguments', () => {
        const mockProject = { title: 'My Project' }
        const mockTask = { title: 'My Task' }

        Task.mockReturnValue(mockTask);

        const taskData = {
            title: 'My Rebuilt Task',
            description: 'Description',
            dueDate: '2025-08-01',
            priority: 'medium',
            isImportant: true
        }

        const result = TaskManager.rebuildTask(taskData, mockProject);

        expect(Task).toHaveBeenCalledWith(
            'My Rebuilt Task',
            'Description',
            '2025-08-01',
            'medium',
            mockProject,
            true,
        );

        expect(result).toBe(mockTask);
    });
});