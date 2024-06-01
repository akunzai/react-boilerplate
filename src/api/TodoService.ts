import { Todo } from '../types';

export class TodoService {
  private baseUrl = '/api/todos';

  getTodoList(): Promise<Todo[]> {
    return fetch(this.baseUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to get todo list');
        }
        return response.json();
      });
  }

  getTodo(id: number): Promise<Todo | undefined> {
    return fetch(`${this.baseUrl}/${id}`)
      .then((response) => {
        if (response.status === 404) {
          return undefined;
        }
        if (!response.ok) {
          throw new Error(`Failed to get todo with id ${id}`);
        }
        return response.json();
      });
  }

  addTodo(todo: Todo): Promise<Todo> {
    return fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(todo),
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      return response.json();
    });
  }

  deleteTodo(todo: Todo): Promise<void> {
    return fetch(`${this.baseUrl}/${todo.id}`, {
      method: 'DELETE',
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to delete todo with id ${todo.id}`);
      }
    });
  }

  updateTodo(todo: Todo): Promise<void> {
    return fetch(`${this.baseUrl}/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(todo),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to update todo with id ${todo.id}`);
      }
    });
  }
}
