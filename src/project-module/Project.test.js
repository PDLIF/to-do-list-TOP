import { Project } from './Project.js';

describe('Project factory function', () => {
    test('getTitle returns the correct title', () => {
        const project = Project('New Project');
        expect(project.getTitle()).toBe('New Project');
    });

    test('setTitle updates the title', () => {
        const project = Project('New Project');
        project.setTitle('Project');
        expect(project.getTitle()).toBe('Project');
    });

    test('addTasks and getTasks work correctly', () => {
        const project = Project('New Project');
        const mockTask = { getTitle: () => 'Task X' }
        project.addTask(mockTask);
        expect(project.getTasks()).toContain(mockTask);
    });

    test('findTask returns correct task by title', () => {
        const project = Project('New Project');
        const taskA = {getTitle: () => 'Task A'}
        const taskB = {getTitle: () => 'Task B'}

        project.addTask(taskA);
        project.addTask(taskB);

        expect(project.findTask('Task A')).toBe(taskA);
    });

    test('deleteTask removes a task by title', () => {
        const project = Project('New Project');
        const mockTask = { getTitle: () => 'Task A' }

        project.addTask(mockTask);
        project.deleteTask(mockTask);

        expect(project.getTasks()).not.toContain(mockTask);
    });

    test('serializeProject returns correct structure', () => {
        const mockTask = {
            getTitle: () => 'Serialized Task',
            serialize: () => ({ title: 'Serialized Task' })
        }
        const project = Project('New Project');

        project.addTask(mockTask);

        expect(project.serializeProject()).toEqual({
            title: 'New Project',
            tasks: [{ title: 'Serialized Task' }]
        });
    });
});