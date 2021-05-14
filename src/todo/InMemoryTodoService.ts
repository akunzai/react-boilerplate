import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import Todo from './Todo';
import TodoService from './TodoService';

export default class InMemoryTodoService extends TodoService {
  private todos: Todo[] = [
    new Todo(1, 'Pay bills', '', true),
    new Todo(2, 'Read a book'),
    new Todo(3, 'Buy eggs'),
  ];

  getTodos(): Observable<Todo[]> {
    return of(this.todos).pipe(tap((_) => this.log('fetched todos')));
  }

  getTodo(id: number): Observable<Todo | undefined> {
    return of(this.todos.find((x) => x.id === id)).pipe(
      tap((_) => this.log(`fetched todo[${id}]`))
    );
  }

  addTodo(todo: Todo): Observable<Todo> {
    if (!todo.id) {
      todo.id = Math.max(...this.todos.map((todo) => todo.id)) + 1;
    }
    this.todos.push(todo);
    return of(todo).pipe(
      tap((_) =>
        this.log(`added todo[${todo.id}] with ${JSON.stringify(todo)}`)
      )
    );
  }

  deleteTodo(todo: Todo): Observable<Todo> {
    this.todos = this.todos.filter((x) => x !== todo);
    return of(todo).pipe(tap((_) => this.log(`deleted todo[${todo.id}]`)));
  }

  updateTodo(todo: Todo): Observable<any> {
    let index = this.todos.findIndex((x) => x.id === todo.id);
    if (index > -1) {
      this.todos[index] = todo;
    }
    return of(undefined).pipe(
      tap((_) =>
        this.log(`updated todo[${todo.id}] with ${JSON.stringify(todo)}`)
      )
    );
  }
}
