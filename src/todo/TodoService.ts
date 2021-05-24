import { Observable, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { catchError, map, switchMap } from 'rxjs/operators';

import Todo from './Todo';

const HEADERS = new Headers({
  'Content-Type': 'application/json',
});

export default class TodoService {
  private todosUrl = '/api/todos';

  getTodos(): Observable<Todo[]> {
    return fromFetch(this.todosUrl).pipe(
      switchMap((response) => {
        if (response.ok) {
          return (response.headers.get('Content-Type')?.endsWith('json')) ? response.json() : response.text();
        }
        throw response.statusText;
      }),
      map((data) => data as Todo[]),
      catchError(this.handleError<Todo[]>('getTodos', []))
    );
  }

  getTodo(id: number): Observable<Todo | undefined> {
    const url = `${this.todosUrl}/${id}`;
    return fromFetch(url).pipe(
      switchMap((response) => {
        if (response.ok) {
          return (response.headers.get('Content-Type')?.endsWith('json')) ? response.json() : response.text();
        }
        throw response.statusText;
      }),
      map((data) => data as Todo),
      catchError(this.handleError<Todo>(`getTodo id=${id}`))
    );
  }

  addTodo(todo: Todo): Observable<Todo> {
    return fromFetch(this.todosUrl, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(todo),
    }).pipe(
      switchMap((response) => {
        if (response.ok) {
          return (response.headers.get('Content-Type')?.endsWith('json')) ? response.json() : response.text();
        }
        throw response.statusText;
      }),
      map((data) => data as Todo),
      catchError(this.handleError<Todo>('addTodo'))
    );
  }

  deleteTodo(todo: Todo): Observable<Todo> {
    const url = `${this.todosUrl}/${todo.id}`;
    return fromFetch(url, {
      method: 'DELETE',
      headers: HEADERS,
    }).pipe(
      switchMap((response) => {
        if (response.ok) {
          return (response.headers.get('Content-Type')?.endsWith('json')) ? response.json() : response.text();
        }
        throw response.statusText;
      }),
      map((data) => data as Todo),
      catchError(this.handleError<Todo>('deleteTask'))
    );
  }

  updateTodo(todo: Todo): Observable<any> {
    const url = `${this.todosUrl}/${todo.id}`;
    return fromFetch(url, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(todo),
    }).pipe(
      switchMap((response) => {
        if (response.ok) {
          return (response.headers.get('Content-Type')?.endsWith('json')) ? response.json() : response.text();
        }
        throw response.statusText;
      }),
      catchError(this.handleError<any>('updateTodo'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
