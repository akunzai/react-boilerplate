import { http, HttpResponse } from 'msw';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { server } from '../mocks/server';
import { Todo } from '../types';
import { TodoService } from './TodoService';

const service = new TodoService();

beforeAll(() => {
  vi.spyOn(global.console, 'error').mockImplementation(() => undefined);
});

describe('getTodoList', () => {
  test('should response as expected', () =>
    new Promise<void>((done) => {
      service.getTodoList().subscribe((values) => {
        done();
        expect(values.length).toBeGreaterThan(0);
      });
    }));

  test('should return empty result on errors', () =>
    new Promise<void>((done) => {
      server.use(
        http.get('/api/todos', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );
      service.getTodoList().subscribe((values) => {
        done();
        expect(values).toStrictEqual([]);
        expect(console.error).toBeCalled();
      });
    }));
});

describe('getTodo', () => {
  test('should response as expected', () =>
    new Promise<void>((done) => {
      service.getTodo(1).subscribe((value) => {
        done();
        expect(value?.id).toBe(1);
        expect(value?.title).toBe('Pay bills');
        expect(value?.done).toBeTruthy();
      });
    }));

  test('should return undefined on errors', () =>
    new Promise<void>((done) => {
      service.getTodo(123).subscribe((value) => {
        done();
        expect(value).toBeUndefined();
        expect(console.error).toBeCalled();
      });
    }));
});

describe('addTodo', () => {
  test('should generated id and response as requested with title', () =>
    new Promise<void>((done) => {
      const expected = { title: 'Foo' } as Todo;
      service.addTodo(expected).subscribe((actual) => {
        done();
        expect(actual.id).toBeGreaterThan(0);
        expect(actual.title).toBe(expected.title);
        expect(actual.description).toBeUndefined();
        expect(actual.done).toBeFalsy();
      });
    }));

  test('should return undefined on errors', () =>
    new Promise<void>((done) => {
      server.use(
        http.post('/api/todos', () => {
          return new HttpResponse(null, { status: 400 });
        })
      );
      const todo = { title: '' } as Todo;
      service.addTodo(todo).subscribe((value) => {
        done();
        expect(value).toBeUndefined();
        expect(console.error).toBeCalled();
      });
    }));
});

describe('updateTodo', () => {
  test('should can retrieve it as expected', () =>
    new Promise<void>((done) => {
      const todo = new Todo(3, 'Modified', 'Test', true);
      service.updateTodo(todo).subscribe((_) => {
        service.getTodo(todo.id).subscribe((value) => {
          done();
          expect(value?.id).toBe(todo.id);
          expect(value?.title).toBe(todo.title);
          expect(value?.description).toBe(todo.description);
          expect(value?.done).toBe(todo.done);
        });
      });
    }));

  test('should call console.error on errors', () =>
    new Promise<void>((done) => {
      server.use(
        http.put('/api/todos/999', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );
      const todo = new Todo(999, 'NotFound');
      service.updateTodo(todo).subscribe((value) => {
        done();
        expect(value).toBeUndefined();
        expect(console.error).toBeCalled();
      });
    }));
});

describe('deleteTodo', () => {
  test('should cannot retrieve it as expected', () =>
    new Promise<void>((done) => {
      server.use(
        http.delete('/api/todos/123', async ({ request }) => {
          const item = await request.json();
          return HttpResponse.json(item);
        }),
        http.get('/api/todos/123', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );
      const todo = new Todo(123, '');
      service.deleteTodo(todo).subscribe((_) => {
        service.getTodo(todo.id).subscribe((value) => {
          done();
          expect(value).toBeUndefined();
        });
      });
    }));

  test('should return undefined on errors', () =>
    new Promise<void>((done) => {
      server.use(
        http.delete('/api/todos/456', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );
      const todo = new Todo(456, '');
      service.deleteTodo(todo).subscribe((res) => {
        done();
        expect(res).toBeUndefined();
        expect(console.error).toBeCalled();
      });
    }));
});
