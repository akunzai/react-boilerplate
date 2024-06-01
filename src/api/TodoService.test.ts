import { http, HttpResponse } from 'msw';
import { describe, test, expect } from 'vitest';
import { server } from '../mocks/server';
import { Todo } from '../types';
import { TodoService } from './TodoService';

const service = new TodoService();

describe('getTodoList', () => {
  test('should response as expected', async () => {
    const values = await service.getTodoList();
    expect(values.length).toBeGreaterThan(0);
  });
});

describe('getTodo', () => {
  test('should response as expected', async () => {
    const value = await service.getTodo(1);
    expect(value?.id).toBe(1);
    expect(value?.title).toBe('Pay bills');
    expect(value?.done).toBeTruthy();
  });

  test('should return undefined on 404', async () => {
    const value = await service.getTodo(123);
    expect(value).toBeUndefined();
  });
});

describe('addTodo', () => {
  test('should generated id and response as requested with title', async () => {
    const expected = { title: 'Foo' } as Todo;
    const actual = await service.addTodo(expected);
    expect(actual).toBeDefined();
    expect(actual!.id).toBeGreaterThan(0);
    expect(actual!.title).toBe(expected.title);
    expect(actual!.description).toBeUndefined();
    expect(actual!.done).toBeFalsy();
  });

  test('should throws on errors', async () => {
    server.use(
      http.post('/api/todos', () => {
        return new HttpResponse(null, { status: 400 });
      })
    );
    const todo = { title: '' } as Todo;
    try {
      await service.addTodo(todo);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});

describe('updateTodo', () => {
  test('should can retrieve it as expected', async () => {
    const todo = new Todo(3, 'Modified', 'Test', true);
    await service.updateTodo(todo);
    const value = await service.getTodo(todo.id);
    expect(value?.id).toBe(todo.id);
    expect(value?.title).toBe(todo.title);
    expect(value?.description).toBe(todo.description);
    expect(value?.done).toBe(todo.done);
  });
});

test('should throws on error', async () => {
  server.use(
    http.put('/api/todos/999', () => {
      return new HttpResponse(null, { status: 404 });
    })
  );
  const todo = new Todo(999, 'NotFound');
  try {
    await service.updateTodo(todo);
  } catch (e) {
    expect(e).toBeDefined();
  }
});

describe('deleteTodo', () => {
  test('should cannot retrieve it as expected', async () => {
    server.use(
      http.delete('/api/todos/123', () => {
        return new HttpResponse(null, { status: 200 });
      }),
      http.get('/api/todos/123', () => {
        return new HttpResponse(null, { status: 404 });
      })
    );
    const todo = new Todo(123, '');
    await service.deleteTodo(todo);
    const value = await service.getTodo(todo.id);
    expect(value).toBeUndefined();
  });

  test('should throws on error', async () => {
    server.use(
      http.delete('/api/todos/456', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    const todo = new Todo(456, '');
    try {
      await service.deleteTodo(todo);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});
