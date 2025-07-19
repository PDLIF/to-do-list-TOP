import { Task } from "./Task.js";

describe('Task factory function', () => {
    let task;

    beforeEach(() => {
        task = Task(
            'My Title',
            'My Description',
            '2025-12-31',
            'high',
            'My Project',
            true
        );
    });

    test('initial values are set correctly', () => {
        expect(task.getTitle()).toBe('My Title');
        expect(task.getDescription()).toBe('My Description');
        expect(task.getDueDate()).toBe('2025-12-31');
        expect(task.getPriority()).toBe('high');
        expect(task.getProject()).toBe('My Project');
        expect(task.getIsImportant()).toBe(true);
    });

    test('setters correctly update values', () => {
        task.setTitle('New Title');
        task.setDescription('New Desc');
        task.setDueDate('2026-01-01');
        task.setPriority('low');
        task.setProject('New Project');
        task.setIsImportant(false);

        expect(task.getTitle()).toBe('New Title');
        expect(task.getDescription()).toBe('New Desc');
        expect(task.getDueDate()).toBe('2026-01-01');
        expect(task.getPriority()).toBe('low');
        expect(task.getProject()).toBe('New Project');
        expect(task.getIsImportant()).toBe(false);
    });

    test('serialize returns correct object shape', () => {
        const serialized = task.serialize();
        expect(serialized).toEqual({
            title: 'My Title',
            description: 'My Description',
            dueDate: '2025-12-31',
            priority: 'high',
            project: 'My Project',
            isImportant: true
        });
    });
})