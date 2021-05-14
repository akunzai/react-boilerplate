import { Observable, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

import Todo from './Todo';

const HEADERS = new Headers({
  'Content-Type': 'application/json',
});

export default class TodoService {
  private todosUrl = process.env.REACT_APP_TODO_URL!;

  getTodos(): Observable<Todo[]> {
    return fromFetch(this.todosUrl).pipe(
      switchMap((response) => {
        return response.json();
      }),
      map((data) => data as Todo[]),
      tap((_) => this.log('fetched todos')),
      catchError(this.handleError<Todo[]>('getTodos', []))
    );
  }

  getTodo(id: number): Observable<Todo|undefined> {
    const url = `${this.todosUrl}/${id}`;
    return fromFetch(url).pipe(
      switchMap((response) => {
        return response.json();
      }),
      map((data) => data as Todo),
      tap((_) => this.log(`fetched todo[${id}]`)),
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
        return response.json();
      }),
      map((data) => data as Todo),
      tap((newTodo: Todo) =>
        this.log(`added todo[${newTodo.id}] with ${JSON.stringify(todo)}`)
      ),
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
        return response.json();
      }),
      map((data) => data as Todo),
      tap((_) => this.log(`deleted todo[${todo.id}]`)),
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
        return response.json();
      }),
      tap((_) =>
        this.log(`updated todo[${todo.id}] with ${JSON.stringify(todo)}`)
      ),
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

  log(message: string) {
    console.log(message);
  }
}
