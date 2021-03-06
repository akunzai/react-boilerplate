import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { Todo } from '../types';

const HEADERS = new Headers({
  'Content-Type': 'application/json',
});

export class TodoService {
  private todosUrl = '/api/todos';

  getTodos(): Observable<Todo[]> {
    return fromFetch(this.todosUrl).pipe(
      switchMap(this.handleResponse),
      map((data) => data as Todo[]),
      catchError(this.handleError<Todo[]>('getTodos', []))
    );
  }

  getTodo(id: number): Observable<Todo | undefined> {
    const url = `${this.todosUrl}/${id}`;
    return fromFetch(url).pipe(
      switchMap(this.handleResponse),
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
      switchMap(this.handleResponse),
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
      switchMap(this.handleResponse),
      map((data) => data as Todo),
      catchError(this.handleError<Todo>('deleteTask'))
    );
  }

  updateTodo(todo: Todo): Observable<unknown> {
    const url = `${this.todosUrl}/${todo.id}`;
    return fromFetch(url, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(todo),
    }).pipe(
      switchMap(this.handleResponse),
      catchError(this.handleError<unknown>('updateTodo'))
    );
  }

  private handleResponse(response: Response) {
    if (response.ok) {
      return /json/.test(response.headers.get('Content-Type') || '')
        ? response.json()
        : response.text();
    }
    // eslint-disable-next-line no-throw-literal
    throw {
      status: response.status,
      error: response.statusText,
    };
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: unknown): Observable<T> => {
      console.error(`${operation}: ${error}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
